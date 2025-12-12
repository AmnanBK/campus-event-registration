import express from 'express';
import {
  createOrganizer,
  getAdminStats,
  getOrganizersList,
} from '../controllers/adminController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect, restrictTo('admin'));
router.post('/organizers', createOrganizer);
router.get('/stats', getAdminStats);
router.get('/organizers', getOrganizersList);

export default router;
