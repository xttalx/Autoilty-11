#!/bin/bash

# Autoilty Quick Start Script
# Automated setup for local development

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║      🚘 Autoilty.com - Quick Start Setup                  ║"
echo "║      Canada's Premier Auto Business Directory              ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "🔍 Checking prerequisites..."

command -v node >/dev/null 2>&1 || { echo -e "${RED}✗ Node.js is required but not installed.${NC}" >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo -e "${RED}✗ npm is required but not installed.${NC}" >&2; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo -e "${RED}✗ Python 3 is required but not installed.${NC}" >&2; exit 1; }
command -v mongod >/dev/null 2>&1 || { echo -e "${YELLOW}⚠ MongoDB not found. Please install MongoDB 7.0+${NC}"; }
command -v redis-server >/dev/null 2>&1 || { echo -e "${YELLOW}⚠ Redis not found. Please install Redis 7+${NC}"; }

echo -e "${GREEN}✓ Prerequisites check complete${NC}"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install
echo -e "${GREEN}✓ Backend dependencies installed${NC}"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd client
npm install
cd ..
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
echo ""

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip3 install -r requirements.txt
echo -e "${GREEN}✓ Python dependencies installed${NC}"
echo ""

# Create .env file if not exists
if [ ! -f .env ]; then
    echo "⚙️  Creating environment configuration..."
    cp .env.example .env
    echo -e "${YELLOW}⚠ Please edit .env file with your API keys${NC}"
    echo ""
fi

# Create logs directory
mkdir -p logs
echo -e "${GREEN}✓ Logs directory created${NC}"
echo ""

# Start MongoDB (if installed)
if command -v mongod >/dev/null 2>&1; then
    echo "🍃 Starting MongoDB..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew services start mongodb-community 2>/dev/null || echo "MongoDB may already be running"
    else
        sudo systemctl start mongod 2>/dev/null || echo "MongoDB may already be running"
    fi
    echo -e "${GREEN}✓ MongoDB started${NC}"
    echo ""
fi

# Start Redis (if installed)
if command -v redis-server >/dev/null 2>&1; then
    echo "🔴 Starting Redis..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew services start redis 2>/dev/null || echo "Redis may already be running"
    else
        sudo systemctl start redis 2>/dev/null || echo "Redis may already be running"
    fi
    echo -e "${GREEN}✓ Redis started${NC}"
    echo ""
fi

# Seed database
echo "🌱 Seeding database with sample data..."
sleep 2  # Wait for MongoDB to be ready
npm run seed
echo -e "${GREEN}✓ Database seeded${NC}"
echo ""

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                  ✅ Setup Complete!                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "🚀 To start the application:"
echo ""
echo "   Backend:   npm run dev"
echo "   Frontend:  npm run client"
echo "   Both:      npm run dev:full"
echo ""
echo "📍 Access points:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:5000"
echo "   GraphQL:   http://localhost:5000/graphql"
echo ""
echo "👤 Sample login credentials:"
echo "   User:  john@example.com / password123"
echo "   Admin: admin@autoilty.com / admin123"
echo ""
echo "📚 Documentation: README.md"
echo "🐳 Docker:        docker-compose up"
echo ""
echo -e "${GREEN}Happy coding! 🚘${NC}"


