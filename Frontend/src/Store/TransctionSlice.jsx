import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as transactionService from '../api/transactionService';

// Async thunks
export const fetchTransactions = createAsyncThunk(
    'transaction/fetchAll',
    async (filters = {}, { rejectWithValue }) => {
        try {
            const data = await transactionService.getTransactions(filters);
            return data.transactions;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions');
        }
    }
);

export const addTransactionAsync = createAsyncThunk(
    'transaction/add',
    async (transactionData, { rejectWithValue }) => {
        try {
            const data = await transactionService.createTransaction(transactionData);
            return data.transaction;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add transaction');
        }
    }
);

export const updateTransactionAsync = createAsyncThunk(
    'transaction/update',
    async ({ id, transactionData }, { rejectWithValue }) => {
        try {
            const data = await transactionService.updateTransaction(id, transactionData);
            return data.transaction;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update transaction');
        }
    }
);

export const removeTransactionAsync = createAsyncThunk(
    'transaction/remove',
    async (id, { rejectWithValue }) => {
        try {
            await transactionService.deleteTransaction(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete transaction');
        }
    }
);

export const fetchTransactionStats = createAsyncThunk(
    'transaction/fetchStats',
    async (filters = {}, { rejectWithValue }) => {
        try {
            const data = await transactionService.getTransactionStats(filters);
            return data.stats;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
        }
    }
);

export const TransactionSlice = createSlice({
    name: 'transaction',
    initialState: {
        Transactions: [],
        stats: {
            income: 0,
            expense: 0,
            balance: 0,
            incomeCount: 0,
            expenseCount: 0
        },
        loading: false,
        error: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearTransactions: (state) => {
            state.Transactions = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch transactions
            .addCase(fetchTransactions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.Transactions = action.payload;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add transaction
            .addCase(addTransactionAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addTransactionAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.Transactions.unshift(action.payload);
            })
            .addCase(addTransactionAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update transaction
            .addCase(updateTransactionAsync.fulfilled, (state, action) => {
                const index = state.Transactions.findIndex(t => t._id === action.payload._id);
                if (index !== -1) {
                    state.Transactions[index] = action.payload;
                }
            })
            // Remove transaction
            .addCase(removeTransactionAsync.fulfilled, (state, action) => {
                state.Transactions = state.Transactions.filter(
                    transaction => transaction._id !== action.payload
                );
            })
            // Fetch stats
            .addCase(fetchTransactionStats.fulfilled, (state, action) => {
                state.stats = action.payload;
            });
    }
});

export const { clearError, clearTransactions } = TransactionSlice.actions;

export default TransactionSlice.reducer;
