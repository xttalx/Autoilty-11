# Install Dependencies Now

## Option 1: Use PowerShell Script (If Node.js is installed but not in PATH)

Run this in PowerShell from the project root:
```powershell
cd nextjs-app
.\find-node.ps1
```

This script will:
- Search for Node.js in common installation locations
- Add it to PATH for this session
- Install all dependencies automatically

## Option 2: Install Node.js First (If not installed)

### Quick Install
1. **Download Node.js**: https://nodejs.org/
   - Click "Download Node.js (LTS)" - this is the recommended version
   - The LTS version is typically Node.js 20.x

2. **Run the installer**:
   - Double-click the downloaded `.msi` file
   - Follow the installation wizard
   - **Important**: Make sure "Add to PATH" is checked during installation

3. **Restart your terminal** (close and reopen PowerShell/CMD)

4. **Verify installation**:
   ```bash
   node --version
   npm --version
   ```

5. **Install dependencies**:
   ```bash
   cd nextjs-app
   npm install
   ```

## Option 3: Using Package Managers

### Using Chocolatey (Windows)
```bash
choco install nodejs-lts
cd nextjs-app
npm install
```

### Using Winget (Windows 10/11)
```bash
winget install OpenJS.NodeJS.LTS
cd nextjs-app
npm install
```

## Option 4: Manual Node.js Detection

If Node.js is installed but not in PATH, you can manually run:

```powershell
# Find Node.js
Get-ChildItem "C:\Program Files\nodejs\" -ErrorAction SilentlyContinue
Get-ChildItem "C:\Program Files (x86)\nodejs\" -ErrorAction SilentlyContinue

# If found, use full path:
"C:\Program Files\nodejs\npm.cmd" install
```

## After Installation

Once `npm install` completes successfully:

1. **Configure environment**:
   ```bash
   copy .env.example .env.local
   # Edit .env.local with your API keys
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open browser**: http://localhost:3000

## Troubleshooting

**"npm is not recognized"**
- Node.js is not in PATH
- Try Option 1 (find-node.ps1 script)
- Or restart terminal after installing Node.js

**Installation takes too long**
- Normal! First install can take 5-10 minutes
- Depends on internet speed
- Progress will show in terminal

**Permission errors**
- Run terminal as Administrator
- Or use: `npm install --no-optional`

**Still having issues?**
- See `QUICK_START.md` for detailed troubleshooting
- Check Node.js version: `node --version` (need v18+)
