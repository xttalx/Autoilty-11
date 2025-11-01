# 🚘 Autoilty - Asia's Premier Auto Business Directory

## 🌟 Overview

**Autoilty.com** is a comprehensive business curation platform for the automotive industry, now expanded to Asia markets (Canada, Singapore, Malaysia, Indonesia, Thailand). It showcases vetted auto businesses—mechanics, dealerships, parts stores, detailing services, and more—using an advanced 10-point scoring system based on reviews, community engagement, social signals, and country-specific excellence factors.

### Key Features

- ✅ **Multi-Country Support** - CA, SG, MY, ID, TH with localized content
- 🌐 **Internationalization** - English, Malay, Indonesian translations
- 📍 **Geo-IP Detection** - Automatic country detection and routing
- 🔍 **Advanced Search & Filters** - Country-aware categories and makes
- 💬 **Forum Integration** - Country-specific discussion threads
- 📱 **Mobile-First Design** - Responsive across all devices
- 🚀 **Next.js 15** - Latest Next.js with App Router
- 🔒 **Authentication** - NextAuth.js with Google/Twitter OAuth

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- MongoDB 7.0+ (for backend API)
- Redis 7+ (optional, for caching)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/xttalx/Autoilty-11.git
cd Autoilty-11
```

2. **Navigate to Next.js app and install dependencies:**
```bash
cd nextjs-app
npm install
```

> ⚠️ **IMPORTANT:** You must run `npm install` in the `nextjs-app` directory after cloning!

3. **Start the development server:**
```bash
npm run dev
```

4. **Open your browser:**
- Visit: **http://localhost:3000**
- The app will automatically redirect to your country page

### Accessing Different Countries

- **Canada:** http://localhost:3000/ca
- **Singapore:** http://localhost:3000/sg
- **Malaysia:** http://localhost:3000/my
- **Indonesia:** http://localhost:3000/id
- **Thailand:** http://localhost:3000/th

---

## 📁 Project Structure

```
autoilty-11/
├── nextjs-app/          # Next.js 15 frontend application
│   ├── app/             # Next.js App Router pages
│   ├── components/      # React components
│   ├── lib/             # Utilities and configs
│   └── public/          # Static assets
├── server/              # Express backend API
├── client/              # Legacy React frontend (being migrated)
└── scripts/             # Data scraping and seeding scripts
```

---

## 🏗️ Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- React 18
- Tailwind CSS
- TypeScript
- i18next for internationalization
- NextAuth.js for authentication

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- GraphQL (Apollo Server)
- Redis for caching
- JWT authentication

---

## 📚 Documentation

- **Quick Start:** See `nextjs-app/QUICKSTART.md`
- **Asia Expansion:** See `nextjs-app/ASIA_EXPANSION_README.md`
- **Project Structure:** See `PROJECT_STRUCTURE.md`
- **Deployment:** See `DEPLOYMENT.md`

---

## 🐳 Docker Deployment

```bash
docker-compose up -d
```

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🆘 Troubleshooting

### Module not found errors:
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again in the `nextjs-app` directory

### Seeing README instead of app:
- Make sure you're accessing **http://localhost:3000** (not a file path)
- Verify `npm run dev` is running in the `nextjs-app` directory
- Check terminal for any error messages

### Port already in use:
- Use a different port: `PORT=3001 npm run dev`

For more help, see `nextjs-app/QUICKSTART.md` or `nextjs-app/START.md`.

---

## 📞 Support

For issues or questions, please open an issue on GitHub.
