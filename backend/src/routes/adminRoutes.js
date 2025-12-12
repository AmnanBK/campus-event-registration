import express from 'express';
import { createOrganizer } from '../controllers/adminController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/organizers', protect, restrictTo('admin'), createOrganizer);

export default router;
