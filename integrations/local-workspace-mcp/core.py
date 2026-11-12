"""Restricted, local-first MeasuredField project tools; stdlib only.

No arbitrary shell, network listener, or automatic writes to application files.
"""
from __future__ import annotations

import difflib
import hashlib
import json
import os
import re
import secrets
import sqlite3
import subprocess
from datetime import datetime, timezone
from pathlib import Path

READ_SUFFIXES = {".py", ".md", ".txt", ".json", ".yml", ".yaml", ".toml",
                 ".html", ".css", ".js", ".mjs", ".ts", ".tsx", ".sql", ".ini", ".ps1"}
WRITE_SUFFIXES = READ_SUFFIXES - {".ini", ".ps1"}
BLOCKED = {".git", ".ssh", ".aws", ".config", ".venv", "venv", "node_modules",
           "__pycache__", "data", "secrets", "credentials", "backups", "exports",
           ".pytest_cache", "test-results"}
BLOCKED_NAMES = {"credentials.json", "token.json", "service-account.json",
                 "service_account.json", "secrets.json", "id_rsa", "id_ed25519"}
BLOCKED_SUFFIXES = {".pem", ".p12", ".pfx", ".key", ".db", ".sqlite3", ".sqlite"}
MAX_READ = 65536
MAX_WRITE_PROPOSAL = 32768

# Fail closed if recognizable private credentials are present in text.
SECRETS = [
    re.compile(re.escape("-----BEGIN " + "PRIVATE KEY-----")),
    re.compile(re.escape("-----BEGIN RSA " + "PRIVATE KEY-----")),
    re.compile(re.escape("sk-" + "proj-") + r"[A-Za-z0-9_-]{15,}"),
    re.compile(re.escape("sk-" + "ant-") + r"[A-Za-z0-9_-]{15,}"),
    re.compile(re.escape("gh" + "p_") + r"[A-Za-z0-9]{28,}"),
    re.compile(re.escape("github_" + "pat_") + r"[A-Za-z0-9_]{28,}"),
    re.compile(re.escape("sk_" + "live_") + r"[A-Za-z0-9]{15,}"),
    re.compile(re.escape("AI" + "za") + r"[A-Za-z0-9_-]{30,}"),
    re.compile(r"\b(?:AK" + "IA|AS" + r"IA)[A-Z0-9]{16}\b"),
]

def contains_secret(content: str) -> bool:
    return any(pattern.search(content) for pattern in SECRETS)

class Workspace:
    def __init__(self, root: str | Path, inbox: str | Path, board: str | Path | None = None):
        self.root = Path(root).resolve(strict=True)
        if not self.root.is_dir() or not (self.root / ".git").exists():
            raise ValueError("Explicit existing Git worktree required")
        self.inbox = Path(inbox).resolve(strict=False)
        if self.inbox == self.root or self.inbox.is_relative_to(self.root):
            raise ValueError("Approval inbox must be outside repository")
        self.inbox.mkdir(parents=True, exist_ok=True)
        if self.inbox.is_symlink():
            raise ValueError("Approval inbox must not be a symlink")
        self.board = Path(board) if board else None

    def resolve(self, relative: str, new: bool = False) -> Path:
        if not isinstance(relative, str) or not relative or len(relative) > 300:
            raise ValueError("Short relative path required")
        normalized = relative.replace("\\", "/")
        components = normalized.split("/")
        if (normalized.startswith("/") or ":" in normalized or "\0" in normalized or
            any(c in ("", ".", "..") for c in components) or
            any(ord(c) < 32 for c in normalized)):
            raise ValueError("Invalid or escaping path")
        for part in components:
            name = part.lower()
            if (name in BLOCKED or name in BLOCKED_NAMES or
                name.startswith(".env") or name.endswith((".secret", ".credentials"))):
                raise ValueError("Private path excluded")
        path = self.root.joinpath(*components)
        if path.suffix.lower() in BLOCKED_SUFFIXES:
            raise ValueError("Private file extension")
        check = self.root
        for part in components:
            check = check / part
            if check.is_symlink():
                raise ValueError("Symlink paths excluded")
        resolved = path.resolve(strict=not new)
        if not resolved.is_relative_to(self.root):
            raise ValueError("Path escapes the selected workspace")
        return resolved

    def list_files(self, directory: str = "", limit: int = 60) -> dict:
        if not 1 <= limit <= 100:
            raise ValueError("Invalid listing limit")
        base = self.resolve(directory) if directory else self.root
        if not base.is_dir():
            raise ValueError("Not a directory")
        entries = []
        for path in sorted(base.iterdir(), key=lambda p: p.name.lower()):
            relative = path.relative_to(self.root).as_posix()
            try:
                self.resolve(relative)
            except (ValueError, OSError):
                continue
            if path.is_dir() or (path.is_file() and path.suffix.lower() in READ_SUFFIXES):
                entries.append({"path": relative, "type": "directory" if path.is_dir() else "file"})
            if len(entries) >= limit:
                break
        return {"directory": directory or ".", "entries": entries,
                "possibly_truncated": len(entries) >= limit}

    def read_source(self, relative: str) -> dict:
        target = self.resolve(relative)
        if not target.is_file() or target.suffix.lower() not in READ_SUFFIXES:
            raise ValueError("Not an approved source file")
        if target.stat().st_size > MAX_READ:
            raise ValueError("File too large")
        try:
            text = target.read_text(encoding="utf-8")
        except UnicodeError as exc:
            raise ValueError("Only UTF-8 text") from exc
        if contains_secret(text):
            raise ValueError("Sensitive-looking text; refusing disclosure")
        return {"path": relative, "sha256": hashlib.sha256(text.encode()).hexdigest(),
                "content": text}

    def git_status(self) -> dict:
        def run(*args: str) -> str:
            proc = subprocess.run(["git", "-C", str(self.root), *args],
                                  capture_output=True, text=True, timeout=8,
                                  shell=False, check=False)
            if proc.returncode:
                raise RuntimeError("Git inspection failed")
            return proc.stdout[:10000]
        return {"branch": run("branch", "--show-current").strip(),
                "commit": run("rev-parse", "--short", "HEAD").strip(),
                "tracked_changes": run("status", "--short", "--untracked-files=no").splitlines()[:80]}

    def board_stories(self, limit: int = 40) -> dict:
        if not self.board or not self.board.is_file():
            return {"available": False, "stories": []}
        if not 1 <= limit <= 50:
            raise ValueError("Invalid story limit")
        uri = self.board.resolve(strict=True).as_uri() + "?mode=ro"
        con = sqlite3.connect(uri, uri=True, timeout=3)
        try:
            rows = con.execute(
                "SELECT id,title,status,claimed_by,priority FROM stories ORDER BY priority,id LIMIT ?",
                (limit,)).fetchall()
            fields = ("id", "title", "status", "claimed_by", "priority")
            return {"available": True, "stories": [dict(zip(fields, row)) for row in rows]}
        finally:
            con.close()

    def propose_file_change(self, relative: str, text: str, reason: str) -> dict:
        """Store proposed source change in private inbox; never apply it."""
        if not isinstance(text, str) or len(text.encode("utf-8")) > MAX_WRITE_PROPOSAL:
            raise ValueError("Proposal too large")
        if not reason or len(reason) > 500 or contains_secret(text) or contains_secret(reason):
            raise ValueError("Missing reason or sensitive-looking proposed text")
        target = self.resolve(relative, new=True)
        if target.suffix.lower() not in WRITE_SUFFIXES:
            raise ValueError("Only approved source/doc file types can be proposed")
        if target.exists():
            old = self.read_source(relative)
            old_text, expected_sha = old["content"], old["sha256"]
        else:
            if not target.parent.is_dir():
                raise ValueError("Parent directory must exist")
            old_text, expected_sha = "", None
        diff = "".join(difflib.unified_diff(old_text.splitlines(True), text.splitlines(True),
                    fromfile="current/" + relative, tofile="proposed/" + relative))
        if len(diff) > 12000:
            diff = diff[:12000] + "\n[preview truncated]"
        identifier = secrets.token_hex(16)
        record = {"id": identifier, "path": relative, "reason": reason,
                  "expected_sha256": expected_sha, "proposed_text": text,
                  "created_utc": datetime.now(timezone.utc).isoformat()}
        with (self.inbox / (identifier + ".json")).open("x", encoding="utf-8") as f:
            json.dump(record, f, ensure_ascii=False)
        return {"proposal_id": identifier, "path": relative, "applied": False,
                "requires_local_approval": True, "diff_preview": diff}
