@echo off
echo Seeding E-Commerce Database...
echo.

cd /d "%~dp0backend"

echo Installing backend dependencies...
call npm install

echo.
echo Seeding database with sample data...
node src/seedData.js

echo.
echo ======================================
echo   Database seeding completed!
echo ======================================
echo.
echo Login Credentials:
echo Admin: admin@ecommerce.com / admin123
echo User:  user@ecommerce.com / user123
echo.
echo You can now start the application using start.bat
echo.
pause