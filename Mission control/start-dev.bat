@echo off
rem Mission Control - Development Setup Script (Windows)
rem This script ensures everything is properly set up for local development

echo 🚀 Mission Control - Starting Development Setup
echo ==============================================

rem Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: Please run this script from the Mission Control directory
    echo    Expected: cd "Mission control"
    pause
    exit /b 1
)

rem Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Error: Node.js is not installed
    echo    Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected
node --version

rem Check if npm is available
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Error: npm is not installed
    pause
    exit /b 1
)

echo ✅ npm detected
npm --version

rem Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if %ERRORLEVEL% neq 0 (
        echo ❌ Error: Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed successfully
) else (
    echo ✅ Dependencies already installed
)

rem Check if .env file exists, create from example if not
if not exist ".env" (
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo ✅ Created .env file from example
    ) else (
        echo ⚠️  Warning: No .env file found, using defaults
    )
) else (
    echo ✅ Environment file exists
)

rem Run type checking
echo 🔍 Running TypeScript type check...
npm run type-check
if %ERRORLEVEL% neq 0 (
    echo ❌ Error: TypeScript type check failed
    echo    Please fix the TypeScript errors before proceeding
    pause
    exit /b 1
)
echo ✅ TypeScript check passed

rem Start the development server
echo.
echo 🎉 Setup complete! Starting development server...
echo    The application will open at: http://localhost:3000
echo    Press Ctrl+C to stop the server
echo.

npm run dev
