import api from './axios';

// Get all transactions
export const getTransactions = async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.type) params.append('type', filters.type);
    if (filters.source) params.append('source', filters.source);
    
    const response = await api.get(`/transactions?${params.toString()}`);
    return response.data;
};

// Get single transaction
export const getTransaction = async (id) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
};

// Create transaction
export const createTransaction = async (transactionData) => {
    const response = await api.post('/transactions', transactionData);
    return response.data;
};

// Update transaction
export const updateTransaction = async (id, transactionData) => {
    const response = await api.put(`/transactions/${id}`, transactionData);
    return response.data;
};

// Delete transaction
export const deleteTransaction = async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
};

// Get transaction statistics
export const getTransactionStats = async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    
    const response = await api.get(`/transactions/stats?${params.toString()}`);
    return response.data;
};

// Get transactions by category
export const getTransactionsByCategory = async (type = '') => {
    const params = type ? `?type=${type}` : '';
    const response = await api.get(`/transactions/by-category${params}`);
    return response.data;
};
