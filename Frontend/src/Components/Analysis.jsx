import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../context/ThemeContext';
import { fetchTransactions } from '../Store/TransctionSlice';
import { motion } from 'framer-motion';
import {
  FiBarChart2, FiPieChart, FiTrendingUp, FiCalendar,
  FiFilter, FiDollarSign, FiCreditCard, FiArrowUp,
  FiArrowDown, FiActivity
} from 'react-icons/fi';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

// Custom colors for charts
const COLORS = ['#6366f1', '#22c55e', '#3b82f6', '#f43f5e', '#a855f7', '#14b8a6', '#f59e0b', '#ec4899'];

const Analysis = () => {
  const dispatch = useDispatch();
  const { darkMode } = useTheme();
  const { Transactions } = useSelector(state => state.transactions);

  // Filter states
  const [timeRange, setTimeRange] = useState('month');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0], // First day of current month
    endDate: new Date().toISOString().split('T')[0] // Today
  });
  const [activeChartType, setActiveChartType] = useState('distribution');

  // Fetch transactions on component mount
  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  // Process transactions data
  const getFilteredTransactions = () => {
    let filteredData = [...Transactions];
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);

    // Filter by date range
    filteredData = filteredData.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    return filteredData;
  };

  const filteredTransactions = getFilteredTransactions();

  // Calculate summary statistics
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Prepare data for pie chart
  const prepareExpensesByCategory = () => {
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

    return Object.entries(expensesByCategory).map(([name, value]) => ({
      name,
      value
    })).sort((a, b) => b.value - a.value); // Sort by highest amount
  };

  const pieChartData = prepareExpensesByCategory();

  // Prepare data for bar chart - Monthly spending by category
  const prepareMonthlyExpenses = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = [];

    // Get all categories
    const categories = [...new Set(filteredTransactions
      .filter(t => t.type === 'Expense')
      .map(t => t.expenseType || 'Uncategorized'))];

    // Initialize data for each month
    for (let i = 0; i < 12; i++) {
      const monthData = {
        name: months[i],
        month: i
      };
      categories.forEach(category => {
        monthData[category] = 0;
      });
      monthlyData.push(monthData);
    }

    // Fill in the data
    filteredTransactions
      .filter(t => t.type === 'Expense')
      .forEach(t => {
        const date = new Date(t.date);
        const month = date.getMonth();
        const category = t.expenseType || 'Other';
        monthlyData[month][category] += t.amount;
      });

    return { monthlyData, categories };
  };

  const { monthlyData, categories } = prepareMonthlyExpenses();

  // Prepare weekly spending trends data
  const prepareWeeklyTrends = () => {
    const weeklyData = [];
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;

    // Group by week (last 12 weeks)
    for (let i = 0; i < 12; i++) {
      const endDate = new Date(now.getTime() - (i * 7 * oneDay));
      const startDate = new Date(endDate.getTime() - (6 * oneDay));

      const weekTransactions = filteredTransactions.filter(t => {
        const date = new Date(t.date);
        return date >= startDate && date <= endDate;
      });

      const income = weekTransactions
        .filter(t => t.type === 'Income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = weekTransactions
        .filter(t => t.type === 'Expense')
        .reduce((sum, t) => sum + t.amount, 0);

      weeklyData.unshift({
        name: `Week ${12-i}`,
        income,
        expense,
        balance: income - expense
      });
    }

    return weeklyData;
  };

  const weeklyTrendsData = prepareWeeklyTrends();

  // Prepare radar chart data - category spending vs budget
  const prepareRadarData = () => {
    const categoryData = [];
    const totalByCategory = {};
    const maxByCategory = {};

    // Get total for each category
    filteredTransactions
      .filter(t => t.type === 'Expense')
      .forEach(t => {
        const category = t.expenseType || 'Other';
        if (!totalByCategory[category]) {
          totalByCategory[category] = 0;
          maxByCategory[category] = 0;
        }
        totalByCategory[category] += t.amount;
        maxByCategory[category] = Math.max(maxByCategory[category], t.amount);
      });

    // Convert to array format for radar chart
    Object.entries(totalByCategory).forEach(([category, amount]) => {
      categoryData.push({
        category,
        amount,
        average: amount / filteredTransactions.filter(t => t.expenseType === category).length || 0,
        maxTransaction: maxByCategory[category]
      });
    });

    return categoryData;
  };

  const radarData = prepareRadarData();

  // Handle date range change
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  useEffect(() => {
    // Set appropriate date range when time range changes
    const now = new Date();
    let startDate;

    switch(timeRange) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'all':
        startDate = new Date(2020, 0, 1); // Some arbitrary past date
        break;
      default:
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
    }

    setDateRange({
      startDate: startDate.toISOString().split('T')[0],
      endDate: now.toISOString().split('T')[0]
    });
  }, [timeRange]);

  return (
    <div className="w-full dark:bg-gray-900 transition-colors duration-200">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold dark:text-white">Spending Analysis</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Visualize and analyze your spending patterns
        </p>
      </motion.div>

      {/* Filters Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-lg font-medium dark:text-white flex items-center mb-4 sm:mb-0">
            <FiFilter className="mr-2" /> Filter Options
          </h2>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeRange === 'week'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeRange === 'month'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeRange === 'year'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
              }`}
            >
              Year
            </button>
            <button
              onClick={() => setTimeRange('all')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeRange === 'all'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
              }`}
            >
              All Time
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              From Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="text-gray-400" />
              </div>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateChange}
                max={dateRange.endDate}
                className="pl-10 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="text-gray-400" />
              </div>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateChange}
                min={dateRange.startDate}
                max={new Date().toISOString().split('T')[0]}
                className="pl-10 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 text-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-blue-100">Total Transactions</p>
                <h3 className="text-2xl font-bold mt-1">{filteredTransactions.length}</h3>
              </div>
              <div className="p-2 rounded-full bg-white/10">
                <FiCreditCard size={20} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-700 dark:to-green-800 text-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-green-100">Total Income</p>
                <h3 className="text-2xl font-bold mt-1">${totalIncome.toFixed(2)}</h3>
              </div>
              <div className="p-2 rounded-full bg-white/10">
                <FiArrowUp size={20} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-red-600 dark:from-red-700 dark:to-red-800 text-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-red-100">Total Expenses</p>
                <h3 className="text-2xl font-bold mt-1">${totalExpenses.toFixed(2)}</h3>
              </div>
              <div className="p-2 rounded-full bg-white/10">
                <FiArrowDown size={20} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-700 dark:to-purple-800 text-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-purple-100">Net Balance</p>
                <h3 className="text-2xl font-bold mt-1">${balance.toFixed(2)}</h3>
              </div>
              <div className="p-2 rounded-full bg-white/10">
                <FiDollarSign size={20} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Chart Type Selection Tabs */}
      <div className="flex overflow-x-auto pb-2 mb-4 scrollbar-hide">
        <button
          onClick={() => setActiveChartType('distribution')}
          className={`px-4 py-2 mr-2 text-sm font-medium rounded-lg flex items-center whitespace-nowrap ${
            activeChartType === 'distribution'
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700'
          }`}
        >
          <FiPieChart className="mr-2" /> Expense Distribution
        </button>
        <button
          onClick={() => setActiveChartType('trends')}
          className={`px-4 py-2 mr-2 text-sm font-medium rounded-lg flex items-center whitespace-nowrap ${
            activeChartType === 'trends'
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700'
          }`}
        >
          <FiTrendingUp className="mr-2" /> Spending Trends
        </button>
        <button
          onClick={() => setActiveChartType('patterns')}
          className={`px-4 py-2 mr-2 text-sm font-medium rounded-lg flex items-center whitespace-nowrap ${
            activeChartType === 'patterns'
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700'
          }`}
        >
          <FiBarChart2 className="mr-2" /> Category Patterns
        </button>
        <button
          onClick={() => setActiveChartType('radar')}
          className={`px-4 py-2 mr-2 text-sm font-medium rounded-lg flex items-center whitespace-nowrap ${
            activeChartType === 'radar'
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700'
          }`}
        >
          <FiActivity className="mr-2" /> Category Radar
        </button>
      </div>

      {/* Charts Section */}
      <motion.div
        key={activeChartType} // Change key to trigger animation on tab change
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Expense Distribution Charts */}
        {activeChartType === 'distribution' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-medium mb-4 dark:text-white flex items-center">
                <FiPieChart className="mr-2" /> Expense Distribution by Category
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData.length > 0 ? pieChartData : [{ name: 'No Data', value: 1 }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']}
                      contentStyle={{
                        backgroundColor: darkMode ? '#1F2937' : 'white',
                        borderColor: darkMode ? '#374151' : '#E5E7EB',
                        color: darkMode ? 'white' : 'black'
                      }}
                    />
                    <Legend formatter={(value) => <span style={{ color: darkMode ? '#D1D5DB' : '#111827' }}>{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Category Breakdown Table */}
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-2 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-2 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pieChartData.map((category, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="px-2 py-2 text-gray-900 dark:text-gray-200 flex items-center">
                          <div className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                          {category.name}
                        </td>
                        <td className="px-2 py-2 text-right text-gray-900 dark:text-gray-200">
                          ${category.value.toFixed(2)}
                        </td>
                        <td className="px-2 py-2 text-right text-gray-900 dark:text-gray-200">
                          {((category.value / totalExpenses) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-medium mb-4 dark:text-white flex items-center">
                <FiBarChart2 className="mr-2" /> Expenses by Category
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={pieChartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: darkMode ? '#D1D5DB' : '#4B5563' }}
                      axisLine={{ stroke: darkMode ? '#4B5563' : '#9CA3AF' }}
                    />
                    <YAxis
                      tick={{ fill: darkMode ? '#D1D5DB' : '#4B5563' }}
                      axisLine={{ stroke: darkMode ? '#4B5563' : '#9CA3AF' }}
                    />
                    <Tooltip
                      formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']}
                      contentStyle={{
                        backgroundColor: darkMode ? '#1F2937' : 'white',
                        borderColor: darkMode ? '#374151' : '#E5E7EB',
                        color: darkMode ? 'white' : 'black'
                      }}
                    />
                    <Bar dataKey="value" fill="#3B82F6" name="Amount">
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Spending Trends Charts */}
        {activeChartType === 'trends' && (
          <div className="grid grid-cols-1 gap-6">
            {/* Line Chart for Income, Expense, and Balance Trends */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-medium mb-4 dark:text-white flex items-center">
                <FiTrendingUp className="mr-2" /> Income vs Expense Trends
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={weeklyTrendsData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: darkMode ? '#D1D5DB' : '#4B5563' }}
                      axisLine={{ stroke: darkMode ? '#4B5563' : '#9CA3AF' }}
                    />
                    <YAxis
                      tick={{ fill: darkMode ? '#D1D5DB' : '#4B5563' }}
                      axisLine={{ stroke: darkMode ? '#4B5563' : '#9CA3AF' }}
                    />
                    <Tooltip
                      formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']}
                      contentStyle={{
                        backgroundColor: darkMode ? '#1F2937' : 'white',
                        borderColor: darkMode ? '#374151' : '#E5E7EB',
                        color: darkMode ? 'white' : 'black'
                      }}
                    />
                    <Legend formatter={(value) => <span style={{ color: darkMode ? '#D1D5DB' : '#111827' }}>{value}</span>} />
                    <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} name="Income" dot={{ stroke: '#10B981', strokeWidth: 2, r: 4 }} />
                    <Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={2} name="Expense" dot={{ stroke: '#EF4444', strokeWidth: 2, r: 4 }} />
                    <Line type="monotone" dataKey="balance" stroke="#3B82F6" strokeWidth={2} name="Balance" dot={{ stroke: '#3B82F6', strokeWidth: 2, r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Category Patterns */}
        {activeChartType === 'patterns' && (
          <div className="grid grid-cols-1 gap-6">
            {/* Stacked Bar Chart for Monthly Category Spending */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-medium mb-4 dark:text-white flex items-center">
                <FiBarChart2 className="mr-2" /> Monthly Spending by Category
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: darkMode ? '#D1D5DB' : '#4B5563' }}
                      axisLine={{ stroke: darkMode ? '#4B5563' : '#9CA3AF' }}
                    />
                    <YAxis
                      tick={{ fill: darkMode ? '#D1D5DB' : '#4B5563' }}
                      axisLine={{ stroke: darkMode ? '#4B5563' : '#9CA3AF' }}
                    />
                    <Tooltip
                      formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']}
                      contentStyle={{
                        backgroundColor: darkMode ? '#1F2937' : 'white',
                        borderColor: darkMode ? '#374151' : '#E5E7EB',
                        color: darkMode ? 'white' : 'black'
                      }}
                    />
                    <Legend formatter={(value) => <span style={{ color: darkMode ? '#D1D5DB' : '#111827' }}>{value}</span>} />
                    {categories.map((category, index) => (
                      <Bar
                        key={`bar-${category}`}
                        dataKey={category}
                        stackId="a"
                        fill={COLORS[index % COLORS.length]}
                        name={category}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Radar Chart for Category Analysis */}
        {activeChartType === 'radar' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-medium mb-4 dark:text-white flex items-center">
                <FiActivity className="mr-2" /> Category Spending Analysis
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} width={730} height={250} data={radarData}>
                    <PolarGrid stroke={darkMode ? '#4B5563' : '#9CA3AF'} />
                    <PolarAngleAxis
                      dataKey="category"
                      tick={{ fill: darkMode ? '#D1D5DB' : '#4B5563' }}
                    />
                    <PolarRadiusAxis
                      tick={{ fill: darkMode ? '#D1D5DB' : '#4B5563' }}
                      stroke={darkMode ? '#4B5563' : '#9CA3AF'}
                    />
                    <Radar
                      name="Amount"
                      dataKey="amount"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                    />
                    <Tooltip
                      formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']}
                      contentStyle={{
                        backgroundColor: darkMode ? '#1F2937' : 'white',
                        borderColor: darkMode ? '#374151' : '#E5E7EB',
                        color: darkMode ? 'white' : 'black'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-medium mb-4 dark:text-white flex items-center">
                <FiBarChart2 className="mr-2" /> Category Details
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-2 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-2 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Average
                      </th>
                      <th className="px-2 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Max
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {radarData.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="px-2 py-2 text-gray-900 dark:text-gray-200 flex items-center">
                          <div className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                          {item.category}
                        </td>
                        <td className="px-2 py-2 text-right text-gray-900 dark:text-gray-200">
                          ${item.amount.toFixed(2)}
                        </td>
                        <td className="px-2 py-2 text-right text-gray-900 dark:text-gray-200">
                          ${item.average.toFixed(2)}
                        </td>
                        <td className="px-2 py-2 text-right text-gray-900 dark:text-gray-200">
                          ${item.maxTransaction.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Analysis;
