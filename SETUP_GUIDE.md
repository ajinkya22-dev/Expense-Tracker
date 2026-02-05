# Expense Tracker - Full Stack Setup Guide

Complete setup guide for the Expense Tracker application with React frontend and Express.js backend.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Project Structure

```
Expense-Tracker/
├── Backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── transactionController.js
│   │   └── userController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── Transaction.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   └── jwt.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── Frontend/
    ├── src/
    │   ├── api/
    │   │   ├── axios.js
    │   │   ├── authService.js
    │   │   ├── transactionService.js
    │   │   └── userService.js
    │   ├── Components/
    │   ├── Store/
    │   │   ├── AuthSlice.jsx
    │   │   ├── TransctionSlice.jsx
    │   │   └── Store.js
    │   └── ...
    ├── .env
    ├── package.json
    └── ...
```

## Backend Setup

### 1. Install Backend Dependencies

```bash
cd Backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the Backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Important:** Replace `JWT_SECRET` with a strong, random string in production!

### 3. Start MongoDB

Make sure MongoDB is running:

**Windows:**
```bash
# Start MongoDB service
net start MongoDB

# Or run mongod directly
mongod
```

**macOS/Linux:**
```bash
sudo systemctl start mongod
# or
sudo service mongod start
```

### 4. Run Backend Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The backend server will start on `http://localhost:5000`

## Frontend Setup

### 1. Install Frontend Dependencies

```bash
cd Frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the Frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Frontend Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## MongoDB Setup (If Not Installed)

### Windows:
1. Download MongoDB Community Server from mongodb.com
2. Run the installer
3. MongoDB will run as a Windows service

### macOS:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux (Ubuntu/Debian):
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

## Testing the Application

### 1. Check Backend Health

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2026-02-05T..."
}
```

### 2. Test User Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### 3. Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `POST /api/auth/logout` - Logout user (Protected)

### Transactions (All Protected)
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/:id` - Get single transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/stats` - Get statistics
- `GET /api/transactions/by-category` - Get by category

### User Profile (All Protected)
- `PUT /api/users/profile` - Update profile
- `DELETE /api/users/account` - Delete account
- `GET /api/users/settings` - Get settings

## Frontend Integration

The frontend now uses Redux Toolkit with async thunks for API calls:

### Authentication Example
```javascript
import { useDispatch } from 'react-redux';
import { loginUser } from './Store/AuthSlice';

const dispatch = useDispatch();

// Login
dispatch(loginUser({ email, password }));
```

### Transaction Example
```javascript
import { fetchTransactions, addTransactionAsync } from './Store/TransctionSlice';

// Fetch transactions
dispatch(fetchTransactions());

// Add transaction
dispatch(addTransactionAsync({
  amount: 100,
  type: 'Income',
  source: 'Salary',
  date: new Date()
}));
```

## Troubleshooting

### Backend won't start
- Check if MongoDB is running: `mongosh` or `mongo`
- Check if port 5000 is available
- Verify `.env` file exists and has correct values

### Frontend can't connect to backend
- Check if backend is running on port 5000
- Verify CORS settings in backend
- Check `.env` file in frontend has correct API URL

### Authentication issues
- Clear browser localStorage
- Check JWT_SECRET is set in backend .env
- Verify token is being sent in request headers

## Production Deployment

### Backend
1. Set `NODE_ENV=production` in .env
2. Use a strong JWT_SECRET
3. Use MongoDB Atlas or hosted MongoDB
4. Set up proper CORS origins
5. Enable HTTPS
6. Use environment variables for sensitive data

### Frontend
1. Build the frontend: `npm run build`
2. Set production API URL in .env
3. Deploy built files to hosting service

## Common Commands

### Backend
```bash
npm install          # Install dependencies
npm run dev          # Run in development mode
npm start            # Run in production mode
```

### Frontend
```bash
npm install          # Install dependencies
npm run dev          # Run development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Security Best Practices

1. Never commit `.env` files
2. Use strong JWT secrets
3. Implement rate limiting (consider using express-rate-limit)
4. Validate all user inputs
5. Use HTTPS in production
6. Keep dependencies updated
7. Implement proper error handling

## Support

For issues or questions, check:
- Backend logs in terminal
- Browser console for frontend errors
- MongoDB logs
- Network tab in browser DevTools

---

Happy Coding! 🚀
