@echo off
title Wheat Doctor Prototype (English and Hindi) Launcher
echo ========================================================
echo        WHEAT DOCTOR PROTOTYPE (English and Hindi)
echo     Wheat Crop, Cultivar and Rust Pathology Diagnostic AI
echo ========================================================
echo.
cd /d "%~dp0"
echo Choose launch mode:
echo   [1] Local Mode (This PC + Local Wi-Fi)
echo   [2] Worldwide Public Access (ANY phone/network, 4G, 5G, Remote)
echo.
set /p mode="Enter choice [1 or 2] (Default is 1): "

if "%mode%"=="2" (
    echo.
    echo Launching Worldwide Online Mode with Global Tunnel...
    start "" http://127.0.0.1:5000
    python app.py --online
) else (
    echo.
    echo Launching Local Mode...
    start "" http://127.0.0.1:5000
    python app.py
)

pause
