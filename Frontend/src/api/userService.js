import api from './axios';

// Update user profile
export const updateProfile = async (userData) => {
    const response = await api.put('/users/profile', userData);
    if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

// Delete user account
export const deleteAccount = async () => {
    const response = await api.delete('/users/account');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return response.data;
};

// Get user settings
export const getSettings = async () => {
    const response = await api.get('/users/settings');
    return response.data;
};
