import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../context/ThemeContext';
import { fetchTransactions } from '../Store/TransctionSlice';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { motion } from 'framer-motion';
import {
  FiDownload,
  FiFileText,
  FiPieChart,
  FiBarChart2,
  FiCalendar,
  FiFilter,
  FiDollarSign,
  FiChevronRight,
  FiCheck
} from 'react-icons/fi';

const Reports = () => {
  const dispatch = useDispatch();
  const { darkMode } = useTheme();
  const { user } = useSelector(state => state.auth);
  const { Transactions } = useSelector(state => state.transactions);

  const [reportType, setReportType] = useState('monthly');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0], // First day of current month
    endDate: new Date().toISOString().split('T')[0] // Today
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch transactions on component mount
  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  // Filter transactions based on date range
  const getFilteredTransactions = () => {
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);

    return Transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  };

  const filteredTransactions = getFilteredTransactions();

  // Calculate total income, expenses, and balance for filtered transactions
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
      if (!expensesByCategory[t.expenseType]) {
        expensesByCategory[t.expenseType] = 0;
      }
      expensesByCategory[t.expenseType] += t.amount;
    });

  // Handle date range change
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to set predefined date ranges
  const setDateRangePreset = (preset) => {
    const now = new Date();
    let startDate = new Date();

    switch(preset) {
      case 'today':
        startDate = new Date(now);
        break;
      case 'thisWeek':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - now.getDay());
        break;
      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'lastMonth':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        now.setDate(lastDayOfLastMonth);
        now.setMonth(now.getMonth() - 1);
        break;
      case 'thisYear':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'lastYear':
        startDate = new Date(now.getFullYear() - 1, 0, 1);
        now.setFullYear(now.getFullYear() - 1);
        now.setMonth(11);
        now.setDate(31);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    setDateRange({
      startDate: startDate.toISOString().split('T')[0],
      endDate: preset.startsWith('last') ? now.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    });
  };

  // Function to download reports as PDF
  const downloadReportAsPDF = (type = 'monthly') => {
    setIsGenerating(true);

    setTimeout(() => {
      try {
        // Create new jsPDF instance
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(20);
        doc.text(`${type.charAt(0).toUpperCase() + type.slice(1)} Expense Report`, 105, 15, { align: 'center' });

        // Add bank-like header
        doc.setDrawColor(0, 0, 0);
        doc.setFillColor(66, 135, 245);
        doc.rect(20, 25, 170, 15, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.text("EXPENSE REPORT", 105, 33, { align: 'center' });

        // Reset text color
        doc.setTextColor(0, 0, 0);

        // Add user info
        doc.setFontSize(11);
        doc.text(`Account Holder: ${user?.username || 'User'}`, 20, 45);
        doc.text(`Account Number: XXXX-XXXX-${Math.floor(Math.random() * 1000)}`, 20, 52);
        doc.text(`Statement Period: ${new Date(dateRange.startDate).toLocaleDateString()} to ${new Date(dateRange.endDate).toLocaleDateString()}`, 20, 59);
        doc.text(`Generated On: ${new Date().toLocaleString()}`, 20, 66);

        // Add summary
        doc.setFillColor(240, 240, 240);
        doc.rect(20, 75, 170, 15, 'F');
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text("FINANCIAL SUMMARY", 105, 83, { align: 'center' });
        doc.setFont(undefined, 'normal');

        doc.setFontSize(11);
        doc.text(`Total Income:`, 30, 95);
        doc.text(`$${totalIncome.toFixed(2)}`, 160, 95, { align: 'right' });

        doc.text(`Total Expenses:`, 30, 102);
        doc.text(`$${totalExpenses.toFixed(2)}`, 160, 102, { align: 'right' });

        doc.setDrawColor(200, 200, 200);
        doc.line(30, 105, 170, 105);

        doc.setFont(undefined, 'bold');
        doc.text(`Net Balance:`, 30, 112);
        doc.text(`$${balance.toFixed(2)}`, 160, 112, { align: 'right' });
        doc.setFont(undefined, 'normal');

        // Add category breakdown if we have expense categories
        let y = 120;
        if (Object.keys(expensesByCategory).length > 0) {
          doc.setFillColor(240, 240, 240);
          doc.rect(20, y, 170, 15, 'F');
          doc.setFontSize(12);
          doc.setFont(undefined, 'bold');
          doc.text("EXPENSE BREAKDOWN BY CATEGORY", 105, y + 8, { align: 'center' });
          doc.setFont(undefined, 'normal');

          y += 20;
          Object.entries(expensesByCategory).forEach(([category, amount], index) => {
            const percentage = (amount / totalExpenses * 100).toFixed(1);
            doc.setFontSize(11);
            doc.text(`${category}:`, 30, y);
            doc.text(`$${amount.toFixed(2)} (${percentage}%)`, 160, y, { align: 'right' });
            y += 7;
          });

          // Adjust starting Y position for transaction table
          y += 10;
        }

        // Add transactions table header
        doc.setFillColor(240, 240, 240);
        doc.rect(20, y, 170, 15, 'F');
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text("TRANSACTION DETAILS", 105, y + 8, { align: 'center' });
        doc.setFont(undefined, 'normal');

        // Create transaction table
        const tableColumn = ["Date", "Description", "Category", "Amount"];
        const tableRows = filteredTransactions.map(transaction => [
          transaction.date,
          transaction.source,
          transaction.expenseType || 'Income',
          `${transaction.type === 'Income' ? '+' : '-'}$${transaction.amount.toFixed(2)}`
        ]);

        // Use native table creation as a fallback if autoTable isn't working
        if (typeof doc.autoTable !== 'function') {
          y += 20;
          // Draw table header
          doc.setFillColor(66, 135, 245);
          doc.rect(20, y, 170, 10, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(10);
          doc.text("Date", 25, y + 7);
          doc.text("Description", 60, y + 7);
          doc.text("Category", 110, y + 7);
          doc.text("Amount", 160, y + 7, { align: 'right' });
          doc.setTextColor(0, 0, 0);

          // Draw table rows
          y += 15;
          tableRows.forEach((row, index) => {
            doc.setFontSize(9);
            doc.text(row[0], 25, y);
            doc.text(row[1].substring(0, 25) + (row[1].length > 25 ? '...' : ''), 60, y);
            doc.text(row[2], 110, y);
            doc.text(row[3], 160, y, { align: 'right' });
            y += 10;

            if (y > 270) {
              doc.addPage();
              y = 20;
            }
          });
        } else {
          // Use autoTable if available
          try {
            doc.autoTable({
              startY: y + 15,
              head: [tableColumn],
              body: tableRows,
              theme: 'striped',
              headStyles: { fillColor: [66, 135, 245] },
              styles: {
                fontSize: 10,
                cellPadding: 3
              },
              columnStyles: {
                0: { cellWidth: 30 },
                1: { cellWidth: 70 },
                2: { cellWidth: 40 },
                3: { cellWidth: 30, halign: 'right' }
              }
            });
          } catch (e) {
            console.error("AutoTable error:", e);
            setSuccessMessage("Error creating table in PDF. Please try again.");
          }
        }

        // Add footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text(`Page ${i} of ${pageCount}`, 105, doc.internal.pageSize.height - 10, { align: 'center' });
          doc.text('ExpensifyX - Your Financial Partner', 105, doc.internal.pageSize.height - 5, { align: 'center' });
        }

        // Save the PDF
        doc.save(`${type}-expense-report-${dateRange.startDate}-to-${dateRange.endDate}.pdf`);

        setIsGenerating(false);
        setSuccessMessage(`Your ${type} report has been successfully generated!`);

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } catch (error) {
        console.error("PDF generation error:", error);
        setIsGenerating(false);
        setSuccessMessage(`Error generating PDF: ${error.message}. Please try again.`);

        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      }
    }, 500); // Slight delay to show loading indicator
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
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
        <h1 className="text-2xl font-bold dark:text-white">Financial Reports</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Generate and download detailed reports of your financial activities
        </p>
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

      {/* Date Range Selector */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-6"
      >
        <h2 className="text-lg font-medium mb-4 dark:text-white flex items-center">
          <FiCalendar className="mr-2" /> Select Date Range
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Select:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setDateRangePreset('today')}
              className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Today
            </button>
            <button
              onClick={() => setDateRangePreset('thisWeek')}
              className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              This Week
            </button>
            <button
              onClick={() => setDateRangePreset('thisMonth')}
              className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              This Month
            </button>
            <button
              onClick={() => setDateRangePreset('lastMonth')}
              className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Last Month
            </button>
            <button
              onClick={() => setDateRangePreset('thisYear')}
              className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              This Year
            </button>
            <button
              onClick={() => setDateRangePreset('lastYear')}
              className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Last Year
            </button>
          </div>
        </div>
      </motion.div>

      {/* Report Type Selection */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-6"
      >
        <h2 className="text-lg font-medium mb-4 dark:text-white flex items-center">
          <FiFileText className="mr-2" /> Report Type
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <motion.div
            variants={itemVariants}
            className={`p-4 rounded-lg border ${
              reportType === 'monthly'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
            } cursor-pointer`}
            onClick={() => setReportType('monthly')}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium dark:text-white">Monthly Report</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Summary of your monthly income and expenses
                </p>
              </div>
              {reportType === 'monthly' && (
                <div className="bg-blue-500 dark:bg-blue-600 text-white p-1 rounded-full">
                  <FiCheck size={16} />
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className={`p-4 rounded-lg border ${
              reportType === 'category'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
            } cursor-pointer`}
            onClick={() => setReportType('category')}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium dark:text-white">Category Report</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Breakdown of expenses by category
                </p>
              </div>
              {reportType === 'category' && (
                <div className="bg-blue-500 dark:bg-blue-600 text-white p-1 rounded-full">
                  <FiCheck size={16} />
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className={`p-4 rounded-lg border ${
              reportType === 'detailed'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
            } cursor-pointer`}
            onClick={() => setReportType('detailed')}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium dark:text-white">Detailed Report</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Comprehensive transaction history and analysis
                </p>
              </div>
              {reportType === 'detailed' && (
                <div className="bg-blue-500 dark:bg-blue-600 text-white p-1 rounded-full">
                  <FiCheck size={16} />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Report Preview */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-6"
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-medium dark:text-white flex items-center">
            <FiPieChart className="mr-2" /> Report Preview
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => downloadReportAsPDF(reportType)}
            disabled={isGenerating}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>Generating...</>
            ) : (
              <>
                <FiDownload className="mr-2" /> Download PDF
              </>
            )}
          </motion.button>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">
            <div>
              <h3 className="font-bold text-lg dark:text-white">
                {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Expense Report
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(dateRange.startDate).toLocaleDateString()} to {new Date(dateRange.endDate).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Account Holder</p>
              <p className="font-medium dark:text-white">{user?.username || 'User'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Income</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">${totalIncome.toFixed(2)}</p>
            </div>
            <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">${totalExpenses.toFixed(2)}</p>
            </div>
            <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Net Balance</p>
              <p className={`text-xl font-bold ${balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                ${balance.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-medium mb-2 dark:text-white">Expense Breakdown</h4>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              {Object.keys(expensesByCategory).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(expensesByCategory)
                    .sort(([, amountA], [, amountB]) => amountB - amountA)
                    .map(([category, amount], index) => {
                      const percentage = (amount / totalExpenses) * 100;
                      return (
                        <div key={index} className="flex items-center">
                          <div className="w-32 sm:w-40 truncate" title={category}>
                            <span className="text-sm dark:text-white">{category}</span>
                          </div>
                          <div className="flex-grow mx-2">
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 dark:bg-blue-600"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium dark:text-white">
                              ${amount.toFixed(2)} ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No expense data available for the selected period.</p>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2 dark:text-white">Transaction Summary</h4>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              {filteredTransactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="px-2 py-2 text-left">Date</th>
                        <th className="px-2 py-2 text-left">Description</th>
                        <th className="px-2 py-2 text-left">Category</th>
                        <th className="px-2 py-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.slice(0, 5).map((transaction, index) => (
                        <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                          <td className="px-2 py-2 text-gray-900 dark:text-gray-200">{transaction.date}</td>
                          <td className="px-2 py-2 text-gray-900 dark:text-gray-200">{transaction.source}</td>
                          <td className="px-2 py-2 text-gray-900 dark:text-gray-200">{transaction.expenseType || 'Income'}</td>
                          <td className={`px-2 py-2 text-right ${transaction.type === 'Income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {transaction.type === 'Income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredTransactions.length > 5 && (
                    <div className="mt-2 text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        +{filteredTransactions.length - 5} more transactions in the full report
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No transactions available for the selected period.</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;
