# 🚀 FormForge Local Development Setup

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

## Quick Start

### 1. **Install Dependencies**
```bash
# Remove problematic Supabase dependency temporarily
npm install --legacy-peer-deps
```

If npm permissions issues occur, try:
```bash
# Option 1: Use yarn
yarn install

# Option 2: Use npm with different registry
npm install --registry https://registry.npmjs.org/

# Option 3: Clear npm cache and try again
npm cache clean --force
npm install
```

### 2. **Environment Setup**
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Update `.env.local` with your values:
```env
# Database (for Prisma)
DATABASE_URL="postgresql://username:password@localhost:5432/formforge"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Supabase (optional for local development)
NEXT_PUBLIC_SUPABASE_URL="https://noytpxrmagkfrmegxujt.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key_here"
```

### 3. **Database Setup**
```bash
# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Seed with demo data (optional)
npm run db:seed
```

### 4. **Start Development Server**
```bash
npm run dev
```

Your FormForge application will be available at:
**http://localhost:3000**

## Demo Account
- **Email**: demo@formforge.com
- **Password**: Any password (demo authentication enabled)

## Features Available in Local Mode

### ✅ **Core Features**
- User authentication (demo mode)
- Form builder with drag & drop
- Field library (15+ field types)
- Form templates
- Basic form publishing
- Local database storage

### ⚠️ **Limited Features** (requires Supabase)
- Advanced file uploads
- Real-time analytics
- Supabase storage
- Edge functions
- Advanced backend features

## Production Features Ready

When you deploy to production with proper environment setup:

### 🚀 **Full Feature Set**
- **Advanced File Uploads**: Secure file storage with Supabase
- **Real-time Analytics**: Comprehensive dashboard with charts
- **Database Integration**: PostgreSQL with Prisma
- **Authentication**: NextAuth.js with session management
- **Form Publishing**: Public URLs and embed codes
- **Analytics Tracking**: User behavior and performance metrics

## Troubleshooting

### **npm Permission Issues**
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
npm cache clean --force
npm install
```

### **Node Version Issues**
Ensure you're using Node.js 18+:
```bash
node --version
nvm use 18  # If using nvm
```

### **Database Connection**
Make sure PostgreSQL is running:
```bash
# Start PostgreSQL (varies by OS)
# macOS
brew services start postgresql

# Ubuntu/Debian
sudo systemctl start postgresql

# Windows
net start postgresql
```

### **Port Already in Use**
Change the port in `.env.local`:
```env
NEXTAUTH_URL="http://localhost:3001"
```

Then update next.config.js:
```javascript
module.exports = {
  devServer: {
    port: 3001
  }
}
```

## Next Steps

1. **Test Core Features**: Create forms, test drag & drop
2. **Deploy to Production**: Use Vercel, Railway, or other platforms
3. **Configure Supabase**: Set up production database and storage
4. **Enable Advanced Features**: File uploads and analytics

## Support

- Check browser console for errors
- Verify environment variables
- Ensure database is running
- Check npm/node version compatibility

**Ready to build amazing forms! 🎉**