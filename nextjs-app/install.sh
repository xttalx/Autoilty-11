#!/bin/bash

echo "========================================"
echo "Autoilty.com Next.js - Dependency Installer"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed or not in PATH."
    echo ""
    echo "Please install Node.js 18+ from: https://nodejs.org/"
    echo "Or use your system's package manager:"
    echo "  - macOS: brew install node"
    echo "  - Ubuntu/Debian: sudo apt-get install nodejs npm"
    echo "  - Fedora: sudo dnf install nodejs npm"
    exit 1
fi

# Check Node.js version
echo "Checking Node.js version..."
node --version
npm --version
echo ""

# Navigate to script directory
cd "$(dirname "$0")"

echo "Installing dependencies..."
echo "This may take a few minutes..."
echo ""

# Install dependencies
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "Installation completed successfully!"
    echo "========================================"
    echo ""
    echo "Next steps:"
    echo "1. Copy .env.example to .env.local"
    echo "2. Edit .env.local with your API keys"
    echo "3. Run: npm run dev"
    echo ""
else
    echo ""
    echo "========================================"
    echo "Installation failed!"
    echo "========================================"
    echo ""
    echo "Please check the error messages above."
    echo "Make sure you have Node.js 18+ installed."
    echo ""
    exit 1
fi
