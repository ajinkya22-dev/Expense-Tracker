import { configureStore } from '@reduxjs/toolkit';
import transactionReducer from '../Store/TransctionSlice.jsx';
import authReducer from '../Store/AuthSlice.jsx';
import notificationReducer from '../Store/NotificationSlice.jsx';
import categoryReducer from '../Store/CategorySlice.jsx';

const store = configureStore({
    reducer: {
        transactions: transactionReducer,
        auth: authReducer,
        notifications: notificationReducer,
        categories: categoryReducer,
    },
});

export default store;
