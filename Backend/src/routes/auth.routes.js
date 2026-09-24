import express from 'express';

import {
  register,
  login,
  getMe
} from '../controllers/auth.controller.js';

import {
  requireAuth
} from '../middleware/auth.js';

const router = express.Router();

// Public
router.post('/register', register);
router.post('/login', login);

// Protected
router.get('/me', requireAuth, getMe);

export default router;