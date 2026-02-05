import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../Store/AuthSlice';
import * as authService from '../api/authService';

const GoogleAuthCallback = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (error) {
            console.error('Google authentication failed:', error);
            navigate('/login?error=google_auth_failed');
            return;
        }

        if (token) {
            // Store token
            localStorage.setItem('token', token);

            // Fetch user data
            authService.getCurrentUser()
                .then((data) => {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    dispatch(setUser(data.user));
                    navigate('/dashboard');
                })
                .catch((err) => {
                    console.error('Failed to fetch user:', err);
                    navigate('/login');
                });
        } else {
            navigate('/login');
        }
    }, [searchParams, navigate, dispatch]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Completing Google sign in...</p>
            </div>
        </div>
    );
};

export default GoogleAuthCallback;
