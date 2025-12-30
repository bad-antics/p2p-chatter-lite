@echo off
REM P2P Chatter Lite Installer
REM This script installs P2P Chatter Lite to the user's Program Files directory

setlocal enabledelayedexpansion

title P2P Chatter Lite Installer

echo.
echo =========================================================
echo     P2P Chatter Lite - Installation Setup
echo =========================================================
echo.

REM Define paths
set "SOURCE_DIR=%~dp0"
set "INSTALL_DIR=%ProgramFiles%\P2P Chatter Lite"
set "DESKTOP_DIR=%USERPROFILE%\Desktop"
set "START_MENU_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\P2P Chatter Lite"

echo Installation will begin...
echo.
echo Source: %SOURCE_DIR%
echo Destination: %INSTALL_DIR%
echo.

REM Check if Node.js is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: npm not found. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo Step 1: Creating installation directory...
if not exist "%INSTALL_DIR%" (
    mkdir "%INSTALL_DIR%"
    echo  ✓ Directory created
) else (
    echo  ✓ Directory already exists
)

echo.
echo Step 2: Copying application files...
REM Copy all files except node_modules and dist
xcopy "%SOURCE_DIR%*" "%INSTALL_DIR%" /E /I /Y /EXCLUDE:exclude.txt >nul 2>nul
if %errorlevel% equ 0 (
    echo  ✓ Files copied successfully
) else (
    echo  ! Some files skipped (this is normal)
)

echo.
echo Step 3: Creating desktop shortcut...
powershell -Command "
$WshShell = New-Object -ComObject WScript.Shell
$DesktopPath = [System.IO.Path]::Combine([System.Environment]::GetFolderPath('Desktop'), 'P2P Chatter Lite.lnk')
$Shortcut = $WshShell.CreateShortcut($DesktopPath)
$Shortcut.TargetPath = 'cmd.exe'
$Shortcut.Arguments = '/c cd /d \"%INSTALL_DIR%\" ^&^& npm start'
$Shortcut.WorkingDirectory = '%INSTALL_DIR%'
$Shortcut.Description = 'P2P Chatter Lite - Privacy-focused P2P Messaging'
$Shortcut.WindowStyle = 1
$Shortcut.Save()
Write-Host ' ✓ Desktop shortcut created'
"

echo.
echo Step 4: Creating Start Menu folder...
if not exist "%START_MENU_DIR%" (
    mkdir "%START_MENU_DIR%"
)

powershell -Command "
$WshShell = New-Object -ComObject WScript.Shell
$StartMenuPath = [System.IO.Path]::Combine('%START_MENU_DIR%', 'P2P Chatter Lite.lnk')
$Shortcut = $WshShell.CreateShortcut($StartMenuPath)
$Shortcut.TargetPath = 'cmd.exe'
$Shortcut.Arguments = '/c cd /d \"%INSTALL_DIR%\" ^&^& npm start'
$Shortcut.WorkingDirectory = '%INSTALL_DIR%'
$Shortcut.Description = 'P2P Chatter Lite - Privacy-focused P2P Messaging'
$Shortcut.WindowStyle = 1
$Shortcut.Save()
Write-Host ' ✓ Start Menu shortcut created'
"

echo.
echo =========================================================
echo     Installation Complete!
echo =========================================================
echo.
echo P2P Chatter Lite has been installed successfully.
echo.
echo Shortcuts created:
echo  • Desktop: "P2P Chatter Lite"
echo  • Start Menu: Programs ^> P2P Chatter Lite
echo.
echo To launch the application:
echo  1. Double-click the desktop shortcut, OR
echo  2. Search for "P2P Chatter Lite" in Start Menu
echo.
echo Note: The first launch may take a moment as dependencies are loaded.
echo.
pause
