import express from 'express';
import {
  createEvent,
  updateEvent,
  deleteEvent,
  getEventParticipants,
  exportParticipantsCSV,
} from '../controllers/eventController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createEvent);
router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);
router.get('/:id/participants', protect, getEventParticipants);
router.get('/:id/export', protect, exportParticipantsCSV);

export default router;
