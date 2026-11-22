# Starts a private OpenAI Secure MCP Tunnel from the local Windows computer.
# Requires a tunnel ID and a RESTRICTED runtime API key provisioned in OpenAI Platform.
# Never records an API key in Git, a profile, a file, process arguments or PowerShell history.
# Runs in the foreground; closing this PowerShell session disconnects the private MCP tunnel.
[CmdletBinding()]
param(
    [string]$TunnelId,
    [string]$Profile = 'measuredfield-triple7',
    [switch]$SkipInit,
    [switch]$DoctorOnly
)
$ErrorActionPreference = 'Stop'
$root = 'D:\GrowthEngineeringVenture\15_INTEGRATION_WORKBENCH_20261111'
$exe = Join-Path $root 'TUNNEL_CLIENT\bin\tunnel-client.exe'
$python = Join-Path $root 'LOCAL_WORKSPACE_MCP_GATEWAY\.venv\Scripts\python.exe'
$server = Join-Path $root 'LOCAL_WORKSPACE_MCP_GATEWAY\server.py'
$workspace = Join-Path $root 'mf_platform'

foreach ($item in @($exe, $python, $server)) {
    if (-not (Test-Path -LiteralPath $item -PathType Leaf)) {
        throw 'Required installed component missing. Run BOOTSTRAP_WINDOWS.ps1 first.'
    }
}
if (-not (Test-Path (Join-Path $workspace '.git'))) {
    throw 'Canonical MeasuredField Git workspace is missing.'
}
if ($Profile -notmatch '^[a-zA-Z0-9_-]{1,64}$') {
    throw 'Invalid local profile name.'
}
if (-not $SkipInit) {
    if (-not $TunnelId) {
        $TunnelId = Read-Host 'Enter the tunnel ID from OpenAI Platform (not the API key)'
    }
    if ($TunnelId -notmatch '^tunnel_[A-Za-z0-9_-]{12,128}$') {
        throw 'Invalid tunnel ID format. Create or copy the ID from Platform Tunnels.'
    }
}

Write-Host 'This runs the private tunnel in the current PowerShell window.'
Write-Host 'Use a Platform runtime key with Tunnels Read + Use, NOT an admin API key.'
Write-Host 'The key will be requested without echoing its characters or storing it.'
$secureKey = Read-Host 'Enter restricted runtime API key' -AsSecureString
if (-not $secureKey -or $secureKey.Length -lt 16) {
    throw 'A runtime API key is required.'
}
$bstr = [IntPtr]::Zero
try {
    $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)
    $env:CONTROL_PLANE_API_KEY = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
} finally {
    if ($bstr -ne [IntPtr]::Zero) {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
    }
    $secureKey.Dispose()
    $secureKey = $null
}
try {
    if (-not $SkipInit) {
        # Executable and server path contain no spaces in this fixed installation.
        # This value is a local command only, never an API key.
        # The tunnel-client parses --mcp-command using Unix-style shell word rules.
        # Literal Windows backslashes get consumed as escape characters and corrupt
        # paths (D:\\foo becomes D:foo). Win32 Python accepts forward slashes.
        $mcpPython = $python.Replace('\', '/')
        $mcpServer = $server.Replace('\', '/')
        $mcpCommand = $mcpPython + ' ' + $mcpServer
        if ($mcpCommand.Contains('\') -or
            -not (Test-Path -LiteralPath $mcpPython -PathType Leaf) -or
            -not (Test-Path -LiteralPath $mcpServer -PathType Leaf)) {
            throw 'Windows MCP executable/script path verification failed.'
        }
        Write-Host 'Initializing a local stdio MCP tunnel profile...'
        & $exe init --sample sample_mcp_stdio_local --profile $Profile --tunnel-id $TunnelId --mcp-command $mcpCommand
        if ($LASTEXITCODE -ne 0) {
            throw 'Profile initialization failed; inspect tunnel-client help and existing profiles.'
        }
    }
    Write-Host 'Running official health and permission checks...'
    & $exe doctor --profile $Profile --explain
    if ($LASTEXITCODE -ne 0) {
        throw 'Tunnel doctor failed. Check tunnel ID, Tunnels Read + Use permissions and MCP child startup.'
    }
    if ($DoctorOnly) {
        Write-Host 'Doctor passed. Connection not left running because -DoctorOnly was requested.'
        return
    }
    Write-Host ''
    Write-Host 'Starting outbound private MCP tunnel. Leave this window open.'
    Write-Host 'Use Ctrl+C to stop forwarding remote MCP requests.'
    & $exe run --profile $Profile
    if ($LASTEXITCODE -ne 0) {
        throw "Tunnel client exited with code $LASTEXITCODE."
    }
} finally {
    # The daemon needs the key in its process environment while running.
    # This clears the key from this PowerShell process when it exits.
    Remove-Item Env:CONTROL_PLANE_API_KEY -ErrorAction SilentlyContinue
    $env:CONTROL_PLANE_API_KEY = $null
    Write-Host 'Tunnel session ended; local runtime key cleared from this PowerShell process.'
}
