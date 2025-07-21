#!/bin/bash

# Mission Control - Development Setup Script
# This script ensures everything is properly set up for local development

echo "🚀 Mission Control - Starting Development Setup"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the Mission Control directory"
    echo "   Expected: cd 'Mission control'"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "   Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt "18" ]; then
    echo "❌ Error: Node.js version 18+ required, found: $(node --version)"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed"
    exit 1
fi

echo "✅ npm $(npm --version) detected"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Error: Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
else
    echo "✅ Dependencies already installed"
fi

# Check if .env file exists, create from example if not
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ Created .env file from example"
    else
        echo "⚠️  Warning: No .env file found, using defaults"
    fi
else
    echo "✅ Environment file exists"
fi

# Run type checking
echo "🔍 Running TypeScript type check..."
npm run type-check
if [ $? -ne 0 ]; then
    echo "❌ Error: TypeScript type check failed"
    echo "   Please fix the TypeScript errors before proceeding"
    exit 1
fi
echo "✅ TypeScript check passed"

# Start the development server
echo ""
echo "🎉 Setup complete! Starting development server..."
echo "   The application will open at: http://localhost:3000"
echo "   Press Ctrl+C to stop the server"
echo ""

npm run dev
