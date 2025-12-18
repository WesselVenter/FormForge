#!/bin/bash

# FormForge Local Development Startup Script

echo "🚀 FormForge Local Development Setup"
echo "===================================="

# Check Node.js version
NODE_VERSION=$(node --version 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ Node.js found: $NODE_VERSION"
else
    echo "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

# Check npm version
NPM_VERSION=$(npm --version 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ npm found: v$NPM_VERSION"
else
    echo "❌ npm not found. Please install npm"
    exit 1
fi

echo ""
echo "📦 Installing dependencies..."

# Try different installation methods
if npm install --legacy-peer-deps; then
    echo "✅ Dependencies installed successfully"
elif yarn install; then
    echo "✅ Dependencies installed with yarn"
else
    echo "⚠️  Installation issues detected. Trying alternative methods..."
    
    # Try with different registry
    if npm install --registry https://registry.npmjs.org/ --legacy-peer-deps; then
        echo "✅ Dependencies installed with alternative registry"
    else
        echo "❌ Failed to install dependencies"
        echo "Please try:"
        echo "1. npm cache clean --force && npm install"
        echo "2. yarn install"
        echo "3. npm install --registry https://registry.npmjs.org/"
        exit 1
    fi
fi

echo ""
echo "🗄️  Setting up database..."

# Generate Prisma client
if npx prisma generate; then
    echo "✅ Prisma client generated"
else
    echo "⚠️  Prisma client generation failed (database may not be configured yet)"
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env.local
    echo "✅ Environment file created. Please update .env.local with your settings."
else
    echo "✅ Environment file exists"
fi

echo ""
echo "🎯 Ready to start FormForge!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your database URL and secrets"
echo "2. Start the development server: npm run dev"
echo "3. Visit http://localhost:3000"
echo ""
echo "Demo account:"
echo "  Email: demo@formforge.com"
echo "  Password: Any password (demo auth enabled)"
echo ""
echo "Happy building! 🚀"

# Ask if user wants to start the server
read -p "🤔 Start the development server now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Starting FormForge development server..."
    echo "Visit http://localhost:3000 when it loads!"
    echo ""
    npm run dev
fi