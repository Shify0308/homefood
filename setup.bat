@echo off
echo ==============================
echo  HomeFood Setup Script
echo ==============================

echo.
echo [1/4] Setting up Backend...
cd backend
call npm install
if not exist .env copy .env.example .env
echo  Backend dependencies installed!
echo  Please edit backend\.env with your credentials.
cd ..

echo.
echo [2/4] Setting up Frontend...
cd frontend
call npm install
if not exist .env copy .env.example .env
echo  Frontend dependencies installed!
echo  Please edit frontend\.env with your credentials.
cd ..

echo.
echo ==============================
echo  Setup Complete!
echo ==============================
echo.
echo NEXT STEPS:
echo 1. Edit backend\.env with MongoDB, Cloudinary, Razorpay keys
echo 2. Edit frontend\.env with API URL
echo 3. Run backend:  cd backend ^&^& npm run dev
echo 4. Run frontend: cd frontend ^&^& npm start
echo.
echo Admin Login:
echo   Email:    admin@homefood.com  (set in backend .env)
echo   Password: Admin@123           (set in backend .env)
echo.
pause
