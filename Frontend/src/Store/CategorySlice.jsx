import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as categoryService from '../api/categoryService';

// Async thunks
export const fetchCategories = createAsyncThunk(
    'categories/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await categoryService.getCategories();
            return response.categories;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
        }
    }
);

export const addCategoryAsync = createAsyncThunk(
    'categories/add',
    async (categoryData, { rejectWithValue }) => {
        try {
            const response = await categoryService.addCategory(categoryData);
            return response.category;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add category');
        }
    }
);

export const updateCategoryAsync = createAsyncThunk(
    'categories/update',
    async ({ id, categoryData }, { rejectWithValue }) => {
        try {
            const response = await categoryService.updateCategory(id, categoryData);
            return response.category;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update category');
        }
    }
);

export const deleteCategoryAsync = createAsyncThunk(
    'categories/delete',
    async (id, { rejectWithValue }) => {
        try {
            await categoryService.deleteCategory(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete category');
        }
    }
);

const categorySlice = createSlice({
    name: 'categories',
    initialState: {
        categories: [],
        loading: false,
        error: null
    },
    reducers: {
        clearCategoryError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch categories
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add category
            .addCase(addCategoryAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCategoryAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.categories.push(action.payload);
            })
            .addCase(addCategoryAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update category
            .addCase(updateCategoryAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCategoryAsync.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.categories.findIndex(cat => cat._id === action.payload._id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
            })
            .addCase(updateCategoryAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete category
            .addCase(deleteCategoryAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCategoryAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = state.categories.filter(cat => cat._id !== action.payload);
            })
            .addCase(deleteCategoryAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;
