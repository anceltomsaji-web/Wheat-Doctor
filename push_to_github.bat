@echo off
title Wheat Doctor - GitHub Push and Android APK Builder
cd /d "%~dp0"
python deploy_github.py %*
echo.
pause
