@echo off
REM Build script for P2P Chatter Lite

echo ========================================
echo P2P Chatter Lite - Build Script
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

echo [1/5] Checking dependencies...
where npm >nul 2>&1
if errorlevel 1 (
    echo Error: npm is not installed or not in PATH
    pause
    exit /b 1
)

echo [2/5] Installing Node modules...
call npm install
if errorlevel 1 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo [3/5] Building Electron application...
call npm run build
if errorlevel 1 (
    echo Error: Failed to build application
    pause
    exit /b 1
)

echo [4/5] Creating installer...
REM Check if Inno Setup is installed
where iscc >nul 2>&1
if errorlevel 1 (
    echo Warning: Inno Setup not found. Skipping installer creation.
    echo You can manually create installer using: iscc installer\setup.iss
    goto :end
)

call iscc installer\setup.iss
if errorlevel 1 (
    echo Error: Failed to create installer
    pause
    exit /b 1
)

:end
echo [5/5] Build complete!
echo.
echo Output files:
echo - Portable: dist\P2P Chatter Lite-1.0.0.exe
echo - Installer: dist\P2P Chatter Lite Setup 1.0.0.exe
echo.
pause
