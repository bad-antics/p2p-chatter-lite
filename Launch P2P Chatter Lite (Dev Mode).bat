@echo off
REM Launch P2P Chatter Lite in development mode with DevTools
REM This batch file starts the application with developer tools enabled

cd /d "%~dp0"
npm run dev
pause
