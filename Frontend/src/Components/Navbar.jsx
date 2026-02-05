import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../Store/AuthSlice';
import { useTheme } from '../context/ThemeContext';
import {
  FiHome,
  FiPieChart,
  FiDollarSign,
  FiSettings,
  FiBarChart2,
  FiUser,
  FiLogOut,
  FiFileText,
  FiHelpCircle,
  FiSun,
  FiMoon,
  FiBell,
  FiMenu,
  FiX
} from 'react-icons/fi';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { notifications, unreadCount } = useSelector(state => state.notifications);
  const { darkMode, toggleDarkMode } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const menuItems = [
    { icon: <FiHome size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <FiBarChart2 size={20} />, label: 'Analytics', path: '/analytics' },
    { icon: <FiDollarSign size={20} />, label: 'Transactions', path: '/transactions' },
    { icon: <FiFileText size={20} />, label: 'Reports', path: '/reports' },
    { icon: <FiSettings size={20} />, label: 'Settings', path: '/settings' },
  ];

  // Mobile menu items - simplified for bottom nav
  const mobileMenuItems = [
    { icon: <FiHome size={24} />, label: 'Home', path: '/dashboard' },
    { icon: <FiBarChart2 size={24} />, label: 'Analytics', path: '/analytics' },
    { icon: <FiDollarSign size={24} />, label: 'Transactions', path: '/transactions' },
    { icon: <FiUser size={24} />, label: 'Profile', path: '/settings' },
  ];

  return (
    <>
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:flex h-screen flex-col bg-white dark:bg-gray-800 shadow-sm py-5 w-64 transition-colors duration-200">
        {/* App Logo with Theme Toggle */}
        <div className="px-6 mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <FiDollarSign size={24} className="text-blue-600 dark:text-blue-400" />
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">ExpensifyX</span>
          </div>
          {/* Added Dark mode toggle button */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
        </div>

        {/* Profile Area */}
        <div className="px-6 mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
              {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">{user?.name || user?.email || 'User'}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Personal Account</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-4">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2.5 rounded-lg ${
                      isActive 
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    } transition-colors group`
                  }
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Logout Button */}
        <div className="px-4 mt-6 mb-2">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
          >
            <span className="mr-3"><FiLogOut size={20} /></span>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Header - Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 shadow-sm z-30 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <FiDollarSign size={24} className="text-blue-600 dark:text-blue-400" />
          <span className="ml-2 text-lg font-bold text-gray-900 dark:text-white">ExpensifyX</span>
        </div>
        <div className="flex items-center space-x-2">
          {/* Added Dark mode toggle button for mobile */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            <FiMenu size={18} />
          </button>
        </div>
      </div>

      {/* Mobile Slide-in Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="absolute right-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-800 shadow-lg transition-transform transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="ml-2">
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm">{user?.username || 'User'}</h3>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <FiX size={20} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-4">
              <ul className="space-y-3">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2.5 rounded-lg ${
                          isActive 
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        } transition-colors`
                      }
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </NavLink>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="mr-3"><FiLogOut size={20} /></span>
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 shadow-t z-30 flex items-center justify-around">
        {mobileMenuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full ${
                isActive 
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400'
              }`
            }
          >
            <span>{item.icon}</span>
            <span className="text-xs mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </>
  );
}
