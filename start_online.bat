@echo off
title Wheat Doctor AI - Worldwide Public Access
chcp 65001 >nul
echo ========================================================
echo        🌾 WHEAT DOCTOR AI (गेहूं डॉक्टर) — ONLINE MODE
echo     Foliar Pathology, Rust Diagnostic ^& Cultivar AI
echo ========================================================
echo.
echo [1/3] Navigating to Wheat Doctor directory...
cd /d "%~dp0"

echo [2/3] Starting Wheat Doctor AI with Global HTTPS Tunnel...
echo.
echo * Note: A secure HTTPS link will be generated below.
echo * Anyone on 4G, 5G, or any Wi-Fi worldwide can open it!
echo.

python app.py --online

pause
