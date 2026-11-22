"""Real-loopback MCP HTTP smoke test; synthetic Git checkout, no ngrok or secrets.

Tests the actual SDK protocol handshake, tool discovery, read-only Git status,
and unauthorized request refusal. Works in Linux and Windows CI.
"""
from __future__ import annotations

import asyncio
import os
import socket
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parents[1]
SERVER = HERE / "http_server.py"
TOKEN = "T" * 64
PORT = 8766
URL = f"http://127.0.0.1:{PORT}/mcp"


def wait_listening() -> None:
    for _ in range(60):
        try:
            with socket.create_connection(("127.0.0.1", PORT), timeout=0.2):
                return
        except OSError:
            time.sleep(0.1)
    raise AssertionError("Local HTTP MCP server did not listen within six seconds")


def test_unauthorized_request() -> None:
    try:
        urllib.request.urlopen(URL, timeout=4)
    except urllib.error.HTTPError as exc:
        assert exc.code == 401, f"Expected 401, got {exc.code}"
    else:
        raise AssertionError("Public anonymous request was not denied")


async def test_real_client() -> None:
    import httpx2
    from mcp import Client
    from mcp.client.streamable_http import streamable_http_client

    async with httpx2.AsyncClient(headers={"Authorization": "Bearer " + TOKEN}) as http:
        async with Client(streamable_http_client(URL, http_client=http)) as client:
            listed = await client.list_tools()
            names = {tool.name for tool in listed.tools}
            expected = {
                "workspace_status", "workspace_list_files",
                "workspace_read_source", "agent_board_stories",
                "workspace_propose_edit",
            }
            assert expected <= names, f"Tool discovery missing: {expected - names}"
            status = await client.call_tool("workspace_status", {})
            assert not status.is_error, "workspace_status failed"
            # MCP tool results can use structuredContent or text content,
            # depending on the SDK / negotiated protocol revision.
            payload = status.structured_content
            if not payload:
                import json
                text_blocks = [block.text for block in status.content
                               if hasattr(block, "text")]
                assert text_blocks, "Expected JSON text or structured result"
                payload = json.loads(text_blocks[0])
            assert isinstance(payload, dict), "Expected Git status object"
            assert payload.get("branch") in ("master", "main"), payload


def main() -> int:
    with tempfile.TemporaryDirectory(prefix="mf_mcp_http_smoke_") as temp:
        root = Path(temp) / "synthetic_repo"
        root.mkdir()
        env = dict(os.environ)
        env.update({
            "MF_MCP_WORKSPACE_ROOT": str(root),
            "MF_MCP_APPROVAL_INBOX": str(Path(temp) / "approvals"),
            "MF_MCP_BOARD_DB": str(Path(temp) / "missing_board.sqlite3"),
            "MF_MCP_HTTP_BEARER_TOKEN": TOKEN,
            "MF_MCP_PUBLIC_HOST": "smoke.ngrok-free.dev",
            "PYTHONDONTWRITEBYTECODE": "1",
        })
        subprocess.run(["git", "init", "-q", str(root)], check=True)
        (root / "README.md").write_text("Synthetic MeasuredField test only\n", encoding="utf-8")
        subprocess.run(["git", "-C", str(root), "add", "README.md"], check=True)
        subprocess.run(["git", "-C", str(root), "-c", "user.name=CI",
                        "-c", "user.email=ci@example.invalid",
                        "commit", "-qm", "synthetic baseline"], check=True)
        p = subprocess.Popen(
            [sys.executable, "-B", str(SERVER)],
            cwd=str(HERE), env=env, stdout=subprocess.DEVNULL,
            stderr=subprocess.PIPE,
        )
        try:
            wait_listening()
            test_unauthorized_request()
            asyncio.run(test_real_client())
            print("HTTP_MCP_SMOKE_PASS: authenticated discovery, tool call, anonymous refusal")
            return 0
        finally:
            p.terminate()
            try:
                _, err = p.communicate(timeout=10)
            except subprocess.TimeoutExpired:
                p.kill()
                _, err = p.communicate(timeout=5)
            if p.returncode not in (0, -15, 1, 2, 15) and err:
                print("Gateway exited unexpectedly; stderr length:", len(err),
                      file=sys.stderr)


if __name__ == "__main__":
    raise SystemExit(main())
