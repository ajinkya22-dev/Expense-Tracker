import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { FiUser, FiLock, FiMail, FiEdit2, FiSave, FiX, FiMoon, FiSun, FiBell, FiShield, FiDownload } from 'react-icons/fi';

const Settings = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { darkMode, toggleDarkMode } = useTheme();

  const [editMode, setEditMode] = useState({
    username: false,
    email: false,
    password: false
  });

  const [formData, setFormData] = useState({
    username: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [exportDataFormat, setExportDataFormat] = useState('json');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateUsername = () => {
    if (!formData.username.trim()) {
      setErrors(prev => ({
        ...prev,
        username: 'Username is required'
      }));
      return false;
    }
    return true;
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      setErrors(prev => ({
        ...prev,
        email: 'Email is required'
      }));
      return false;
    } else if (!emailRegex.test(formData.email)) {
      setErrors(prev => ({
        ...prev,
        email: 'Please enter a valid email address'
      }));
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    if (!formData.currentPassword) {
      setErrors(prev => ({
        ...prev,
        currentPassword: 'Current password is required'
      }));
      return false;
    }

    if (!formData.newPassword) {
      setErrors(prev => ({
        ...prev,
        newPassword: 'New password is required'
      }));
      return false;
    } else if (formData.newPassword.length < 6) {
      setErrors(prev => ({
        ...prev,
        newPassword: 'Password must be at least 6 characters'
      }));
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: 'Passwords do not match'
      }));
      return false;
    }

    return true;
  };

  const handleSaveUsername = () => {
    if (validateUsername()) {
      // Here you would dispatch an action to update the username in your Redux store
      // For now, we'll just show a success message
      setSuccessMessage('Username updated successfully!');
      setEditMode(prev => ({ ...prev, username: false }));

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  };

  const handleSaveEmail = () => {
    if (validateEmail()) {
      // Here you would dispatch an action to update the email in your Redux store
      setSuccessMessage('Email updated successfully!');
      setEditMode(prev => ({ ...prev, email: false }));

      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  };

  const handleSavePassword = () => {
    if (validatePassword()) {
      // Here you would dispatch an action to update the password
      setSuccessMessage('Password updated successfully!');
      setEditMode(prev => ({ ...prev, password: false }));
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  };

  const handleExportData = () => {
    const userData = {
      user: {
        username: user?.name || 'User',
        email: user?.email || 'user@example.com'
      },
      transactions: []
    };

    let dataStr, fileName;

    if (exportDataFormat === 'json') {
      dataStr = JSON.stringify(userData, null, 2);
      fileName = 'expensify-data.json';
    } else if (exportDataFormat === 'csv') {
      // Simple CSV format for demonstration
      const header = 'username,email\n';
      const data = `${user?.name || 'User'},${user?.email || 'user@example.com'}\n`;
      dataStr = header + data;
      fileName = 'expensify-data.csv';
    }

    const blob = new Blob([dataStr], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', fileName);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setSuccessMessage(`Data exported successfully as ${exportDataFormat.toUpperCase()}!`);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="w-full dark:bg-gray-900 transition-colors duration-200">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your account settings</p>
      </motion.div>

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-3 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-400 rounded-lg"
        >
          {successMessage}
        </motion.div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-6"
      >
        {/* Profile Settings */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-lg font-medium mb-4 dark:text-white flex items-center">
            <FiUser className="mr-2" /> Profile Information
          </h2>

          <div className="space-y-4">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              <div className="flex items-center">
                {editMode.username ? (
                  <div className="flex-grow">
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.username
                          ? 'border-red-500 dark:border-red-500'
                          : 'border-gray-300 dark:border-gray-700'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                    />
                    {errors.username && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.username}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex-grow">
                    <p className="px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg text-gray-900 dark:text-white">
                      {user?.name || user?.email || 'User'}
                    </p>
                  </div>
                )}
                <div className="ml-2">
                  {editMode.username ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveUsername}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full"
                        title="Save"
                      >
                        <FiSave />
                      </button>
                      <button
                        onClick={() => {
                          setEditMode(prev => ({ ...prev, username: false }));
                          setFormData(prev => ({ ...prev, username: user?.name || '' }));
                          setErrors(prev => ({ ...prev, username: null }));
                        }}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                        title="Cancel"
                      >
                        <FiX />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditMode(prev => ({ ...prev, username: true }))}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                      title="Edit"
                    >
                      <FiEdit2 />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="flex items-center">
                {editMode.email ? (
                  <div className="flex-grow">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.email
                          ? 'border-red-500 dark:border-red-500'
                          : 'border-gray-300 dark:border-gray-700'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
                  </div>
                ) : (
                  <div className="flex-grow">
                    <p className="px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg text-gray-900 dark:text-white">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                )}
                <div className="ml-2">
                  {editMode.email ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveEmail}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full"
                        title="Save"
                      >
                        <FiSave />
                      </button>
                      <button
                        onClick={() => {
                          setEditMode(prev => ({ ...prev, email: false }));
                          setFormData(prev => ({ ...prev, email: user?.email || '' }));
                          setErrors(prev => ({ ...prev, email: null }));
                        }}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                        title="Cancel"
                      >
                        <FiX />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditMode(prev => ({ ...prev, email: true }))}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                      title="Edit"
                    >
                      <FiEdit2 />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-lg font-medium mb-4 dark:text-white flex items-center">
            <FiLock className="mr-2" /> Security
          </h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.currentPassword
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-700'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
              />
              {errors.currentPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.currentPassword}</p>
              )}
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.newPassword
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-700'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
              />
              {errors.newPassword && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.newPassword}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.confirmPassword
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-700'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={handleSavePassword}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm"
              >
                Change Password
              </button>
            </div>
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-lg font-medium mb-4 dark:text-white">Preferences</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium dark:text-white flex items-center">
                  <FiMoon className="mr-2" /> Dark Mode
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Toggle between dark and light mode
                </p>
              </div>
              <div>
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium dark:text-white flex items-center">
                  <FiBell className="mr-2" /> Notifications
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Enable transaction notifications
                </p>
              </div>
              <div>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notificationsEnabled}
                    onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Data Management */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-lg font-medium mb-4 dark:text-white flex items-center">
            <FiShield className="mr-2" /> Data Management
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium dark:text-white">Export Your Data</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-3">
                Download all your data in the selected format
              </p>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <select
                  value={exportDataFormat}
                  onChange={(e) => setExportDataFormat(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="json">JSON Format</option>
                  <option value="csv">CSV Format</option>
                </select>
                <button
                  onClick={handleExportData}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm inline-flex items-center"
                >
                  <FiDownload className="mr-2" /> Export Data
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="font-medium text-red-600 dark:text-red-400">Danger Zone</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-3">
                Permanently delete your account and all your data
              </p>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                    // Handle account deletion
                    alert('Account deletion would be processed here.');
                  }
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm"
              >
                Delete Account
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Settings;
