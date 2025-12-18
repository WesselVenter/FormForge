#!/bin/bash

# FormForge GitHub Push Script
# Run this script to push your FormForge application to GitHub

echo "🚀 Pushing FormForge to GitHub..."
echo "Repository: https://github.com/WesselVenter/FormForge.git"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not initialized. Run 'git init' first."
    exit 1
fi

# Add remote if it doesn't exist
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "📡 Adding GitHub remote repository..."
    git remote add origin https://github.com/WesselVenter/FormForge.git
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
if git push -u origin main; then
    echo ""
    echo "✅ Success! Your FormForge application is now on GitHub."
    echo ""
    echo "Next steps:"
    echo "1. Go to https://vercel.com"
    echo "2. Import your FormForge repository"
    echo "3. Deploy and get your live URL!"
    echo ""
    echo "See FINAL_DEPLOYMENT_STEPS.md for detailed Vercel deployment guide."
else
    echo ""
    echo "❌ Push failed. You may need to authenticate with GitHub."
    echo ""
    echo "For authentication, you can:"
    echo "1. Use a personal access token as your password"
    echo "2. Or run: git push -u origin main"
    echo "   And provide your GitHub credentials when prompted"
fi