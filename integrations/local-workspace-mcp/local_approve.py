"""On-device interactive approval for a previously queued source-edit proposal.

This is intentionally NOT an MCP tool. No remote model can invoke it.
"""
import hashlib
import json
import os
import re
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path

from core import Workspace, contains_secret

def main() -> int:
    if len(sys.argv) != 2 or not re.fullmatch(r"[a-f0-9]{32}", sys.argv[1]):
        print("Usage: python local_approve.py <32-character-proposal-id>")
        return 2
    if not sys.stdin.isatty():
        print("Interactive, on-device terminal is required.")
        return 2
    ident = sys.argv[1]
    root = Path(os.environ.get(
        "MF_MCP_WORKSPACE_ROOT",
        r"D:\GrowthEngineeringVenture\15_INTEGRATION_WORKBENCH_20261111\mf_platform"))
    inbox = Path(os.environ.get("MF_MCP_APPROVAL_INBOX",
                               str(root.parent / "MCP_APPROVAL_INBOX")))
    gate = Workspace(root, inbox)
    path = gate.inbox / (ident + ".json")
    if path.is_symlink() or not path.is_file():
        print("Proposal not found")
        return 2
    record = json.loads(path.read_text(encoding="utf-8"))
    if record.get("id") != ident:
        print("Proposal ID mismatch")
        return 2
    target = gate.resolve(record["path"], new=True)
    text = record["proposed_text"]
    if contains_secret(text):
        print("Sensitive-looking proposal rejected")
        return 2
    expected = record.get("expected_sha256")
    if target.exists():
        current = gate.read_source(record["path"])
        if current["sha256"] != expected:
            print("Source has changed. Regenerate proposal.")
            return 2
    elif expected is not None:
        print("Original file is missing. Regenerate proposal.")
        return 2
    print("File:", record["path"])
    print("Reason:", record["reason"])
    print("Original SHA:", expected)
    print("Proposed SHA:", hashlib.sha256(text.encode()).hexdigest())
    print("Review the entire proposed file before approving:", path)
    phrase = "APPLY " + ident
    if input("Type " + phrase + " to approve: ").strip() != phrase:
        print("No changes applied.")
        return 1
    fd, tmp = tempfile.mkstemp(dir=target.parent, prefix=".mcp-approved-", suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8", newline="\n") as f:
            f.write(text)
        os.replace(tmp, target)
    finally:
        if os.path.exists(tmp):
            os.unlink(tmp)
    with (gate.inbox / "approvals.jsonl").open("a", encoding="utf-8") as f:
        f.write(json.dumps({
            "id": ident, "path": record["path"],
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "sha256": hashlib.sha256(text.encode()).hexdigest(),
        }) + "\n")
    path.rename(gate.inbox / (ident + ".applied.json"))
    print("Applied locally. Review Git diff and run tests before committing.")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
