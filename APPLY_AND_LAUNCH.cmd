@echo off
setlocal
cd /d "%~dp0"
echo ======================================================
echo   SatisDesk - Commercial Launch Gate
echo ======================================================
echo.
if not exist package.json (
  echo ERROR: Extract this ZIP directly INSIDE the original SatisDesk project folder.
  echo The folder must already contain package.json, .env.local and .vercel.
  pause
  exit /b 1
)
powershell -NoProfile -ExecutionPolicy Bypass -File ".\scripts\launch-commercial.ps1"
set RC=%ERRORLEVEL%
echo.
if not "%RC%"=="0" (
  echo LAUNCH STOPPED SAFELY with code %RC%.
  echo Send the text in this window to ChatGPT.
) else (
  echo LAUNCH COMMAND COMPLETED. Keep this window open while ChatGPT checks production.
)
pause
exit /b %RC%
