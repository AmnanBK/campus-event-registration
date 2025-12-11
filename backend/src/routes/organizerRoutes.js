import express from 'express';
import {
  getDashboardStats,
  getMyEvents,
} from '../controllers/organizerController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/dashboard/stats', protect, getDashboardStats);
router.get('/events', protect, getMyEvents);

export default router;
