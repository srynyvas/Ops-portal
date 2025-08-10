@echo off
echo ============================================
echo   Ops Portal Backend - MongoDB Edition
echo ============================================
echo.

echo Checking for MongoDB...
echo.

REM Check if Docker is running
docker version >nul 2>&1
if %errorlevel% == 0 (
    echo Docker found! Starting MongoDB with Docker...
    docker-compose up -d
    timeout /t 5 >nul
    echo MongoDB started on port 27017
    echo Mongo Express UI available at: http://localhost:8081
    echo.
) else (
    echo Docker not running. Please either:
    echo 1. Start Docker Desktop and run this script again
    echo 2. Install MongoDB locally
    echo 3. Use MongoDB Atlas cloud service
    echo.
    echo For now, you can use the in-memory backend:
    echo Run: python main.py
    echo.
    pause
    exit /b 1
)

echo Starting FastAPI backend with MongoDB...
echo.
py -3.11 main_mongo.py