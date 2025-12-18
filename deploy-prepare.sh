#!/bin/bash

# FormForge Quick Deploy Preparation Script

echo "🚀 FormForge Deployment Preparation"
echo "=================================="

echo ""
echo "📋 Checking deployment readiness..."

# Check if package.json exists
if [ -f "package.json" ]; then
    echo "✅ package.json found"
else
    echo "❌ package.json not found"
    exit 1
fi

# Check if next.config.js exists
if [ -f "next.config.js" ]; then
    echo "✅ next.config.js found"
else
    echo "❌ next.config.js not found"
    exit 1
fi

# Check if app directory exists
if [ -d "app" ]; then
    echo "✅ Next.js app directory found"
else
    echo "❌ app directory not found"
    exit 1
fi

echo ""
echo "📦 Preparing for deployment..."

# Clean up any existing build artifacts
if [ -d ".next" ]; then
    echo "🧹 Cleaning previous build..."
    rm -rf .next
fi

# Create .env.production if it doesn't exist
if [ ! -f ".env.production" ]; then
    echo "📝 Creating production environment file..."
    cat > .env.production << EOF
# Production Environment Variables
# Update these values for your deployment

# Authentication
NEXTAUTH_SECRET=formforge-production-secret-$(date +%s)
NEXTAUTH_URL=https://your-domain.com

# Database (optional for basic deployment)
# DATABASE_URL=postgresql://username:password@localhost:5432/formforge

# Supabase (for advanced features)
# NEXT_PUBLIC_SUPABASE_URL=https://noytpxrmagkfrmegxujt.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Email (optional)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASSWORD=your-app-password
EOF
    echo "✅ Production environment file created (.env.production)"
fi

echo ""
echo "🎯 Deployment Instructions:"
echo ""
echo "=== OPTION 1: VERCEL (Recommended) ==="
echo "1. Create GitHub repository: https://github.com/new"
echo "2. Push your code:"
echo "   git add ."
echo "   git commit -m 'Initial FormForge deployment'"
echo "   git branch -M main"
echo "   git remote add origin https://github.com/YOUR_USERNAME/formforge.git"
echo "   git push -u origin main"
echo "3. Go to https://vercel.com and import your repository"
echo "4. Click 'Deploy' - your app will be live in minutes!"
echo ""
echo "=== OPTION 2: NETLIFY ==="
echo "1. Build locally: npm run build"
echo "2. Go to https://netlify.com"
echo "3. Drag and drop the 'dist' folder (or connect GitHub)"
echo ""
echo "=== OPTION 3: RAILWAY ==="
echo "1. Go to https://railway.app"
echo "2. Connect your GitHub repository"
echo "3. Deploy automatically"
echo ""
echo "📝 Demo Account (works after deployment):"
echo "   Email: demo@formforge.com"
echo "   Password: Any password (demo auth enabled)"
echo ""
echo "🔧 Environment Variables:"
echo "   Update .env.production with your actual values before deployment"
echo ""
echo "✅ Your FormForge app is ready for deployment!"
echo "🚀 Choose your preferred platform and follow the instructions above."