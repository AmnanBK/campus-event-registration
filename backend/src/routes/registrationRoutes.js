import express from 'express';
import { cancelRegistration } from '../controllers/registrationController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.delete('/:id', protect, cancelRegistration);

export default router;
