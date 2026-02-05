import express from 'express';
import { updateProfile, deleteAccount, getSettings } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protect all routes
router.use(protect);

router.put('/profile', updateProfile);
router.delete('/account', deleteAccount);
router.get('/settings', getSettings);

export default router;
