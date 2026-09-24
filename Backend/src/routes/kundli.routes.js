import express from 'express';

import {
  createKundli,
  listKundlis,
  getKundli,
  updateKundli,
  deleteKundli
} from '../controllers/kundli.controller.js';

import {
  requireAuth
} from '../middleware/auth.js';

const router = express.Router();

// Protect every Kundli endpoint
router.use(requireAuth);

// Create
router.post('/', createKundli);

// List user's Kundlis
router.get('/', listKundlis);

// Get one
router.get('/:id', getKundli);

// Update + recalculate
router.put('/:id', updateKundli);

// Delete
router.delete('/:id', deleteKundli);

export default router;