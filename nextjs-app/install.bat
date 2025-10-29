@echo off
echo ========================================
echo Autoilty.com Next.js - Dependency Installer
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH.
    echo.
    echo Please install Node.js 18+ from: https://nodejs.org/
    echo After installation, restart this script.
    pause
    exit /b 1
)

REM Check Node.js version
echo Checking Node.js version...
node --version
npm --version
echo.

REM Navigate to project directory
cd /d "%~dp0"

echo Installing dependencies...
echo This may take a few minutes...
echo.

REM Install dependencies
call npm install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Installation completed successfully!
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Copy .env.example to .env.local
    echo 2. Edit .env.local with your API keys
    echo 3. Run: npm run dev
    echo.
) else (
    echo.
    echo ========================================
    echo Installation failed!
    echo ========================================
    echo.
    echo Please check the error messages above.
    echo Make sure you have Node.js 18+ installed.
    echo.
)

pause
