# Starting the Development Server

## Quick Start

1. **Open a terminal** in the `nextjs-app` directory:
   ```bash
   cd nextjs-app
   ```

2. **Start the dev server**:
   ```bash
   npm run dev
   ```

3. **Wait for compilation** (first time may take 20-30 seconds):
   - You'll see: `✓ Ready in X.Xs`
   - Server will be at: `http://localhost:3000`

4. **Open your browser**:
   - Go to: **http://localhost:3000**
   - You should see the Autoilty.com homepage

## Troubleshooting

### If you see "npm is not recognized":
- Refresh PATH in your terminal:
  ```powershell
  $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
  ```

### If the server won't start:
- Check for errors in the terminal
- Make sure port 3000 is not in use
- Try: `npx next dev -p 3001` (uses port 3001 instead)

### If you see compilation errors:
- The errors have been fixed in the latest version
- Make sure you've pulled the latest code
- Delete `.next` folder and try again: `rm -rf .next && npm run dev`

## What You Should See

When the server is running successfully:
- ✅ Terminal shows: `- Local: http://localhost:3000`
- ✅ Browser shows: Autoilty.com homepage with:
  - Hero section with "Canada's #1 Automotive Directory"
  - Search bar
  - Category grid (Mechanics, Dealerships, etc.)
  - Browse by Province section
  - How It Works section

If you're seeing the README instead:
- ❌ You're in the wrong directory (should be `nextjs-app`)
- ❌ The server isn't running
- ❌ You're accessing the wrong URL

## Next Steps

After the server starts:
1. The app will automatically reload when you make changes
2. Check http://localhost:3000 for the homepage
3. Navigate to different pages to test functionality
4. Check the browser console for any client-side errors

