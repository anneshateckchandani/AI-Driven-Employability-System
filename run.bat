@echo off
title AI-Driven Employability System

echo ==========================================
echo   AI-Driven Employability System
echo ==========================================
echo.

echo Starting Flask Backend...
start "Flask Backend" cmd /k "cd /d "%~dp0backend" && call venv\Scripts\activate && python app.py"

timeout /t 3 /nobreak >nul

echo.
echo Starting React Frontend...
start "React Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ==========================================
echo   Backend:  http://127.0.0.1:5000
echo   Frontend: http://localhost:5173
echo ==========================================
echo.
echo Both servers are starting...
pause