@echo off
title Wheat Doctor — GitHub Push & Android APK Builder
chcp 65001 >nul
echo =====================================================================
echo      🌾 WHEAT DOCTOR AI — GITHUB & ANDROID APK DEPLOYMENT HELPER
echo =====================================================================
echo.
cd /d "%~dp0"

echo [Step 1] Building latest Android WebView & PWA static bundles...
python build_android_bundle.py
if errorlevel 1 (
    echo [ERROR] Bundle build failed!
    pause
    exit /b 1
)

echo.
echo [Step 2] Staging all project files for GitHub...
git add -A
git status -s

echo.
git commit -m "Build Wheat Doctor v2.0 Android APK, PWA & On-Device Vision Engine" >nul 2>&1

echo.
echo =====================================================================
echo  Enter your GitHub Repository URL (e.g. https://github.com/YourName/Wheat-Doctor.git)
echo  (Leave blank if 'origin' remote is already configured)
echo =====================================================================
set /p repo_url="GitHub Repo URL: "

if not "%repo_url%"=="" (
    git remote remove origin >nul 2>&1
    git remote add origin %repo_url%
)

echo.
echo [Step 3] Pushing to GitHub 'main' branch...
git branch -M main
git push -u origin main

if errorlevel 1 (
    echo.
    echo [!] Push could not complete. Please verify your GitHub repository URL and credentials.
) else (
    echo.
    echo =====================================================================
    echo  ✅ SUCCESS! Code pushed to GitHub!
    echo  1. Open your GitHub repository -> "Actions" tab to watch the
    echo     automated Android APK build ("Build Android APK & Release").
    echo  2. Once finished (~2 mins), open the "Releases" section on your
    echo     GitHub repo from your Android phone and download:
    echo     >>> Wheat-Doctor-v2.0-Android.apk <<<
    echo =====================================================================
)
echo.
pause

