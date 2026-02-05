# Expense Tracker Backend

Backend API for Expense Tracker application built with Express.js, Node.js, and MongoDB.

## Features

- User authentication (Register, Login, Logout)
- JWT-based authorization
- Transaction management (CRUD operations)
- Transaction statistics and analytics
- User profile management
- Category-based transaction tracking

## Setup Instructions

### 1. Install Dependencies

```bash
cd Backend
npm install
```

### 2. Environment Variables

Create a `.env` file in the Backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_jwt_secret_key_here_please_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# For Windows
mongod

# For macOS/Linux
sudo systemctl start mongod
```

### 4. Run the Server

Development mode with auto-restart:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `POST /api/auth/logout` - Logout user (Protected)

### Transaction Routes (All Protected)
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/:id` - Get single transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/stats` - Get transaction statistics
- `GET /api/transactions/by-category` - Get transactions by category

### User Routes (All Protected)
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/account` - Delete user account
- `GET /api/users/settings` - Get user settings

### Health Check
- `GET /api/health` - Server health check

## Database Models

### User Model
- name (String, required)
- email (String, required, unique)
- password (String, required, hashed)
- profilePicture (String)
- currency (String, default: 'USD')
- budget (Number, default: 0)

### Transaction Model
- user (ObjectId, ref: User, required)
- amount (Number, required)
- type (String: 'Income' or 'Expense', required)
- source (String, required)
- expenseType (String)
- description (String)
- date (Date, required)
- time (String)

## Security Features

- Password hashing with bcryptjs
- JWT authentication
- Protected routes with middleware
- CORS configuration
- Input validation

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests
