# Nova Cloud Stack Tool's

[![Netlify Status](https://api.netlify.com/api/v1/badges/c1065279-f308-445b-92fc-0d96e5069fde/deploy-status)](https://app.netlify.com/projects/novacloudtoolshub/deploys)

A comprehensive suite of developer tools made simple and accessible. Professional utilities to boost your productivity.

## 🚀 Features

- **Hash Generator** - Generate SHA-256, SHA-384, SHA-512 hashes
- **UUID Generator** - Generate unique identifiers (UUID v4)
- **Password Generator** - Create strong, random passwords
- **JSON Formatter** - Format, validate, and beautify JSON data
- **Base64 Encoder/Decoder** - Encode and decode Base64 strings
- **URL Encoder/Decoder** - Encode and decode URL strings
- **Color Converter** - Convert between HEX, RGB, HSL formats
- **Timestamp Converter** - Convert Unix timestamps to readable dates
- **Regex Tester** - Test and debug regular expressions

## 🏗️ Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Firestore + Auth + Storage)
- **Authentication**: Email/Password + Google OAuth
- **Deployment**: Netlify

## 📋 Getting Started

### Prerequisites

- Node.js 18+
- Firebase project configured

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd "Nova cloud tool's Hub"
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file with Firebase credentials
```bash
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000000000000:web:abcdef123456
```

4. Start the development server
```bash
npm run dev
```

5. Open your browser at `http://localhost:5173`

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## 📚 Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [NETLIFY_SETUP.md](./NETLIFY_SETUP.md) - Netlify setup instructions
- [SECURITY.md](./SECURITY.md) - Security implementation guide
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Project overview

## 🔒 Security

This application implements production-grade security features:
- Row Level Security (RLS) on all database tables
- Input validation and sanitization
- Rate limiting
- Secure authentication with Firebase Auth
- Security headers configured

See [SECURITY.md](./SECURITY.md) for detailed information.

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. Contributions are not accepted at this time.

---

**Built with ❤️ for developers**

