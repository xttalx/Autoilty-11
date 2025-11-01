# Quick Start Guide

## ⚠️ Important: After Cloning from Git

If you just cloned this repository, you **MUST** install dependencies before running:

### Step 1: Navigate to nextjs-app
```bash
cd nextjs-app
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install all required packages including:
- Next.js 15
- React
- i18next and react-i18next
- geoip-lite
- And all other dependencies

### Step 3: Start the Development Server
```bash
npm run dev
```

### Step 4: Open Your Browser
Visit: **http://localhost:3000**

The app will automatically redirect you to your country page (e.g., `/ca`, `/sg`, `/my`, etc.)

## Troubleshooting

### If you see "Module not found" errors:
1. Delete `node_modules` folder: `rm -rf node_modules` (or `Remove-Item -Recurse -Force node_modules` on Windows)
2. Delete `package-lock.json`: `rm package-lock.json`
3. Run `npm install` again

### If you see a README page:
- Make sure you're accessing **http://localhost:3000** (not a file path)
- Verify the dev server is running (check terminal for "ready" message)
- The README.md in the root folder is just documentation - it won't be served by Next.js

### If port 3000 is already in use:
- Change the port: `PORT=3001 npm run dev`
- Or kill the process using port 3000

## Accessing Different Countries

- **Canada:** http://localhost:3000/ca
- **Singapore:** http://localhost:3000/sg
- **Malaysia:** http://localhost:3000/my
- **Indonesia:** http://localhost:3000/id
- **Thailand:** http://localhost:3000/th

## Need Help?

Check `START.md` for more detailed instructions.

