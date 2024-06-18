import express from 'express';
import { signupHouseholdUser, signupWasteCollectionService, signupAdmin } from '../controllers/authController.js';

const router = express.Router();

router.post('/household', signupHouseholdUser);
router.post('/service', signupWasteCollectionService);
router.post('/admin', signupAdmin);

export default router;
