#!/bin/bash

# FormForge Environment Setup Helper
echo "🔧 Setting up FormForge for Vercel deployment..."
echo ""

# Check if git is initialized and has changes
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please ensure you're in the correct directory."
    exit 1
fi

echo "📤 Pushing fixes to GitHub..."
if git push -u origin main; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
else
    echo ""
    echo "❌ Push failed. You may need to authenticate with GitHub."
    echo "Please run: git push -u origin main"
    exit 1
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Go to your Vercel project dashboard"
echo "2. Go to Settings > Environment Variables"
echo "3. Add the 4 environment variables (see VERCEL_ENV_SETUP_GUIDE.md)"
echo "4. Redeploy your project"
echo ""

# Generate NEXTAUTH_SECRET if OpenSSL is available
if command -v openssl >/dev/null 2>&1; then
    echo "🔑 Generate NEXTAUTH_SECRET with:"
    echo "openssl rand -base64 32"
    echo ""
    echo "Your NEXTAUTH_SECRET would be:"
    openssl rand -base64 32
else
    echo "🔑 Please generate NEXTAUTH_SECRET with:"
    echo "openssl rand -base64 32"
fi

echo ""
echo "📋 Environment Variables to Add in Vercel:"
echo "1. NEXTAUTH_SECRET = [generate with openssl command above]"
echo "2. NEXTAUTH_URL = https://your-vercel-url.vercel.app"
echo "3. SUPABASE_URL = https://noytpxrmagkfrmegxujt.supabase.co"
echo "4. SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5veXRweHJtYWdrZnJtZWd4dWp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NDI5NDgsImV4cCI6MjA4MTUxODk0OH0.av4ZOFttwhFuHe8-Xpfzfep6TmSKxVJKHqWVdT5bAiw"
echo ""
echo "🚀 See VERCEL_ENV_SETUP_GUIDE.md for detailed instructions!"