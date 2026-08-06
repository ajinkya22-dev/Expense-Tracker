# 💰 Expense Tracker Application

A premium, modern, and feature-rich full-stack application designed to help users track their personal finances, manage budgets, analyze spending habits with interactive charts, and export financial reports. Built using the MERN stack (MongoDB, Express, React, Node.js).

---

## 🚀 Features

### 💻 Frontend
- **Interactive Dashboard**: Modern user interface offering a quick view of total income, expenses, set budget, and current balance with glassmorphic elements.
- **Rich Analytics**: Visual representations of spending distributions using custom charts (Bar, Area, Pie) powered by **Recharts**.
- **Transaction Manager**: Advanced transactions table with pagination, multi-column search, and filtering by category, type, and date range.
- **Custom Category Manager**: Personalize financial tracking by creating custom categories, complete with custom icons (emojis) and colors.
- **Exportable Reports**: Generate and download professional financial statements in **PDF** (via jsPDF) and **Excel/CSV** (via SheetJS) formats.
- **Responsive Layout**: Designed with **Tailwind CSS** and animated with **Framer Motion** for a smooth, high-fidelity experience across desktop and mobile screens.

### ⚙️ Backend
- **Secure Authentication**: Traditional credentials authentication using **JWT** (JSON Web Tokens) and password hashing with **bcryptjs**.
- **Google OAuth 2.0 Integration**: Quick sign-in / registration using Google accounts via **Passport.js**.
- **Robust API Design**: RESTful design patterns using Express.js with custom middlewares for cookie parsing, error handling, session management, and route protection.
- **MongoDB Database**: Scalable data models with indexing for efficient querying of transactions and user preferences.
- **Health Checks & Validation**: Standard Express validators and health checks.

---

## 🛠️ Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, Redux Toolkit, Tailwind CSS, Framer Motion, Recharts, Axios, jsPDF, SheetJS (xlsx), React Icons |
| **Backend** | Node.js, Express.js, Passport.js, JWT, bcryptjs, cookie-parser, express-session |
| **Database** | MongoDB, Mongoose ODM |
| **Deployment**| Frontend pre-configured for Vercel, Backend runs as a Node service |

---

## 📂 Project Structure

```text
expense-tracker/
├── Backend/
│   ├── config/             # DB connection & Passport strategies
│   ├── controllers/        # Request handling and controller functions
│   ├── middlewares/        # Authentication, error handling, and session verification
│   ├── models/             # Mongoose schemas (User, Transaction)
│   ├── routes/             # REST API endpoint definitions
│   ├── utils/              # Helper functions and utilities
│   ├── .env.example        # Environment template file
│   ├── server.js           # Express application entrypoint
│   └── package.json        # Node.js backend dependencies and scripts
│
├── Frontend/
│   ├── public/             # Static public assets
│   ├── src/
│   │   ├── Components/     # React pages & components (Dashboard, Reports, Settings, etc.)
│   │   ├── Store/          # Redux toolkit store configuration & state slices
│   │   ├── api/            # Axios API config
│   │   ├── main.jsx        # React DOM mounting entry point
│   │   └── index.css       # Tailwind directives & custom CSS
│   ├── .env.example        # Environment template file
│   ├── vercel.json         # Vercel SPA routing configuration
│   └── package.json        # Node.js frontend dependencies and scripts
└── README.md               # Documentation (This file)
```

---

## 🏁 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local installation or MongoDB Atlas cluster)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd expense-tracker
   ```

2. **Backend Setup:**
   - Navigate to the `Backend` directory:
     ```bash
     cd Backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Set up environment variables:
     - Create a `.env` file based on `.env.example`:
       ```bash
       cp .env.example .env
       ```
     - Open `.env` and fill in your database URI and secrets:
       ```env
       PORT=5000
       MONGODB_URI=mongodb://localhost:27017/expense-tracker
       JWT_SECRET=your_jwt_secret_key_here
       JWT_EXPIRE=7d
       NODE_ENV=development
       FRONTEND_URL=http://localhost:5173
       ```

3. **Frontend Setup:**
   - Open a new terminal and navigate to the `Frontend` directory:
     ```bash
     cd Frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Set up environment variables:
     - Create a `.env` file based on `.env.example`:
       ```bash
       cp .env.example .env
       ```
     - Configure the API endpoint:
       ```env
       VITE_API_URL=http://localhost:5000/api
       ```

---

## 🏃 Running the Application

### Running the Backend
To start the backend in development mode with live reloading (via nodemon):
```bash
cd Backend
npm run dev
```
The server will start, connect to MongoDB, and listen on the configured port (default: `5000`).

### Running the Frontend
To start the frontend development server:
```bash
cd Frontend
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

---

## 🛡️ API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create a new user account
- `POST /api/auth/login` - Authenticate a user and issue cookies
- `GET /api/auth/logout` - Log out user and clear session cookies
- `GET /api/auth/me` - Retrieve current logged-in user details
- `GET /api/auth/google` - Trigger Google OAuth process

### Transactions (`/api/transactions`)
- `GET /api/transactions` - Retrieve transactions (supports search, sort, filters, pagination)
- `POST /api/transactions` - Create a new transaction
- `PUT /api/transactions/:id` - Update an existing transaction
- `DELETE /api/transactions/:id` - Delete a transaction

### Categories (`/api/categories`)
- `POST /api/categories` - Create custom categories for a user
- `DELETE /api/categories/:id` - Delete a custom category

### Users & Settings (`/api/users`)
- `PUT /api/users/profile` - Update user currency/budget settings
- `PUT /api/users/complete-profile` - Complete profile setup for OAuth registration

### Health Check (`/api/health`)
- `GET /api/health` - Check database and server status
