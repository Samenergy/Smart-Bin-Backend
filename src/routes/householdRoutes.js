import express from 'express';
import {
    getHouseholdProfile,
    updateHouseholdProfile,
    getHouseholdSchedules,
    addHouseholdSchedule,
    updateHouseholdSchedule,
    deleteHouseholdSchedule,
    getRecyclingLog,
    addRecyclingLogEntry,
    editRecyclingLogEntry,
    deleteRecyclingLogEntry
} from '../controllers/householdController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', authMiddleware, getHouseholdProfile);
router.put('/profile', authMiddleware, updateHouseholdProfile);
router.get('/schedules', authMiddleware, getHouseholdSchedules);
router.post('/schedules', authMiddleware, addHouseholdSchedule);
router.put('/schedules/:scheduleId', authMiddleware, updateHouseholdSchedule);
router.delete('/schedules/:scheduleId', authMiddleware, deleteHouseholdSchedule);
router.get('/recycling-log', authMiddleware, getRecyclingLog);
router.post('/recycling-log', authMiddleware, addRecyclingLogEntry);
router.delete('/recycling-log/:entryId', authMiddleware, deleteRecyclingLogEntry);
router.put('/recycling-log/:entryId', authMiddleware, editRecyclingLogEntry);

export default router;
