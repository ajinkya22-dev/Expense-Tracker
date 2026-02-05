import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTheme } from './context/ThemeContext.jsx';
import Navbar from './Components/Navbar.jsx';
import Dashboard from "./Components/Dashboard.jsx";
import Transactions from "./Components/Transactions.jsx";
import About from "./Components/About.jsx";
import Login from "./Components/login.jsx";
import SignUp from "./Components/signUp.jsx";
import HomePage from "./Components/HomePage.jsx";
import AddTransaction from "./Components/AddTransaction.jsx";
import Reports from "./Components/Reports.jsx";
import Analysis from "./Components/Analysis.jsx";
import Settings from "./Components/Settings.jsx";
import GoogleAuthCallback from "./Components/GoogleAuthCallback.jsx";
import CompleteProfile from "./Components/CompleteProfile.jsx";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Layout component for dashboard pages
const DashboardLayout = ({ children }) => {
  const { darkMode } = useTheme();

  return (
    <div className={`flex flex-row h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden ${darkMode ? 'dark' : ''}`}>
      {/* Navbar component will render differently based on screen size */}
      <Navbar />

      {/* Main Content - centered on desktop, proper spacing on mobile */}
      <div className="flex-1 overflow-y-auto w-full bg-gray-50 dark:bg-gray-900">
        <div className="p-4 md:p-6 max-w-full pt-20 md:pt-4 pb-20 md:pb-4">
          {children}
        </div>
      </div>
    </div>
  );
};

function App() {
  // For GitHub Pages we need a basename
  const basePath = import.meta.env.BASE_URL || '/';
  const { darkMode } = useTheme();

  return (
    <Router basename={basePath}>
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/auth/callback" element={<GoogleAuthCallback />} />
          <Route path="/auth/complete-profile" element={<CompleteProfile />} />

          {/* Protected routes with dashboard layout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Transactions />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-transaction"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AddTransaction />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <About />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Reports and Analysis routes */}
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Reports />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Analysis />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch-all route - redirect to dashboard if authenticated, otherwise to login */}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
