# Expense Tracker Application

A comprehensive, full-stack personal finance and budget management solution. This application enables users to track financial transactions, manage monthly budgets, analyze spending habits through interactive visualizations, and export financial data for reporting.

---

## 1. Project Overview

The Expense Tracker Application is designed to streamline personal wealth management. By offering real-time visibility into cash flow, the platform empowers users to make informed financial decisions. The system is split into an interactive, state-managed frontend client and a secure, RESTful backend service handling authentication, business logic, and database persistence.

---

## 2. Project Scope

### In Scope
* **User Authentication & Identity Management**: Secure authentication via traditional email/password credentials or Google Federated Identity (OAuth 2.0).
* **Budget Tracking & Enforcement**: Setting monthly budgets with real-time tracking of remaining thresholds.
* **Transaction Lifecycle Management**: Logging, editing, categorizing, and deleting income and expense transactions.
* **Advanced Analytics**: Interactive financial modeling using bar, area, and pie charts to identify spending patterns.
* **Data Portability**: Exporting financial reports directly to PDF and Excel/CSV formats.
* **User-Defined Categorization**: Custom category creation with personalized colors and representations to match individual financial goals.

### Out of Scope / Future Roadmap
* **Bank Feed Integration**: Automated importing of transactions from bank accounts via Open Banking APIs (e.g., Plaid).
* **Multi-Currency Conversion**: Automatic calculation and adjustment based on real-time exchange rates.
* **Receipt Parsing (OCR)**: Automatic entry creation through machine learning analysis of uploaded receipt images.

---

## 3. Core Functionalities

### User Identity and Access Management
* **Dual-Channel Authentication**: Supports standard email-password accounts (secured with bcrypt hashing) and Google OAuth 2.0.
* **Session Management**: Implements secure cookie-based session state and JSON Web Tokens (JWT) for secure API communication.
* **Authorized Access Controls**: Ensures data isolation so users can only access their own profiles, transactions, and categories.

### Financial Analytics and Dashboard
* **Consolidated KPI Cards**: High-level summaries displaying total income, total expenses, defined monthly budget, and net balance.
* **Interactive Charts**: Rendered through Recharts, including trend charts over time and category-wise percentage distribution graphs.
* **Dynamic Budget Progress indicators**: Visual status bars highlighting current spending against the set budget limit.

### Transaction Ledger
* **Detailed Record Ledger**: tabular view displaying all transactions with custom sorting, date range filtering, search capabilities, and pagination.
* **Dynamic Transaction Posting**: Modals to log new transactions containing fields for amount, type (Income/Expense), date, category, and descriptive notes.

### Custom Classification and Budgeting
* **Category Configuration**: User interface for organizing expenses by creating, editing, and deleting categories with custom visual highlights.
* **Profile Settings**: Configuration of localized currency indicators and monthly budget limits.

### Export Capabilities
* **PDF Statements**: Generates clean, client-side PDF document structures with auto-formatted tables.
* **Excel & CSV Spreadsheets**: Packages records into spreadsheet sheets using standard Office Open XML formatting.

---

## 4. Technology Stack

### Frontend Client
* **React**: Core library for user interface components.
* **Redux Toolkit**: Centralized state management for authentication states, transaction lists, and system settings.
* **Tailwind CSS**: Utility-first CSS framework used to build a polished, responsive, and modern user interface.
* **Framer Motion**: Library utilized for fluid UI transitions and micro-animations.
* **Recharts**: D3-based charting library used for data visualization.
* **jsPDF & SheetJS (xlsx)**: Tools used for client-side document generation and data export.

### Backend Services
* **Node.js & Express.js**: Runtime environment and web framework responsible for serving API endpoints.
* **Passport.js**: Authentication middleware configured with Local and Google OAuth 2.0 strategies.
* **JSON Web Tokens (JWT)**: Secure mechanism for transmitting user authorization claims between frontend and backend.

### Database Layer
* **MongoDB**: NoSQL database for document storage.
* **Mongoose**: Object Data Modeling (ODM) library used to structure database schemas, enforce validation rules, and optimize queries through indexes.

---

## 5. System Requirements & Environment Configuration

### Prerequisites
* Node.js (v16.0.0 or higher)
* MongoDB (v5.0 or higher)

### Environment Variable Templates

#### Backend Service Config (`Backend/.env`)
Ensure the following variables are specified in your environment configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_jwt_signing_key
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

#### Frontend Client Config (`Frontend/.env`)
Specify the API URL targeting the active backend service:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 6. Execution Guide

### 1. Initialize Backend Service
Navigate to the server directory, install dependencies, and start the development server:
```bash
cd Backend
npm install
npm run dev
```

### 2. Initialize Frontend Client
Navigate to the client directory, install dependencies, and start the Vite server:
```bash
cd Frontend
npm install
npm run dev
```
The client application will run locally at [http://localhost:5173](http://localhost:5173) and route API queries to the configured backend.
