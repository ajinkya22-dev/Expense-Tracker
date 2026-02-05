import axios from './axios';

// Get all categories
export const getCategories = async () => {
    const response = await axios.get('/categories');
    return response.data;
};

// Add new category
export const addCategory = async (categoryData) => {
    const response = await axios.post('/categories', categoryData);
    return response.data;
};

// Update category
export const updateCategory = async (id, categoryData) => {
    const response = await axios.put(`/categories/${id}`, categoryData);
    return response.data;
};

// Delete category
export const deleteCategory = async (id) => {
    const response = await axios.delete(`/categories/${id}`);
    return response.data;
};
