@echo off
REM Create Desktop Shortcut for P2P Chatter Lite

setlocal enabledelayedexpansion

REM Path to the exe
set EXE_PATH=C:\Users\pc123\OneDrive\Documents\p2p-chatter-lite\dist\P2P Chatter Lite 1.0.0.exe
set ICON_PATH=C:\Users\pc123\OneDrive\Documents\p2p-chatter-lite\src\app.ico
set DESKTOP=%USERPROFILE%\Desktop
set SHORTCUT_NAME=P2P Chatter Lite.lnk

REM Check if exe exists
if not exist "%EXE_PATH%" (
    echo Error: Exe not found at %EXE_PATH%
    echo Please build the application first.
    pause
    exit /b 1
)

REM Create VBS script to create shortcut
set VBS_FILE=%temp%\create_shortcut.vbs

(
    echo Set oWS = WScript.CreateObject("WScript.Shell"^)
    echo sLinkFile = "%DESKTOP%\%SHORTCUT_NAME%"
    echo Set oLink = oWS.CreateShortcut(sLinkFile^)
    echo oLink.TargetPath = "%EXE_PATH%"
    echo oLink.WorkingDirectory = "%USERPROFILE%\OneDrive\Documents\p2p-chatter-lite"
    echo oLink.IconLocation = "%ICON_PATH%"
    echo oLink.Description = "P2P Chatter Lite - Privacy-Focused Peer-to-Peer Messaging"
    echo oLink.Save
    echo WScript.Echo "Shortcut created successfully at " ^& sLinkFile
) > "%VBS_FILE%"

REM Execute VBS script
cscript.exe "%VBS_FILE%"

REM Cleanup
del /f /q "%VBS_FILE%"

echo.
echo Shortcut created on your Desktop: %SHORTCUT_NAME%
echo Icon: Skull and Crossbones
pause
