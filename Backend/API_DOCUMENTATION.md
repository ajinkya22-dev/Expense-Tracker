# API Documentation - Expense Tracker Backend

Base URL: `http://localhost:5000/api`

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Auth Endpoints

### 1. Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "profilePicture": "",
    "currency": "USD",
    "budget": 0
  }
}
```

### 2. Login User
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "profilePicture": "",
    "currency": "USD",
    "budget": 0
  }
}
```

### 3. Get Current User
**GET** `/auth/me` 🔒

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "65abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "profilePicture": "",
    "currency": "USD",
    "budget": 0
  }
}
```

### 4. Logout User
**POST** `/auth/logout` 🔒

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Transaction Endpoints (All Protected 🔒)

### 1. Get All Transactions
**GET** `/transactions`

**Query Parameters:**
- `startDate` (optional): Filter by start date (YYYY-MM-DD)
- `endDate` (optional): Filter by end date (YYYY-MM-DD)
- `type` (optional): Filter by type (Income/Expense)
- `source` (optional): Filter by source/category

**Example:**
```
GET /transactions?type=Expense&startDate=2026-01-01
```

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "transactions": [
    {
      "_id": "65abc123...",
      "user": "65user123...",
      "amount": 50,
      "type": "Expense",
      "source": "Food",
      "expenseType": "Groceries",
      "description": "Weekly groceries",
      "date": "2026-02-05T00:00:00.000Z",
      "time": "14:30",
      "createdAt": "2026-02-05T14:30:00.000Z",
      "updatedAt": "2026-02-05T14:30:00.000Z"
    }
  ]
}
```

### 2. Get Single Transaction
**GET** `/transactions/:id` 🔒

**Response (200):**
```json
{
  "success": true,
  "transaction": {
    "_id": "65abc123...",
    "amount": 50,
    "type": "Expense",
    "source": "Food",
    "expenseType": "Groceries",
    "description": "Weekly groceries",
    "date": "2026-02-05T00:00:00.000Z",
    "time": "14:30"
  }
}
```

### 3. Create Transaction
**POST** `/transactions` 🔒

**Request Body:**
```json
{
  "amount": 100,
  "type": "Income",
  "source": "Salary",
  "expenseType": "",
  "description": "Monthly salary",
  "date": "2026-02-05",
  "time": "09:00"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Transaction created successfully",
  "transaction": {
    "_id": "65abc123...",
    "user": "65user123...",
    "amount": 100,
    "type": "Income",
    "source": "Salary",
    "expenseType": "",
    "description": "Monthly salary",
    "date": "2026-02-05T00:00:00.000Z",
    "time": "09:00",
    "createdAt": "2026-02-05T09:00:00.000Z",
    "updatedAt": "2026-02-05T09:00:00.000Z"
  }
}
```

### 4. Update Transaction
**PUT** `/transactions/:id` 🔒

**Request Body:**
```json
{
  "amount": 150,
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Transaction updated successfully",
  "transaction": {
    "_id": "65abc123...",
    "amount": 150,
    "type": "Income",
    "source": "Salary",
    "description": "Updated description",
    "date": "2026-02-05T00:00:00.000Z",
    "time": "09:00"
  }
}
```

### 5. Delete Transaction
**DELETE** `/transactions/:id` 🔒

**Response (200):**
```json
{
  "success": true,
  "message": "Transaction deleted successfully",
  "id": "65abc123..."
}
```

### 6. Get Transaction Statistics
**GET** `/transactions/stats` 🔒

**Query Parameters:**
- `startDate` (optional): Start date for stats
- `endDate` (optional): End date for stats

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "income": 5000,
    "expense": 3000,
    "balance": 2000,
    "incomeCount": 10,
    "expenseCount": 25
  }
}
```

### 7. Get Transactions by Category
**GET** `/transactions/by-category` 🔒

**Query Parameters:**
- `type` (optional): Filter by Income or Expense

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": {
        "source": "Salary",
        "type": "Income"
      },
      "total": 5000,
      "count": 2
    },
    {
      "_id": {
        "source": "Food",
        "type": "Expense"
      },
      "total": 1200,
      "count": 15
    }
  ]
}
```

---

## User Endpoints (All Protected 🔒)

### 1. Update User Profile
**PUT** `/users/profile` 🔒

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "john.new@example.com",
  "profilePicture": "https://example.com/pic.jpg",
  "currency": "EUR",
  "budget": 5000,
  "password": "newpassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "65abc123...",
    "name": "John Updated",
    "email": "john.new@example.com",
    "profilePicture": "https://example.com/pic.jpg",
    "currency": "EUR",
    "budget": 5000
  }
}
```

### 2. Delete User Account
**DELETE** `/users/account` 🔒

**Response (200):**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

### 3. Get User Settings
**GET** `/users/settings` 🔒

**Response (200):**
```json
{
  "success": true,
  "settings": {
    "currency": "USD",
    "budget": 5000
  }
}
```

---

## Health Check

### Check Server Status
**GET** `/health`

**Response (200):**
```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2026-02-05T10:30:00.000Z"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server Error"
}
```

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Get Transactions (with token)
```bash
curl -X GET http://localhost:5000/api/transactions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Transaction
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"amount":100,"type":"Income","source":"Salary","date":"2026-02-05"}'
```

---

## Notes

- All dates should be in ISO 8601 format
- Tokens expire after 7 days (configurable)
- Password minimum length: 6 characters
- Email must be unique and valid
- Amounts must be positive numbers
- Transaction types: "Income" or "Expense" (case-sensitive)
