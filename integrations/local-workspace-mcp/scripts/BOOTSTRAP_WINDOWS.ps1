# MeasuredField private MCP bootstrap for Windows PowerShell 5.1+
# Installs the reviewed experimental stdio MCP gateway and OpenAI tunnel-client.
# NO SSH private keys, API keys, passwords, firewall changes or public ports.
# NO tunnel activation: a Platform account admin must create/authorize the tunnel.
# The public Prescott's Best Remodeling website remains unchanged.
[CmdletBinding()]
param(
    [switch]$SkipTunnelClient,
    [switch]$SkipGateway
)
$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$base = 'D:\GrowthEngineeringVenture\15_INTEGRATION_WORKBENCH_20261111'
$source = Join-Path $base 'PBC_MCP_SOURCE'
$gateway = Join-Path $base 'LOCAL_WORKSPACE_MCP_GATEWAY'
$repoUrl = 'https://github.com/ChrisAdamsdevelopment/prescottsbest-bid-portal.git'
$branch = 'feature/private-local-mcp-bridge'

function Assert-Success([string]$Action) {
    if ($LASTEXITCODE -ne 0) { throw "$Action failed (exit code $LASTEXITCODE)." }
}
function Install-Sources {
    if (-not (Get-Command git.exe -ErrorAction SilentlyContinue)) {
        throw 'Git not found in PATH. Install Git for Windows and rerun.'
    }
    if (-not (Test-Path -LiteralPath $source)) {
        Write-Host 'Downloading the isolated MCP source branch...'
        & git clone --depth 1 --branch $branch -- $repoUrl $source
        Assert-Success 'Git clone'
    } else {
        if (-not (Test-Path (Join-Path $source '.git'))) {
            throw 'Source directory exists but is not Git: refusing overwrite.'
        }
        $origin = (& git -C $source config --get remote.origin.url).Trim()
        if ($origin -ne $repoUrl) {
            throw 'Unexpected existing source Git remote. Refusing to use it.'
        }
        $actualBranch = (& git -C $source branch --show-current).Trim()
        if ($actualBranch -ne $branch) {
            throw "Existing source branch is $actualBranch, expected $branch. Review manually."
        }
        if (& git -C $source status --porcelain) {
            throw 'Source checkout contains edits; refusing to update it.'
        }
        Write-Host 'Existing gateway source checkout verified. Not auto-pulling changes.'
    }
    $folder = Join-Path $source 'integrations\local-workspace-mcp'
    if (-not (Test-Path -LiteralPath (Join-Path $folder 'scripts\INSTALL_TO_D.ps1'))) {
        throw 'Gateway installer missing from checked-out source.'
    }
    return $folder
}

if (-not (Test-Path -LiteralPath $base)) {
    throw "Missing expected MeasuredField project root: $base"
}
if (-not (Test-Path -LiteralPath (Join-Path $base 'mf_platform\.git'))) {
    throw 'Canonical MeasuredField Git checkout is not present. Aborting.'
}
if (-not (Get-Command python.exe -ErrorAction SilentlyContinue)) {
    throw 'Python is missing from PATH.'
}
$projectFolder = Install-Sources

if (-not $SkipGateway) {
    if (-not (Test-Path -LiteralPath $gateway)) {
        Write-Host 'Installing the private, bounded local MCP gateway...'
        & powershell.exe -NoProfile -ExecutionPolicy Bypass -File (Join-Path $projectFolder 'scripts\INSTALL_TO_D.ps1')
        Assert-Success 'Local gateway installer'
    } else {
        Write-Host 'Local MCP gateway already exists; not overwriting.'
    }
}
$python = Join-Path $gateway '.venv\Scripts\python.exe'
if (Test-Path -LiteralPath $python) {
    Write-Host 'Verifying installed MCP Python SDK...'
    & $python -c 'from mcp.server.mcpserver import MCPServer; print("MCP SDK v2 import verified")'
    Assert-Success 'MCP import'
    & $python -c 'import sys; sys.path.insert(0, sys.argv[1]); import server; print("MeasuredField MCP server import verified")' $gateway
    Assert-Success 'MeasuredField server import'
    Write-Host 'Running synthetic source security tests...'
    & python.exe -B -m unittest discover -s (Join-Path $projectFolder 'tests') -p 'test_core.py' -v
    Assert-Success 'Gateway unit tests'
} else {
    Write-Warning 'No installed virtualenv found; gateway verification skipped.'
}

if (-not $SkipTunnelClient) {
    $tunnelRoot = Join-Path $base 'TUNNEL_CLIENT'
    $bin = Join-Path $tunnelRoot 'bin'
    $exe = Join-Path $bin 'tunnel-client.exe'
    if (Test-Path -LiteralPath $exe) {
        Write-Host 'Official tunnel-client already installed. No overwrite.'
    } else {
        Write-Host 'Retrieving official OpenAI tunnel-client release metadata...'
        $headers = @{ 'User-Agent' = 'MeasuredField-Windows-Setup'; 'Accept' = 'application/vnd.github+json' }
        $release = Invoke-RestMethod -Uri 'https://api.github.com/repos/openai/tunnel-client/releases/latest' -Headers $headers
        if ($release.draft -or $release.prerelease -or $release.tag_name -notmatch '^v[0-9]+\.[0-9]+\.[0-9]+$') {
            throw 'Release metadata did not identify a stable version.'
        }
        $assetName = 'tunnel-client-' + $release.tag_name + '-windows-amd64.zip'
        $asset = @($release.assets | Where-Object { $_.name -eq $assetName })
        $hashAsset = @($release.assets | Where-Object { $_.name -eq 'SHA256SUMS.txt' })
        if ($asset.Count -ne 1 -or $hashAsset.Count -ne 1) {
            throw 'Official Windows amd64 archive or checksums missing; installation aborted.'
        }
        if ($asset[0].browser_download_url -notlike ('https://github.com/openai/tunnel-client/releases/download/' + $release.tag_name + '/*') -or
            $hashAsset[0].browser_download_url -notlike 'https://github.com/openai/tunnel-client/releases/download/*') {
            throw 'Unexpected download host; installation aborted.'
        }
        New-Item -ItemType Directory -Path $tunnelRoot -Force | Out-Null
        $temp = Join-Path $tunnelRoot 'download-verify'
        if (Test-Path -LiteralPath $temp) { throw 'Existing download temp folder; inspect/remove manually.' }
        New-Item -ItemType Directory -Path $temp | Out-Null
        $archive = Join-Path $temp $assetName
        $checksums = Join-Path $temp 'SHA256SUMS.txt'
        Write-Host ('Downloading ' + $assetName)
        Invoke-WebRequest -UseBasicParsing -Uri $asset[0].browser_download_url -OutFile $archive
        Invoke-WebRequest -UseBasicParsing -Uri $hashAsset[0].browser_download_url -OutFile $checksums
        $matching = @(Get-Content -LiteralPath $checksums | Where-Object {
            $_ -match ('^[0-9a-fA-F]{64}\s+\*?' + [regex]::Escape($assetName) + '$')
        })
        if ($matching.Count -ne 1) { throw 'Expected archive checksum missing or duplicated.' }
        $expectedHash = $matching[0].Substring(0,64).ToLowerInvariant()
        $actualHash = (Get-FileHash -LiteralPath $archive -Algorithm SHA256).Hash.ToLowerInvariant()
        if ($expectedHash -ne $actualHash) { throw 'Archive hash mismatch. Refusing to install.' }
        Write-Host 'Official release SHA-256 archive hash verified.'
        $expandDir = Join-Path $temp 'expanded'
        Expand-Archive -LiteralPath $archive -DestinationPath $expandDir
        $binary = @(Get-ChildItem -LiteralPath $expandDir -File -Filter 'tunnel-client.exe' -Recurse)
        if ($binary.Count -ne 1) { throw 'Expected tunnel-client.exe not found exactly once.' }
        New-Item -ItemType Directory -Path $bin -Force | Out-Null
        Copy-Item -LiteralPath $binary[0].FullName -Destination $exe
        & $exe --version
        Assert-Success 'tunnel-client version'
        Write-Host ('Verified tunnel client installed at ' + $exe)
        # Download cache deliberately remains for inspection and provenance.
    }
}

Write-Host ''
Write-Host 'SETUP COMPLETE FOR LOCAL COMPONENTS. NO REMOTE ACCESS HAS BEEN GRANTED.'
Write-Host ('Gateway directory: ' + $gateway)
Write-Host ('Official tunnel binary: ' + (Join-Path $base 'TUNNEL_CLIENT\bin\tunnel-client.exe'))
Write-Host 'Next: create an authorized tunnel in your OpenAI Platform account.'
Write-Host 'https://platform.openai.com/settings/organization/tunnels'
Write-Host 'Do NOT paste your private SSH key or OpenAI API key into chat.'
