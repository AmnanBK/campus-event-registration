import express from 'express';
import {
  cancelRegistration,
  getRegistrationHistory,
} from '../controllers/registrationController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/history', protect, getRegistrationHistory);
router.delete('/:id', protect, cancelRegistration);

export default router;
