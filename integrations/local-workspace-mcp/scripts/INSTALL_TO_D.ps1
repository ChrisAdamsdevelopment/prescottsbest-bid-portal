# Safe local installation; run from a checked-out copy of this folder.
$ErrorActionPreference = 'Stop'
$base='D:\GrowthEngineeringVenture\15_INTEGRATION_WORKBENCH_20261111'
$repo=Join-Path $base 'mf_platform'
$target=Join-Path $base 'LOCAL_WORKSPACE_MCP_GATEWAY'
$source=(Resolve-Path (Join-Path $PSScriptRoot '..')).Path
if (-not (Test-Path (Join-Path $repo '.git'))) {
    throw 'MeasuredField Git workspace missing. Nothing installed.'
}
if (Test-Path -LiteralPath $target) {
    throw 'Local MCP folder exists. Refusing to overwrite without review.'
}
$python=(Get-Command python.exe -ErrorAction Stop).Source
New-Item -ItemType Directory -Path $target | Out-Null
foreach($file in @('core.py','server.py','local_approve.py','requirements.txt')) {
    Copy-Item -LiteralPath (Join-Path $source $file) -Destination (Join-Path $target $file)
}
& $python -m venv (Join-Path $target '.venv')
if ($LASTEXITCODE -ne 0) {throw 'Virtualenv initialization failed'}
$venvPy=Join-Path $target '.venv\Scripts\python.exe'
& $venvPy -m pip install -r (Join-Path $target 'requirements.txt')
if ($LASTEXITCODE -ne 0) {throw 'MCP SDK install failed. No service started.'}
$launcher=@'
@echo off
set "MF_MCP_WORKSPACE_ROOT=D:\GrowthEngineeringVenture\15_INTEGRATION_WORKBENCH_20261111\mf_platform"
set "MF_MCP_BOARD_DB=D:\GrowthEngineeringVenture\15_INTEGRATION_WORKBENCH_20261111\AGENT_BOARD\board.sqlite3"
set "MF_MCP_APPROVAL_INBOX=D:\GrowthEngineeringVenture\15_INTEGRATION_WORKBENCH_20261111\MCP_APPROVAL_INBOX"
"D:\GrowthEngineeringVenture\15_INTEGRATION_WORKBENCH_20261111\LOCAL_WORKSPACE_MCP_GATEWAY\.venv\Scripts\python.exe" "D:\GrowthEngineeringVenture\15_INTEGRATION_WORKBENCH_20261111\LOCAL_WORKSPACE_MCP_GATEWAY\server.py"
'@
[IO.File]::WriteAllText((Join-Path $target 'START_LOCAL_MCP.cmd'),$launcher,[Text.Encoding]::ASCII)
Write-Output 'Local gateway installed. Nothing is exposed to the internet.'
Write-Output 'Use MCP stdio command: cmd.exe /c D:\GrowthEngineeringVenture\15_INTEGRATION_WORKBENCH_20261111\LOCAL_WORKSPACE_MCP_GATEWAY\START_LOCAL_MCP.cmd'
