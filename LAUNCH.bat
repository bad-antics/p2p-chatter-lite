@echo off
REM P2P Chatter Lite - Launch Script
REM This script launches the P2P Chatter Lite application

echo.
echo ====================================
echo P2P Chatter Lite v1.0.0
echo ====================================
echo.
echo Launching application...
echo.

cd /d "%~dp0\dist"
"P2P Chatter Lite 1.0.0.exe"

if errorlevel 1 (
    echo.
    echo Error: Failed to launch application
    echo.
    pause
    exit /b 1
)
