@echo off
echo ==========================================
echo   FIREBASE DEPLOYMENT SCRIPT
echo ==========================================
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js/npm is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b
)

REM Check if firebase-tools is installed
call firebase --version >nul 2>nul
if %errorlevel% neq 0 (
    echo 📦 Installing Firebase CLI...
    call npm install -g firebase-tools
)

echo.
echo 🔐 You need to login to Firebase first.
echo    A browser window will open. Please login with your Google account.
echo.
call firebase login

echo.
echo 🚀 Deploying to Firebase Hosting...
echo.
call firebase deploy

echo.
echo ==========================================
echo ✅ DEPLOYMENT COMPLETE!
echo ==========================================
echo.
pause
