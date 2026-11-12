# Verifies the actual MCP imports under Windows PowerShell with the chosen Python.
# This script is run by both the D: bootstrap and Windows CI.
[CmdletBinding()]
param(
    [Parameter(Mandatory=$true)][string]$PythonExe,
    [Parameter(Mandatory=$true)][string]$GatewayDir
)
$ErrorActionPreference = 'Stop'
if (-not (Test-Path -LiteralPath $PythonExe -PathType Leaf)) {
    throw "Python executable missing at supplied path."
}
if (-not (Test-Path -LiteralPath (Join-Path $GatewayDir 'server.py') -PathType Leaf)) {
    throw "MCP server.py missing from supplied directory."
}

# Do not put double-quoted string literals inside the Python -c arguments:
# Windows PowerShell 5.1 can strip those quotes when passing native arguments.
& $PythonExe -c 'from mcp.server.mcpserver import MCPServer'
if ($LASTEXITCODE -ne 0) { throw "MCP SDK import failed." }
Write-Host 'MCP SDK import verified'

& $PythonExe -c 'import sys; sys.path.insert(0, sys.argv[1]); import server' $GatewayDir
if ($LASTEXITCODE -ne 0) { throw "MeasuredField MCP server import failed." }
Write-Host 'MeasuredField MCP server import verified'

Write-Host 'Windows MCP import smoke check passed.'
