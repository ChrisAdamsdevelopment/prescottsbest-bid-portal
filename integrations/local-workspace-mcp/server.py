"""Private stdio MCP gateway for one explicitly selected MeasuredField checkout.

No HTTP listener, public endpoint, arbitrary shell, or implicit source writes.
OpenAI Secure MCP Tunnel can carry this stdio connection outbound from Windows.
"""
import os
from pathlib import Path

from mcp.server import MCPServer
from core import Workspace

mcp = MCPServer("MeasuredField Private Workspace")

def gateway() -> Workspace:
    root = Path(os.environ.get(
        "MF_MCP_WORKSPACE_ROOT",
        r"D:\GrowthEngineeringVenture\15_INTEGRATION_WORKBENCH_20261111\mf_platform",
    ))
    inbox = Path(os.environ.get(
        "MF_MCP_APPROVAL_INBOX", str(root.parent / "MCP_APPROVAL_INBOX"),
    ))
    board = Path(os.environ.get(
        "MF_MCP_BOARD_DB", str(root.parent / "AGENT_BOARD" / "board.sqlite3"),
    ))
    return Workspace(root, inbox, board)

@mcp.tool()
def workspace_status() -> dict:
    """Use to check the selected repository's branch, commit and modified source files. Read only."""
    return gateway().git_status()

@mcp.tool()
def workspace_list_files(relative_directory: str = "", limit: int = 60) -> dict:
    """Use to browse approved source/doc paths under the one selected Git checkout. Private paths excluded."""
    return gateway().list_files(relative_directory, limit)

@mcp.tool()
def workspace_read_source(relative_path: str) -> dict:
    """Use to read a small source/doc file. Denies path traversal, private files, symlinks, and likely secrets."""
    return gateway().read_source(relative_path)

@mcp.tool()
def agent_board_stories(limit: int = 40) -> dict:
    """Use to inspect MeasuredField agent story statuses and claims, without exposing private discussion bodies."""
    return gateway().board_stories(limit)

@mcp.tool()
def workspace_propose_edit(relative_path: str, new_text: str, reason: str) -> dict:
    """Queue a proposed source edit for HUMAN approval on the PC. This does NOT edit or execute source."""
    return gateway().propose_file_change(relative_path, new_text, reason)

if __name__ == "__main__":
    # Stdio has NO inbound network port. OpenAI tunnel-client can relay it securely.
    mcp.run(transport="stdio")
