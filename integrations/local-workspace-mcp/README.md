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

## Connect ChatGPT after the gateway is installed on D:

1. In https://platform.openai.com/settings/organization/tunnels create an MCP tunnel associated with the intended ChatGPT workspace. Keep its tunnel ID.
2. In https://platform.openai.com/settings/organization/api-keys create a restricted runtime API key with Tunnels Read + Use permission. Never paste the key into chat or GitHub.
3. Update the local Git checkout. Then use Windows PowerShell to run:

    $root = 'D:\GrowthEngineeringVenture\15_INTEGRATION_WORKBENCH_20261111'
    $script = "$root\PBC_MCP_SOURCE\integrations\local-workspace-mcp\scripts\CONNECT_TUNNEL_WINDOWS.ps1"
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File $script

The script securely prompts for a tunnel ID and restricted runtime key, initializes a local stdio profile, runs the official doctor health checks, and then starts the outbound tunnel. Leave PowerShell open while connected. Ctrl+C stops the tunnel.

4. In ChatGPT on web: Plugins > + > Add custom MCP server > Connection: Tunnel. Select the same tunnel ID, review permissions, and create the private plugin. Call workspace_status first to verify actual tool use.
5. To restart a previously initialized profile, run the same script with -SkipInit. For stdio configurations run only one tunnel-client per tunnel ID at once.

This pilot offers restricted project inspection and local-human-approved source proposals; it is not unrestricted PowerShell or remote desktop. Successful installation is not proof of remote access; verify a real ChatGPT MCP tool call.

## Alternative transport: authenticated ngrok HTTP (Forge-style)

Forge-AI used ngrok -> a FastMCP Streamable HTTP server on port 8000. This
pilot now also supports Streamable HTTP at local `127.0.0.1:8766/mcp`,
without changing the existing `stdio` transport or Render's customer portal.

1. Update `PBC_MCP_SOURCE` to the current `feature/private-local-mcp-bridge`
   branch with `git -C <source> pull --ff-only`.
2. Install the official ngrok Windows CLI if needed:
   https://ngrok.com/download/windows ; `winget install ngrok -s msstore`.
   Reopen PowerShell after installation. If a stale Chocolatey shim points at
   a deleted executable, the launcher skips it and tries other PATH entries.
   You can also pass `-NgrokExe 'C:\full\path\ngrok.exe'` to choose the real
   executable explicitly.
3. Find your ngrok account's assigned dev domain on the ngrok dashboard.
   Configure the account locally using the hidden prompt below. **Never**
   place the ngrok authtoken in Render, a GitHub repo, or chat.
4. On TRIPLE7, run the updated launcher. A bare hostname is accepted; the
   launcher adds HTTPS when necessary.

    $root = 'D:\GrowthEngineeringVenture\15_INTEGRATION_WORKBENCH_20261111'
    $run = "$root\PBC_MCP_SOURCE\integrations\local-workspace-mcp\scripts\START_NGROK_MCP.ps1"
    $domain = 'nintendo-corncob-animal.ngrok-free.dev'  # replace if not your current account domain
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File $run -PublicUrl $domain -CheckOnly
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File $run -PublicUrl $domain -ConfigureNgrokAuth
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File $run -PublicUrl $domain

   The script requires the existing MCP Python virtualenv, starts a localhost-
   only server, checks that anonymous requests receive HTTP 401, then starts
   ngrok on the assigned HTTPS domain. Keep that terminal open; Ctrl+C closes
   the ngrok process and local service. No incoming Windows firewall rule.

5. When privately adding the server as a custom MCP plugin in ChatGPT Work,
   enter `https://YOUR-ASSIGNED-NGROK-DOMAIN/mcp`. Choose **API-key / Bearer**
   authentication *if your eligible ChatGPT workspace's connector setup
   supports it*. To view the secret ONLY on the LOCAL Windows terminal, rerun
   the launcher with `-RevealConnectionToken` and enter the returned value
   directly in the ChatGPT secure connection form. Never paste it into chat.

   If the plugin setup does not offer fixed API-key authentication, do not
   switch to `No authentication` or expose a public unauthenticated gateway.
   Use the already installed OpenAI Secure MCP Tunnel, or add an actual
   OAuth 2.1 authorization server before enabling the public endpoint.

6. Test real MCP tool discovery and `workspace_status` from ChatGPT. Only
   then is the remote connection verified; a local CI test does not prove
   the user's ChatGPT workspace has permission to add/use that custom plugin.

**Security:** Requests are checked for an exact HTTPS forwarding hostname,
a high-entropy bearer secret, duplicate HTTP Host/auth headers, DNS rebinding,
and payload size. Browser Origin requests are rejected. The bearer token is
DPAPI-encrypted for the local Windows user, outside Git. The server cannot
be directly reached off the loopback interface. A publicly reachable ngrok
endpoint can still be scanned/attacked; keep it off when not in use. Pilot tools
remain narrowly scoped and require separate on-device approval for edits.
ngrok may log traffic in its request inspector; use synthetic project data
until you have confirmed that your privacy and retention settings are suitable.

No OpenAI model inference API is called by this gateway or its ngrok launcher.
Plugin availability, ChatGPT subscription usage, and ngrok traffic limits
are separate product policies. Never configure the ngrok credentials in
the public Render remodeling website environment.

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
