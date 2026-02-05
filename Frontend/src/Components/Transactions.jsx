import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeTransactionAsync, fetchTransactions } from "../Store/TransctionSlice.jsx";
import { addNotification } from "../Store/NotificationSlice.jsx";
import AddTransaction from "./AddTransaction.jsx";
import { FiPlus, FiSearch, FiFilter, FiTrash2, FiX, FiDownload } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

export default function Transactions() {
    const dispatch = useDispatch();
    const transactions = useSelector((state) => state.transactions.Transactions);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const { darkMode } = useTheme();

    // Fetch transactions on component mount
    useEffect(() => {
        dispatch(fetchTransactions());
    }, [dispatch]);

    // Function to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    // Function to open the modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Function to handle transaction deletion
    const handleDeleteTransaction = (id) => {
        dispatch(removeTransactionAsync(id));
        // Add notification for deletion
        dispatch(addNotification({
            title: 'Transaction Deleted',
            message: 'Transaction has been removed successfully',
            type: 'success',
        }));
    };

    // Filter transactions based on search term and type filter
    const filteredTransactions = transactions.filter(txn => {
        const matchesSearch = txn.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             txn.amount.toString().includes(searchTerm);
        const matchesFilter = filterType === 'all' || txn.type === filterType;
        return matchesSearch && matchesFilter;
    });

    // Function to export transactions as CSV
    const exportToCSV = () => {
        // Create CSV content
        const headers = ['Date', 'Time', 'Type', 'Source', 'Amount'];
        const csvData = filteredTransactions.map(txn =>
            [txn.date, txn.time, txn.type, txn.source, txn.amount].join(',')
        );

        const csvContent = [
            headers.join(','),
            ...csvData
        ].join('\n');

        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'transactions.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Add notification for export
        dispatch(addNotification({
            title: 'Export Complete',
            message: 'Transactions have been exported to CSV',
            type: 'success',
        }));
    };

    return (
        <div className="w-full dark:bg-gray-900 transition-colors duration-200">
            {/* Header with title and actions */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold dark:text-white">Transactions History</h1>
                <div className="flex space-x-3">
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <FiDownload size={16} />
                        <span>Export</span>
                    </button>
                    <button
                        onClick={openModal}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                    >
                        <FiPlus size={16} />
                        <span>Add Transaction</span>
                    </button>
                </div>
            </div>

            {/* Search and filter */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="relative w-full sm:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Filter:</span>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                        <option value="all">All Types</option>
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                    </select>
                </div>
            </div>

            {/* Transactions table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date & Time</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                        {searchTerm || filterType !== 'all'
                                            ? "No transactions match your search criteria."
                                            : "No transactions yet. Click 'Add Transaction' to get started."}
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map((txn) => (
                                    <tr key={txn.id || txn._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                            <div className="font-medium">{formatDate(txn.date)}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{txn.time}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                txn.type === 'Income' 
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                                {txn.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">
                                            <div className="font-medium">{txn.source}</div>
                                            {txn.type === 'Expense' && txn.expenseType && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">Category:</span>
                                                    <span 
                                                        className="text-xs font-medium px-2 py-0.5 rounded"
                                                        style={{ 
                                                            backgroundColor: txn.categoryColor ? `${txn.categoryColor}20` : '#e5e7eb',
                                                            color: txn.categoryColor || '#6b7280'
                                                        }}
                                                    >
                                                        {txn.expenseType}
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                                            txn.type === 'Income' 
                                                ? 'text-green-600 dark:text-green-400' 
                                                : 'text-red-600 dark:text-red-400'
                                        }`}>
                                            {txn.type === 'Income' ? '+' : '-'}${txn.amount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleDeleteTransaction(txn.id || txn._id)}
                                                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                                                title="Delete Transaction"
                                            >
                                                <FiTrash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal to Add Transaction */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex justify-center items-center">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                            <FiX size={20} />
                        </button>
                        <h2 className="text-xl font-bold mb-4 dark:text-white">Add New Transaction</h2>
                        <AddTransaction closeModal={closeModal} />
                    </div>
                </div>
            )}
        </div>
    );
}
