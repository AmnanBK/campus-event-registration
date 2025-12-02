import express from 'express';
import { createEvent, updateEvent } from '../controllers/eventController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createEvent);
router.put('/:id', protect, updateEvent);

export default router;
