#!/bin/bash

# FormForge Deployment Script
# This script sets up FormForge for production deployment

echo "🚀 FormForge Deployment Script"
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm found"

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚙️ Creating environment file..."
    cp .env.example .env.local
    echo "📝 Please update .env.local with your database URL and secrets"
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma client"
    exit 1
fi

echo "✅ Prisma client generated"

# Run database migrations (if DATABASE_URL is set)
if grep -q "postgresql://" .env.local; then
    echo "🗄️ Running database migrations..."
    npx prisma db push
    
    if [ $? -eq 0 ]; then
        echo "✅ Database migrations completed"
        
        # Seed database if requested
        read -p "🌱 Do you want to seed the database with demo data? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "🌱 Seeding database..."
            npm run db:seed
            echo "✅ Database seeded successfully"
        fi
    else
        echo "⚠️ Database migrations failed - please check your DATABASE_URL"
    fi
else
    echo "⚠️ No DATABASE_URL found in .env.local - skipping database setup"
fi

# Build the application
echo "🏗️ Building application for production..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully"

# Final instructions
echo ""
echo "🎉 FormForge is ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your production database URL"
echo "2. Set NEXTAUTH_SECRET to a secure random string"
echo "3. Deploy to your preferred platform (Vercel, Railway, etc.)"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "To start the production server:"
echo "  npm start"
echo ""
echo "Demo account:"
echo "  Email: demo@formforge.com"
echo "  Password: Any password (demo auth enabled)"
echo ""
echo "Happy building! 🚀"