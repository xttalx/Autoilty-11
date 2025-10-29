# Script to find and use Node.js installation
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Finding Node.js and Installing Dependencies" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Searching for Node.js installation..." -ForegroundColor Yellow

$nodePaths = @(
    "C:\Program Files\nodejs\node.exe",
    "C:\Program Files (x86)\nodejs\node.exe",
    "$env:ProgramFiles\nodejs\node.exe",
    "${env:ProgramFiles(x86)}\nodejs\node.exe",
    "$env:LOCALAPPDATA\Programs\nodejs\node.exe",
    "$env:APPDATA\npm\node.exe"
)

$foundNode = $null
foreach ($path in $nodePaths) {
    if (Test-Path $path) {
        $foundNode = $path
        Write-Host "Found Node.js at: $path" -ForegroundColor Green
        break
    }
}

if ($foundNode) {
    $nodeDir = Split-Path $foundNode -Parent
    $env:PATH = "$nodeDir;$env:PATH"
    Write-Host "Added Node.js to PATH for this session" -ForegroundColor Green
    Write-Host ""
    Write-Host "Node version:" -ForegroundColor Cyan
    & $foundNode --version
    Write-Host "NPM version:" -ForegroundColor Cyan
    if (Test-Path "$nodeDir\npm.cmd") {
        & "$nodeDir\npm.cmd" --version
    } else {
        & "$nodeDir\npm" --version
    }
    Write-Host ""
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    Set-Location $PSScriptRoot
    if (Test-Path "$nodeDir\npm.cmd") {
        & "$nodeDir\npm.cmd" install
    } else {
        & "$nodeDir\npm" install
    }
} else {
    Write-Host "Node.js not found in common locations." -ForegroundColor Red
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host "Node.js Installation Required" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please install Node.js:" -ForegroundColor White
    Write-Host "1. Visit: https://nodejs.org/" -ForegroundColor Cyan
    Write-Host "2. Download the LTS version (Node.js 18+)" -ForegroundColor Cyan
    Write-Host "3. Run the installer" -ForegroundColor Cyan
    Write-Host "4. Restart your terminal" -ForegroundColor Cyan
    Write-Host "5. Run: cd nextjs-app && npm install" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or use a package manager:" -ForegroundColor White
    Write-Host "  winget install OpenJS.NodeJS.LTS" -ForegroundColor Cyan
    Write-Host "  choco install nodejs-lts" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}
