import express from 'express';
import {
  getAllEvents,
  getEventDetail,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventParticipants,
  exportParticipantsCSV,
} from '../controllers/eventController.js';
import { registerEvent } from '../controllers/registrationController.js';
import { protect, optionalProtect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getAllEvents);
router.get('/:id', optionalProtect, getEventDetail);

router.post('/', protect, createEvent);
router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);
router.get('/:id/participants', protect, getEventParticipants);
router.get('/:id/export', protect, exportParticipantsCSV);

router.post('/:id/register', protect, registerEvent);

export default router;
