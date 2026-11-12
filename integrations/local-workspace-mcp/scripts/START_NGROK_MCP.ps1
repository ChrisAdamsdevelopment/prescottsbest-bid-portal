# Starts MeasuredField's authenticated local HTTP MCP server and ngrok on Windows.
# The public remodeling website and Render hosting are untouched.
# HTTP bearer token is current-user DPAPI encrypted, never stored in Git.
[CmdletBinding()]
param(
    [Parameter(Mandatory=$true)][string]$PublicUrl,
    [switch]$RevealConnectionToken
)
$ErrorActionPreference = 'Stop'
$base = 'D:\GrowthEngineeringVenture\15_INTEGRATION_WORKBENCH_20261111'
$source = Join-Path $base 'PBC_MCP_SOURCE\integrations\local-workspace-mcp'
$python = Join-Path $base 'LOCAL_WORKSPACE_MCP_GATEWAY\.venv\Scripts\python.exe'
$httpScript = Join-Path $source 'http_server.py'
$repository = Join-Path $base 'mf_platform'
$ngrokExe = (Get-Command ngrok.exe -ErrorAction SilentlyContinue).Source
$port = 8766

if (-not $ngrokExe) {
    throw 'ngrok CLI not installed. Use: winget install ngrok -s msstore'
}
foreach ($item in @($python, $httpScript)) {
    if (-not (Test-Path -LiteralPath $item -PathType Leaf)) {
        throw 'Required MCP executable or HTTP server missing. Update PBC_MCP_SOURCE.'
    }
}
if (-not (Test-Path -LiteralPath (Join-Path $repository '.git'))) {
    throw 'Canonical MeasuredField Git checkout missing.'
}
$uri = $null
if (-not [Uri]::TryCreate($PublicUrl, [UriKind]::Absolute, [ref]$uri) -or
    $uri.Scheme -ne 'https' -or $uri.UserInfo -or $uri.AbsolutePath -ne '/' -or
    $uri.Query -or $uri.Fragment -or $uri.Port -ne 443) {
    throw 'Enter an HTTPS ngrok dev URL, e.g. https://your-assigned-name.ngrok-free.dev'
}
$hostName = $uri.DnsSafeHost.ToLowerInvariant()
if ($hostName -notmatch '^[a-z0-9][a-z0-9.-]+[a-z0-9]$' -or
    $hostName.Contains('..') -or $hostName -notmatch '\.ngrok(-free)?\.(app|dev)$') {
    throw 'This pilot only accepts ngrok-hosted domains, not the remodeling customer domain.'
}
if (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue) {
    throw "Port $port is occupied; refusing to replace an existing local server."
}

# Windows DPAPI protects the random bearer token for the signed-in user.
# It is NOT the ngrok authtoken and NOT an OpenAI model-API credential.
$privateDir = Join-Path $env:LOCALAPPDATA 'MeasuredField'
if (-not (Test-Path -LiteralPath $privateDir)) {
    New-Item -ItemType Directory -Path $privateDir -Force | Out-Null
}
$tokenFile = Join-Path $privateDir 'mcp_http_bearer.dpapi'
$secureToken = $null
if (Test-Path -LiteralPath $tokenFile) {
    $secureToken = (Get-Content -LiteralPath $tokenFile -Raw) | ConvertTo-SecureString
} else {
    $bytes = New-Object 'System.Byte[]' 48
    $rng = [Security.Cryptography.RandomNumberGenerator]::Create()
    try { $rng.GetBytes($bytes) }
    finally { $rng.Dispose() }
    $randomToken = [Convert]::ToBase64String($bytes).TrimEnd('=').Replace('+', '-').Replace('/', '_')
    $secureToken = ConvertTo-SecureString -String $randomToken -AsPlainText -Force
    ($secureToken | ConvertFrom-SecureString) | Set-Content -LiteralPath $tokenFile -NoNewline
    $randomToken = $null
}
$bstr = [IntPtr]::Zero
try {
    $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureToken)
    $env:MF_MCP_HTTP_BEARER_TOKEN = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
} finally {
    if ($bstr -ne [IntPtr]::Zero) {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
    }
    $secureToken.Dispose()
}
$env:MF_MCP_PUBLIC_HOST = $hostName

if ($RevealConnectionToken) {
    Write-Warning 'Copy this bearer token ONLY to private ChatGPT MCP setup. Never post it to chat or GitHub.'
    Write-Host ('Connection bearer token: ' + $env:MF_MCP_HTTP_BEARER_TOKEN)
} else {
    Write-Host 'Bearer token ready. Use -RevealConnectionToken only during MCP plugin setup.'
}

$logDir = Join-Path $privateDir 'logs'
if (-not (Test-Path -LiteralPath $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}
$stdout = Join-Path $logDir 'mcp-http.stdout.log'
$stderr = Join-Path $logDir 'mcp-http.stderr.log'
$child = $null
try {
    Write-Host 'Starting local-only HTTP MCP server at 127.0.0.1:8766/mcp...'
    $child = Start-Process -FilePath $python -ArgumentList @('-B', $httpScript) -WorkingDirectory $source -PassThru -WindowStyle Hidden -RedirectStandardOutput $stdout -RedirectStandardError $stderr
    # Child inherits env; clear plaintext secret from the parent launcher.
    Remove-Item Env:MF_MCP_HTTP_BEARER_TOKEN -ErrorAction SilentlyContinue
    $env:MF_MCP_HTTP_BEARER_TOKEN = $null
    Start-Sleep -Milliseconds 1200
    if ($child.HasExited) {
        throw 'Local HTTP server exited unexpectedly. Inspect private logs on the machine.'
    }
    $status = 0
    try {
        $response = Invoke-WebRequest -Uri "http://127.0.0.1:$port/mcp" -UseBasicParsing -TimeoutSec 4
        $status = [int]$response.StatusCode
    } catch [System.Net.WebException] {
        if ($_.Exception.Response) {
            $status = [int]$_.Exception.Response.StatusCode
        } else {
            throw 'Local HTTP MCP server not responding.'
        }
    }
    if ($status -ne 401) {
        throw "Unauthenticated endpoint returned unexpected status $status; refusing ngrok exposure."
    }
    Write-Host 'Local unauthorized-request test PASSED (401).'
    Write-Host ('Starting HTTPS ngrok endpoint: ' + $PublicUrl + '/mcp')
    Write-Host 'Keep this window open; Ctrl+C stops the tunnel and HTTP server.'
    & $ngrokExe http $port --url $PublicUrl
    if ($LASTEXITCODE -ne 0) {
        throw "ngrok exited with code $LASTEXITCODE. Check ngrok authentication and domain ownership."
    }
} finally {
    Remove-Item Env:MF_MCP_HTTP_BEARER_TOKEN -ErrorAction SilentlyContinue
    Remove-Item Env:MF_MCP_PUBLIC_HOST -ErrorAction SilentlyContinue
    if ($child -and -not $child.HasExited) {
        Stop-Process -Id $child.Id -ErrorAction SilentlyContinue
        Write-Host 'Local MCP HTTP server stopped.'
    }
}
