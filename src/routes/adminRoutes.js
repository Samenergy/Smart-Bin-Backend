import express from 'express';
import {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getSystemStats
} from '../controllers/adminController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/users', authMiddleware, getUsers);
router.get('/users/:userId', authMiddleware, getUserById);
router.put('/users/:userId', authMiddleware, updateUser);
router.delete('/users/:userId', authMiddleware, deleteUser);
router.get('/system/stats', authMiddleware, getSystemStats);

export default router;
