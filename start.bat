@echo off
title Wheat Doctor AI Server Launcher
echo ========================================================
echo               WHEAT DOCTOR AI (12 Languages)
echo       Wheat Crop, Cultivar and Pathology Diagnostic AI
echo ========================================================
echo.
cd /d "%~dp0"
echo Choose launch mode:
echo   [1] Worldwide Public Access (ANY phone/network, 4G, 5G, Remote)
echo   [2] Local Mode (This PC + Local Wi-Fi only)
echo.
set /p mode="Enter choice [1 or 2] (Default is 1): "

if "%mode%"=="2" (
    echo.
    echo Launching Local Mode...
    start "" http://127.0.0.1:5000
    python app.py
) else (
    echo.
    echo Launching Worldwide Online Mode with Global Tunnel...
    start "" http://127.0.0.1:5000
    python app.py --online
)

pause
