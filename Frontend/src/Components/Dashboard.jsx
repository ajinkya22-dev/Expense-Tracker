import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../context/ThemeContext';
import { markAllAsRead, clearAllNotifications } from '../Store/NotificationSlice';
import { fetchTransactions } from '../Store/TransctionSlice';
import { fetchCategories } from '../Store/CategorySlice';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend, LineChart, Line
} from 'recharts';
import {
  FiArrowUp, FiArrowDown, FiDownload, FiCalendar, FiBell,
  FiFilter, FiMoon, FiSun, FiX, FiCheck, FiDollarSign,
  FiCreditCard, FiShoppingBag, FiHome, FiCoffee, FiTrendingUp,
  FiEye, FiPieChart, FiBarChart2, FiFileText, FiFile
} from 'react-icons/fi';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { darkMode, toggleDarkMode } = useTheme();
  const { user } = useSelector(state => state.auth);
  const { Transactions } = useSelector(state => state.transactions);
  const { categories } = useSelector(state => state.categories);
  const { notifications, unreadCount } = useSelector(state => state.notifications);

  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('month');
  const [showNotifications, setShowNotifications] = useState(false);
  const [reportType, setReportType] = useState('monthly');

  // Fetch transactions and categories on component mount
  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Create color map from custom categories
  const categoryColorMap = {};
  categories.forEach(cat => {
    categoryColorMap[cat.name] = cat.color;
  });

  // Default colors for predefined categories
  const defaultCategoryColors = {
    'Food': '#6366f1',
    'Shopping': '#22c55e',
    'Travel': '#3b82f6',
    'Bills': '#f43f5e',
    'Entertainment': '#a855f7',
    'Health': '#14b8a6',
    'Education': '#f59e0b',
    'Uncategorized': '#6b7280'
  };

  // Function to get category color
  const getCategoryColor = (categoryName) => {
    return categoryColorMap[categoryName] || defaultCategoryColors[categoryName] || '#6b7280';
  };

  // Filter transactions based on time range
  const getFilteredTransactions = () => {
    const now = new Date();
    let startDate = new Date();

    if (timeRange === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (timeRange === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else if (timeRange === 'year') {
      startDate.setFullYear(now.getFullYear() - 1);
    }

    return Transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= now;
    });
  };

  const filteredTransactions = getFilteredTransactions();

  // Calculate total income, expenses, and balance
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Group expenses by category for pie chart
  const expensesByCategory = {};
  filteredTransactions
    .filter(t => t.type === 'Expense')
    .forEach(t => {
      const category = t.expenseType || 'Uncategorized';
      if (!expensesByCategory[category]) {
        expensesByCategory[category] = 0;
      }
      expensesByCategory[category] += t.amount;
    });

  const pieChartData = Object.keys(expensesByCategory).map(category => ({
    name: category,
    value: expensesByCategory[category],
    color: getCategoryColor(category)
  }));

  // Create monthly spending data for area chart
  const monthlyData = [
    { name: 'Jan', income: 5000, expenses: 3200 },
    { name: 'Feb', income: 6000, expenses: 3800 },
    { name: 'Mar', income: 5500, expenses: 3500 },
    { name: 'Apr', income: 7000, expenses: 4200 },
    { name: 'May', income: 8000, expenses: 4800 },
    { name: 'Jun', income: 7500, expenses: 4400 },
    { name: 'Jul', income: 9000, expenses: 5000 },
    { name: 'Aug', income: 8500, expenses: 4700 },
  ];

  // Weekly data for line chart
  const weeklyData = [
    { name: 'Mon', income: 300, expenses: 200 },
    { name: 'Tue', income: 450, expenses: 280 },
    { name: 'Wed', income: 500, expenses: 350 },
    { name: 'Thu', income: 470, expenses: 260 },
    { name: 'Fri', income: 600, expenses: 400 },
    { name: 'Sat', income: 750, expenses: 500 },
    { name: 'Sun', income: 380, expenses: 220 },
  ];

  // Yearly data for bar chart
  const yearlyData = [
    { name: '2022', income: 45000, expenses: 30000 },
    { name: '2023', income: 60000, expenses: 38000 },
    { name: '2024', income: 75000, expenses: 42000 },
    { name: '2025', income: 85000, expenses: 47000 },
  ];

  // Categories for bar chart
  const categorySpendings = [
    { name: 'Food', amount: 1200 },
    { name: 'Shopping', amount: 800 },
    { name: 'Transport', amount: 600 },
    { name: 'Entertainment', amount: 500 },
    { name: 'Bills', amount: 1500 },
  ];

  // COLORS for pie chart - dynamically generated from pieChartData
  const COLORS = pieChartData.map(item => item.color);

  // Mock recent transactions
  const recentTransactions = filteredTransactions.slice(0, 5);

  // Function to download reports as PDF
  const downloadReportAsPDF = (type = 'monthly') => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text(`${type.charAt(0).toUpperCase() + type.slice(1)} Expense Report`, 105, 15, { align: 'center' });

    // Add user info
    doc.setFontSize(12);name || user?.email
    doc.text(`Generated for: ${user?.username || 'User'}`, 20, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);
    doc.text(`Report Type: ${type.charAt(0).toUpperCase() + type.slice(1)}`, 20, 50);

    // Add summary
    doc.setFontSize(16);
    doc.text("Financial Summary", 20, 65);

    doc.setFontSize(12);
    doc.text(`Total Income: $${totalIncome}`, 30, 75);
    doc.text(`Total Expenses: $${totalExpenses}`, 30, 85);
    doc.text(`Current Balance: $${balance}`, 30, 95);

    // Add transactions table
    doc.setFontSize(16);
    doc.text("Recent Transactions", 20, 110);

    const tableColumn = ["Date", "Type", "Source", "Amount"];
    const tableRows = filteredTransactions.map(transaction => [
      transaction.date,
      transaction.type,
      transaction.source,
      `$${transaction.amount}`
    ]);

    doc.autoTable({
      startY: 115,
      head: [tableColumn],
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: [66, 135, 245] }
    });

    // Add category breakdown if there's space
    const finalY = doc.previousAutoTable.finalY || 115;

    if (finalY < 220) {
      doc.setFontSize(16);
      doc.text("Expense Breakdown by Category", 20, finalY + 15);

      let y = finalY + 25;
      Object.entries(expensesByCategory).forEach(([category, amount], index) => {
        doc.setFontSize(12);
        doc.text(`${category}: $${amount}`, 30, y);
        y += 10;
      });
    }

    // Save the PDF
    doc.save(`${type}-expense-report.pdf`);
  };

  // Function to export transactions as Excel
  const exportTransactionsAsExcel = () => {
    // Create worksheet from filtered transactions
    const worksheet = XLSX.utils.json_to_sheet(
      filteredTransactions.map(t => ({
        Date: t.date,
        Time: t.time,
        Type: t.type,
        Source: t.source,
        Category: t.expenseType || 'Income',
        Amount: t.amount,
        'Amount with Symbol': `${t.type === 'Income' ? '+' : '-'}$${t.amount}`
      }))
    );

    // Create workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, `${timeRange}-transactions.xlsx`);
  };

  // Handle notification actions
  const handleClearAllNotifications = () => {
    dispatch(clearAllNotifications());
    setShowNotifications(false);
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  // Animation variants for Framer Motion
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
      {/* Dashboard Header */}
      <motion.div
        className="flex justify-between items-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Welcome back, {user?.username || 'User'}</p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Time Range Selector */}
          <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1 text-sm rounded-md ${timeRange === 'week' 
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-300'}`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1 text-sm rounded-md ${timeRange === 'month' 
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-300'}`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`px-3 py-1 text-sm rounded-md ${timeRange === 'year' 
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-300'}`}
            >
              Year
            </button>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
            >
              <FiBell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 h-5 w-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium dark:text-white">Notifications</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Mark all as read
                    </button>
                    <button
                      onClick={handleClearAllNotifications}
                      className="text-xs text-gray-600 dark:text-gray-400 hover:underline"
                    >
                      Clear all
                    </button>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto py-1">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      No notifications
                    </div>
                  ) : (
                    notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                          !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                      >
                        <div className="flex items-start">
                          <div className={`mr-3 mt-0.5 p-1.5 rounded-full ${
                            notification.type === 'success' 
                              ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                              : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}>
                            {notification.type === 'success' ? <FiCheck size={14} /> : <FiDollarSign size={14} />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium dark:text-white">{notification.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              {new Date(notification.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Total Balance Card */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
          variants={itemVariants}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Balance</p>
              <h3 className="text-2xl font-bold mt-1 dark:text-white">${balance.toFixed(2)}</h3>
              <div className="flex items-center mt-2">
                <span className={`inline-flex items-center text-xs font-medium ${
                  balance >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {balance >= 0 ? <FiArrowUp className="mr-1" /> : <FiArrowDown className="mr-1" />}
                  {Math.abs(((balance / totalIncome) * 100) || 0).toFixed(1)}%
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">vs last period</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <FiDollarSign size={20} />
            </div>
          </div>
        </motion.div>

        {/* Income Card */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
          variants={itemVariants}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Income</p>
              <h3 className="text-2xl font-bold mt-1 dark:text-white">${totalIncome.toFixed(2)}</h3>
              <div className="flex items-center mt-2">
                <span className="inline-flex items-center text-xs font-medium text-green-600 dark:text-green-400">
                  <FiArrowUp className="mr-1" />
                  12.5%
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">vs last period</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <FiArrowUp size={20} />
            </div>
          </div>
        </motion.div>

        {/* Expenses Card */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
          variants={itemVariants}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
              <h3 className="text-2xl font-bold mt-1 dark:text-white">${totalExpenses.toFixed(2)}</h3>
              <div className="flex items-center mt-2">
                <span className="inline-flex items-center text-xs font-medium text-red-600 dark:text-red-400">
                  <FiArrowUp className="mr-1" />
                  8.2%
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">vs last period</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400">
              <FiArrowDown size={20} />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'overview'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'analytics'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'reports'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Reports
        </button>
      </div>

      {/* Tab Content */}
      <div className="mb-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Area Chart */}
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium dark:text-white">Income vs Expenses</h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-1"></span> Income
                    <span className="inline-block w-3 h-3 bg-red-500 rounded-full ml-3 mr-1"></span> Expenses
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={timeRange === 'week' ? weeklyData : timeRange === 'month' ? monthlyData : yearlyData}
                      margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#f0f0f0'} />
                      <XAxis
                        dataKey="name"
                        stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                        fontSize={12}
                      />
                      <YAxis
                        stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                        fontSize={12}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip
                        formatter={(value) => [`$${value}`, undefined]}
                        contentStyle={{
                          backgroundColor: darkMode ? '#1F2937' : 'white',
                          borderColor: darkMode ? '#374151' : '#E5E7EB',
                          color: darkMode ? 'white' : 'black'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="income"
                        stroke="#3B82F6"
                        fillOpacity={1}
                        fill="url(#colorIncome)"
                      />
                      <Area
                        type="monotone"
                        dataKey="expenses"
                        stroke="#EF4444"
                        fillOpacity={1}
                        fill="url(#colorExpenses)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="font-medium mb-4 dark:text-white">Expenses by Category</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData.length > 0 ? pieChartData : [{ name: 'No Data', value: 1 }]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`$${value}`, undefined]}
                        contentStyle={{
                          backgroundColor: darkMode ? '#1F2937' : 'white',
                          borderColor: darkMode ? '#374151' : '#E5E7EB',
                          color: darkMode ? 'white' : 'black'
                        }}
                      />
                      <Legend
                        formatter={(value) => <span style={{ color: darkMode ? '#D1D5DB' : '#111827' }}>{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-medium dark:text-white">Recent Transactions</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={exportTransactionsAsExcel}
                    className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <FiDownload size={16} className="mr-1" />
                    <span>Export as Excel</span>
                  </button>
                  <Link to="/transactions" className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    <FiEye size={16} className="mr-1" />
                    <span>View All</span>
                  </Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50 text-left">
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {recentTransactions.map(transaction => (
                      <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">
                          {transaction.date}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">
                          {transaction.source}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">
                          {transaction.expenseType || 'Income'}
                        </td>
                        <td className={`px-4 py-3 text-sm font-medium text-right ${
                          transaction.type === 'Income'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {transaction.type === 'Income' ? '+' : '-'}${transaction.amount}
                        </td>
                      </tr>
                    ))}
                    {recentTransactions.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-4 py-6 text-sm text-center text-gray-500 dark:text-gray-400">
                          No recent transactions
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart - Category Spending */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="font-medium mb-4 dark:text-white">Spending by Category</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={categorySpendings}
                      margin={{ top: 10, right: 10, left: 10, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#f0f0f0'} />
                      <XAxis
                        dataKey="name"
                        stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        tick={{ dy: 10 }}
                      />
                      <YAxis
                        stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                        fontSize={12}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip
                        formatter={(value) => [`$${value}`, 'Amount']}
                        contentStyle={{
                          backgroundColor: darkMode ? '#1F2937' : 'white',
                          borderColor: darkMode ? '#374151' : '#E5E7EB',
                          color: darkMode ? 'white' : 'black'
                        }}
                      />
                      <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Trends */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="font-medium mb-4 dark:text-white">Monthly Spending Trends</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={monthlyData}
                      margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorExpenseTrend" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#f0f0f0'} />
                      <XAxis
                        dataKey="name"
                        stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                        fontSize={12}
                      />
                      <YAxis
                        stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                        fontSize={12}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip
                        formatter={(value) => [`$${value}`, undefined]}
                        contentStyle={{
                          backgroundColor: darkMode ? '#1F2937' : 'white',
                          borderColor: darkMode ? '#374151' : '#E5E7EB',
                          color: darkMode ? 'white' : 'black'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="expenses"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorExpenseTrend)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Expense Analysis */}
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-medium dark:text-white">Expense Analysis</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2 dark:text-white">Highest Expense Category</h4>
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 mr-3">
                        <FiShoppingBag size={20} />
                      </div>
                      <div>
                        <p className="font-medium dark:text-white">Shopping</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">28% of total expenses</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2 dark:text-white">Lowest Expense Category</h4>
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 mr-3">
                        <FiCoffee size={20} />
                      </div>
                      <div>
                        <p className="font-medium dark:text-white">Entertainment</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">8% of total expenses</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2 dark:text-white">Fastest Growing Expense</h4>
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 mr-3">
                        <FiHome size={20} />
                      </div>
                      <div>
                        <p className="font-medium dark:text-white">Housing</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">↑ 15% from last month</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2 dark:text-white">Most Frequent Expense</h4>
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-3">
                        <FiCreditCard size={20} />
                      </div>
                      <div>
                        <p className="font-medium dark:text-white">Food & Dining</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">42 transactions this month</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-medium dark:text-white">Available Reports</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={() => {
                      setReportType('monthly');
                      downloadReportAsPDF('monthly');
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        <FiFileText size={20} />
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                        <FiDownload size={16} />
                      </button>
                    </div>
                    <h4 className="font-medium mb-1 dark:text-white">Monthly Expense Report</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Detailed breakdown of all transactions</p>
                  </motion.div>

                  <motion.div
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={() => {
                      setReportType('category');
                      downloadReportAsPDF('category');
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                        <FiPieChart size={20} />
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                        <FiDownload size={16} />
                      </button>
                    </div>
                    <h4 className="font-medium mb-1 dark:text-white">Category Analysis</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Spending patterns by category</p>
                  </motion.div>

                  <motion.div
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={() => {
                      setReportType('annual');
                      downloadReportAsPDF('annual');
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                        <FiBarChart2 size={20} />
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                        <FiDownload size={16} />
                      </button>
                    </div>
                    <h4 className="font-medium mb-1 dark:text-white">Annual Summary</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Year-to-date financial overview</p>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Income vs Expenses Report */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-medium dark:text-white">Income vs Expenses Report</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="text-sm font-medium mb-3 dark:text-white">Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Total Income:</span>
                        <span className="font-medium dark:text-white">${totalIncome.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Total Expenses:</span>
                        <span className="font-medium dark:text-white">${totalExpenses.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-gray-500 dark:text-gray-400">Net Balance:</span>
                        <span className={`font-medium ${
                          balance >= 0 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>${balance.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-3 dark:text-white">Savings Rate</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Income Saved:</span>
                        <span className="font-medium dark:text-white">
                          {totalIncome > 0
                            ? `${((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1)}%`
                            : '0%'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Monthly Target:</span>
                        <span className="font-medium dark:text-white">20%</span>
                      </div>
                      <div className="pt-2">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{
                              width: `${Math.min(
                                totalIncome > 0 
                                  ? ((totalIncome - totalExpenses) / totalIncome * 100) 
                                  : 0, 100)}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <motion.button
                    onClick={() => downloadReportAsPDF(reportType)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiDownload size={16} />
                    <span>Download Full Report</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
