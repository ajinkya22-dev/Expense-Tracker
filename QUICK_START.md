# Quick Start Commands

## Step 1: Install Backend Dependencies
cd Backend
npm install

## Step 2: Install Frontend Dependencies  
cd ../Frontend
npm install

## Step 3: Make sure MongoDB is running
# Windows: net start MongoDB
# Or just run: mongod

## Step 4: Start Backend (in one terminal)
cd Backend
npm run dev

## Step 5: Start Frontend (in another terminal)
cd Frontend
npm run dev

## Your app will be available at:
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
# API Health Check: http://localhost:5000/api/health
