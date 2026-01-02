#!/bin/bash
# Quick deployment script

echo "🚀 Karate Tournament Management - Deployment"
echo "=============================================="
echo ""

# Check if vercel is installed
if command -v vercel &> /dev/null; then
    echo "✅ Vercel CLI found"
    echo ""
    echo "Deploying to Vercel..."
    vercel --prod
else
    echo "❌ Vercel CLI not found"
    echo ""
    echo "Please choose one:"
    echo "1. Install Vercel CLI: npm install -g vercel"
    echo "2. Deploy via GitHub + Vercel Dashboard (see DEPLOY_NOW.md)"
    echo ""
fi

