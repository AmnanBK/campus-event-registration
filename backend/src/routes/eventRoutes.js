import express from 'express';
import { createEvent } from '../controllers/eventController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createEvent);

export default router;
