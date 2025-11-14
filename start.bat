@echo off
echo Starting E-Commerce Application...
echo.

echo Starting MongoDB...
net start MongoDB
if %errorlevel% neq 0 (
    echo Warning: Could not start MongoDB service. Please ensure MongoDB is installed and configured.
    echo You can also use MongoDB Atlas cloud database.
    echo.
)

echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d "%~dp0backend" && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ======================================
echo   E-Commerce Application Started!
echo ======================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo Health:   http://localhost:5000/api/health
echo.
echo Login Credentials:
echo Admin: admin@ecommerce.com / admin123
echo User:  user@ecommerce.com / user123
echo.
echo Press any key to exit this window...
pause > nul