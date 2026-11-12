"""Synthetic tests only. No customer data, live passwords, or remote service."""
import json
import os
import sqlite3
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from core import Workspace

class WorkspaceGatewayTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="mf_mcp_tests_")
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name) / "mf_platform"
        self.root.mkdir()
        subprocess.run(["git", "init", "-q", str(self.root)], capture_output=True, check=True)
        self.inbox = Path(self.temp.name) / "private_inbox"
        self.gateway = Workspace(self.root, self.inbox)

    def write(self, name, value):
        p = self.root / name
        p.parent.mkdir(exist_ok=True, parents=True)
        p.write_text(value, encoding="utf-8")
        return p

    def test_read_and_directory(self):
        self.write("docs/notes.md", "Synthetic note\n")
        self.assertEqual(self.gateway.read_source("docs/notes.md")["content"], "Synthetic note\n")
        self.assertEqual(self.gateway.list_files("docs")["entries"][0]["path"], "docs/notes.md")

    def test_no_directory_traversal_or_private_files(self):
        for name in ("../private.txt", "/etc/passwd", "C:\\Users\\private\\a.py",
                     ".git/config", ".env", ".env.production", "docs/../a.py",
                     "docs//a.py", "data/account.md", "app/token.json",
                     "private/key.pem", "a:b.py"):
            with self.subTest(name=name), self.assertRaises(ValueError):
                self.gateway.read_source(name)

    def test_symlink_cannot_escape_workspace(self):
        private = Path(self.temp.name) / "private.txt"
        private.write_text("secret data")
        try:
            (self.root / "escape.txt").symlink_to(private)
        except OSError:
            self.skipTest("Symbolic links unavailable")
        with self.assertRaises(ValueError):
            self.gateway.read_source("escape.txt")

    def test_token_looking_text_not_exposed(self):
        token = "gh" + "p_" + "x" * 36
        self.write("docs/private.md", token)
        with self.assertRaisesRegex(ValueError, "Sensitive-looking"):
            self.gateway.read_source("docs/private.md")

    def test_large_binary_and_unknown_extension_blocked(self):
        self.write("docs/large.md", "z" * 70000)
        with self.assertRaisesRegex(ValueError, "too large"):
            self.gateway.read_source("docs/large.md")
        self.write("app/program.exe", "data")
        with self.assertRaises(ValueError):
            self.gateway.read_source("app/program.exe")

    def test_proposal_does_not_write_source(self):
        current = self.write("app/example.py", "a=1\n")
        item = self.gateway.propose_file_change("app/example.py", "a=2\n", "Synthetic update")
        self.assertEqual(current.read_text(), "a=1\n")
        self.assertFalse(item["applied"])
        self.assertTrue(item["requires_local_approval"])
        record = json.loads((self.inbox / (item["proposal_id"] + ".json")).read_text())
        self.assertEqual(record["path"], "app/example.py")
        self.assertEqual(record["proposed_text"], "a=2\n")

    def test_proposed_new_file_not_created(self):
        (self.root / "docs").mkdir()
        item = self.gateway.propose_file_change("docs/new.md", "Hello", "Synthetic document")
        self.assertFalse((self.root / "docs/new.md").exists())
        self.assertTrue((self.inbox / (item["proposal_id"] + ".json")).is_file())

    def test_secret_proposal_rejected(self):
        with self.assertRaises(ValueError):
            self.gateway.propose_file_change("README.md", "gh" + "p_" + "Y" * 35, "bad")

    def test_git_status_is_fixed_read_only_command(self):
        self.write("README.md", "a")
        subprocess.run(["git", "-C", str(self.root), "add", "README.md"], check=True)
        subprocess.run(["git", "-C", str(self.root), "-c", "user.name=Test",
                        "-c", "user.email=test@example.invalid", "commit", "-qm", "Initial"],
                       check=True)
        self.assertEqual(self.gateway.git_status()["tracked_changes"], [])

    def test_agent_board_exposes_only_claim_summary(self):
        board = Path(self.temp.name) / "board.sqlite3"
        with sqlite3.connect(board) as db:
            db.execute("CREATE TABLE stories(id TEXT,title TEXT,status TEXT,claimed_by TEXT,priority INTEGER)")
            db.execute("INSERT INTO stories VALUES(?,?,?,?,?)",
                       ("MF-012", "Remote connector", "ready", None, 1))
        result = Workspace(self.root, self.inbox, board).board_stories()
        self.assertTrue(result["available"])
        self.assertEqual(result["stories"][0]["id"], "MF-012")
        self.assertEqual(set(result["stories"][0]),
                         {"id", "title", "status", "claimed_by", "priority"})

    def test_noninteractive_approval_cannot_apply(self):
        current = self.write("docs/demo.md", "old")
        proposal = self.gateway.propose_file_change("docs/demo.md", "new", "Safe test")
        env = dict(os.environ, MF_MCP_WORKSPACE_ROOT=str(self.root),
                   MF_MCP_APPROVAL_INBOX=str(self.inbox))
        result = subprocess.run(
            [sys.executable, str(Path(__file__).resolve().parents[1] / "local_approve.py"),
             proposal["proposal_id"]],
            input="APPLY " + proposal["proposal_id"], capture_output=True, text=True, env=env)
        self.assertEqual(result.returncode, 2)
        self.assertEqual(current.read_text(), "old")

if __name__ == "__main__":
    unittest.main()
