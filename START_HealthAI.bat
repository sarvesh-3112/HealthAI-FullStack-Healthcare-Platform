@echo off
echo ==========================================
echo    HealthAI Platform - Service Launcher
echo ==========================================
echo.

echo [1/4] Starting FastAPI Backend on port 8000...
start "HealthAI Backend" cmd /k "cd backend && python -m uvicorn main:app --reload --port 8000"

echo [2/4] Starting Patient Portal on port 3000...
start "HealthAI Patient" cmd /k "cd apps\patient && npm run dev"

echo [3/4] Starting Hospital Portal on port 3001...
start "HealthAI Hospital" cmd /k "cd apps\hospital && npm run dev"

echo [4/4] Starting Admin Control Panel on port 3002...
start "HealthAI Admin" cmd /k "cd apps\admin && npm run dev"

echo.
echo ==========================================
echo All services are starting in separate windows.
echo.
echo Patient Portal:   http://localhost:3000
echo Hospital Portal:  http://localhost:3001
echo Admin Panel:      http://localhost:3002
echo Backend API Docs: http://localhost:8000/docs
echo ==========================================
echo.
pause
