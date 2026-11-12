# MeasuredField Private Workspace MCP Gateway — development pilot

**NOT DEPLOYED.** No changes to the existing customer site, Render service, DNS, firewall, billing or production environment. This is an isolated source folder in the Prescott's Best bid-portal GitHub repository, NOT part of its running server.

GitHub stores source code. It cannot independently tunnel into a Windows computer. This package implements a limited private MCP service using the official Python SDK v2 and stdio transport.

## Architecture

ChatGPT → OpenAI Secure MCP Tunnel (outbound-only HTTPS from Windows) → private stdio MCP service → selected MeasuredField Git workspace.

Claude Code and Antigravity can connect to the same local MCP service directly using stdio, without a tunnel.

This is a limited development gateway, **not a replacement for Desktop Commander**. There is no remote desktop or arbitrary terminal access, browser control, customer data access, remote process launcher, automatic Git push or automatic source modification.

## The five available tools

- workspace_status: view branch, commit and tracked Git changes.
- workspace_list_files: list approved source files and documentation.
- workspace_read_source: read small UTF-8 source files; refuse private paths, symlinks and likely keys.
- agent_board_stories: read story status and claim summaries from the shared local board, not private message bodies.
- workspace_propose_edit: queue a proposed source edit in a private folder; requires separate local human approval and never edits source itself.

The workspace is restricted to D:\GrowthEngineeringVenture\15_INTEGRATION_WORKBENCH_20261111\mf_platform, NOT arbitrary D-drive files.

## Install it on Windows

Prerequisites: Python 3.11+ (3.12 recommended), an existing MeasuredField Git checkout, and permission to install Python packages.

Download this branch or merge the reviewed PR, then open PowerShell in this folder and run:

~~~powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\INSTALL_TO_D.ps1
~~~

It creates the standalone folder:

D:\GrowthEngineeringVenture\15_INTEGRATION_WORKBENCH_20261111\LOCAL_WORKSPACE_MCP_GATEWAY

including a private .venv and START_LOCAL_MCP.cmd launcher. It refuses to overwrite an existing installation. It **does not start or configure any tunnel**.

## Claude Code stdio integration

After installation, inspect your CLI's current MCP options and add:

~~~powershell
claude mcp add --scope user --transport stdio measuredfield-local -- cmd.exe /c "D:\GrowthEngineeringVenture\15_INTEGRATION_WORKBENCH_20261111\LOCAL_WORKSPACE_MCP_GATEWAY\START_LOCAL_MCP.cmd"
~~~

Verify with the /mcp interface in Claude.

## Antigravity and Gemini

Merge, rather than overwrite, this entry in the existing workspace .agents/mcp_config.json:

~~~json
{
  "mcpServers": {
    "measuredfield-local": {
      "command": "cmd.exe",
      "args": ["/c", "D:\\GrowthEngineeringVenture\\15_INTEGRATION_WORKBENCH_20261111\\LOCAL_WORKSPACE_MCP_GATEWAY\\START_LOCAL_MCP.cmd"]
    }
  }
}
~~~

Reload MCP servers. Do not put API keys inside the configuration.

## ChatGPT outside the computer: Secure MCP Tunnel

Use the [official OpenAI guide](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels) and [official tunnel-client releases](https://github.com/openai/tunnel-client/releases/latest).

1. Create an OpenAI Platform tunnel and obtain a tunnel ID and runtime API key using authorized Platform settings. Keep credentials out of Git and the agent board.
2. Install the official Windows tunnel-client release and verify it according to its published instructions.
3. Initialize a named profile pointing to the local stdio launcher using --mcp-command.
4. Run tunnel-client doctor --profile PROFILE --explain, then tunnel-client run --profile PROFILE.
5. On an eligible ChatGPT workspace, add a custom MCP server choosing Tunnel and review available tools and approval controls.

The Platform organization and ChatGPT workspace permissions are separate. This code does not create a tunnel, register OAuth credentials, publish a plugin or connect any account.

## Human approval for proposed edits

A remote MCP tool call can only queue a proposal in the local MCP_APPROVAL_INBOX directory. The owner opens the proposal and may run local_approve.py from an **interactive Windows terminal**, explicitly typing APPLY plus the proposal ID. The script verifies the old source SHA before applying it and writes a basic audit record.

Example after installation:

~~~powershell
$env:MF_MCP_WORKSPACE_ROOT='D:\GrowthEngineeringVenture\15_INTEGRATION_WORKBENCH_20261111\mf_platform'
$env:MF_MCP_APPROVAL_INBOX='D:\GrowthEngineeringVenture\15_INTEGRATION_WORKBENCH_20261111\MCP_APPROVAL_INBOX'
& 'D:\GrowthEngineeringVenture\15_INTEGRATION_WORKBENCH_20261111\LOCAL_WORKSPACE_MCP_GATEWAY\.venv\Scripts\python.exe' 'D:\GrowthEngineeringVenture\15_INTEGRATION_WORKBENCH_20261111\LOCAL_WORKSPACE_MCP_GATEWAY\local_approve.py' PROPOSAL_ID
~~~

A proposed edit is not automatically tested, committed or deployed. Agents must continue using the shared story board and main-branch integration gate.

## Why not prescottsbestremodeling.com/mcp?

That is a public customer website, not an appropriate location for a Windows computer-control service. Do not modify its production server or expose a general terminal there.

A dedicated future subdomain, such as agent.prescottsbestremodeling.com, would require separate HTTPS hosting, OAuth 2.1, strong client identity verification, tool authorization, audit logging, rate limits, and explicit deployment review. This pilot makes **no DNS or domain changes**.

## Verify

~~~text
python -m unittest discover -s tests -v
python -m py_compile core.py server.py local_approve.py
~~~

Core tests use synthetic data and an isolated test Git repository. Real Windows installation, official SDK MCP discovery, OpenAI tunnel registration, account linking, and external Claude/Gemini use **remain unverified** until tested on the actual PC.

The path and token filtering are defense in depth, not a claim of complete secret detection or production security.
