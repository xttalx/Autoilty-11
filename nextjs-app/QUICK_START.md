# Quick Start Guide - Autoilty Next.js

## Installation

Node.js is not currently in your PATH. Follow these steps to install dependencies:

### Step 1: Install Node.js (if not installed)

1. **Download Node.js**:
   - Visit: https://nodejs.org/
   - Download the **LTS version** (Node.js 20.x or later)
   - Run the installer

2. **Verify installation**:
   ```bash
   node --version  # Should show v18.x or higher
   npm --version   # Should show 9.x or higher
   ```

### Step 2: Install Dependencies

**Option A: Using the install script (Windows)**
```bash
cd nextjs-app
install.bat
```

**Option B: Using the install script (Mac/Linux)**
```bash
cd nextjs-app
chmod +x install.sh
./install.sh
```

**Option C: Manual installation**
```bash
cd nextjs-app
npm install
```

### Step 3: Configure Environment

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your API keys
# See .env.example for all required variables
```

### Step 4: Run Development Server

```bash
npm run dev
```

Visit: **http://localhost:3000**

## What Gets Installed

All dependencies from `package.json` including:
- ✅ Next.js 14 (React framework)
- ✅ TypeScript 5.3
- ✅ Tailwind CSS + plugins
- ✅ NextAuth (authentication)
- ✅ Supabase client
- ✅ All UI libraries and integrations

## Troubleshooting

**If npm is not recognized:**
- Restart your terminal after installing Node.js
- Or add Node.js to your PATH manually

**If installation fails:**
- Ensure Node.js 18+ is installed
- Try: `npm cache clean --force` then `npm install`
- Check your internet connection

**For more help:** See `INSTALL_INSTRUCTIONS.md`

---

✅ **All dependencies are now configured in `package.json`**
✅ **Ready to install once Node.js is available**
