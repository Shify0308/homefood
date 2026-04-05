#!/bin/bash

echo "=============================="
echo " HomeFood Setup Script"
echo "=============================="

echo ""
echo "[1/4] Setting up Backend..."
cd backend
npm install
if [ ! -f .env ]; then
  cp .env.example .env
  echo " ✅ Created backend/.env - Please fill in your credentials"
fi
echo " ✅ Backend dependencies installed!"
cd ..

echo ""
echo "[2/4] Setting up Frontend..."
cd frontend
npm install
if [ ! -f .env ]; then
  cp .env.example .env
  echo " ✅ Created frontend/.env - Please fill in your credentials"
fi
echo " ✅ Frontend dependencies installed!"
cd ..

echo ""
echo "=============================="
echo " ✅ Setup Complete!"
echo "=============================="
echo ""
echo "NEXT STEPS:"
echo "1. Edit backend/.env  → Add MongoDB, Cloudinary, Razorpay keys"
echo "2. Edit frontend/.env → Set REACT_APP_API_URL=http://localhost:5000"
echo ""
echo "START SERVERS:"
echo "  Terminal 1:  cd backend && npm run dev"
echo "  Terminal 2:  cd frontend && npm start"
echo ""
echo "Admin Login:"
echo "  Email:    admin@homefood.com  (set in backend .env as ADMIN_EMAIL)"
echo "  Password: Admin@123           (set in backend .env as ADMIN_PASSWORD)"
echo ""
