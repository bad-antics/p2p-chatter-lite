@echo off
REM P2P Chatter Lite Uninstaller
REM This script removes P2P Chatter Lite from the system

setlocal enabledelayedexpansion

title P2P Chatter Lite Uninstaller

echo.
echo =========================================================
echo     P2P Chatter Lite - Uninstall Setup
echo =========================================================
echo.

REM Define paths
set "INSTALL_DIR=%ProgramFiles%\P2P Chatter Lite"
set "DESKTOP_DIR=%USERPROFILE%\Desktop"
set "START_MENU_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\P2P Chatter Lite"

echo The following will be removed:
echo  • Installation directory: %INSTALL_DIR%
echo  • Desktop shortcut
echo  • Start Menu folder
echo.

set /p "response=Do you want to uninstall P2P Chatter Lite? (Y/N): "
if /i not "%response%"=="Y" (
    echo Uninstall cancelled.
    pause
    exit /b 0
)

echo.
echo Uninstalling P2P Chatter Lite...
echo.

REM Remove Start Menu shortcuts
if exist "%START_MENU_DIR%" (
    echo Removing Start Menu folder...
    rmdir /S /Q "%START_MENU_DIR%"
    echo  ✓ Start Menu folder removed
)

REM Remove desktop shortcut
if exist "%DESKTOP_DIR%\P2P Chatter Lite.lnk" (
    echo Removing desktop shortcut...
    del /Q "%DESKTOP_DIR%\P2P Chatter Lite.lnk"
    echo  ✓ Desktop shortcut removed
)

REM Remove installation directory
if exist "%INSTALL_DIR%" (
    echo Removing installation directory...
    rmdir /S /Q "%INSTALL_DIR%"
    echo  ✓ Installation directory removed
)

echo.
echo =========================================================
echo     Uninstallation Complete!
echo =========================================================
echo.
echo P2P Chatter Lite has been removed from your system.
echo.
pause
