import { Router } from 'express';
import {
  createKundli,
  listKundlis,
  getKundli,
  deleteKundli
} from '../controllers/kundli.controller.js';

const router = Router();

router.post('/', createKundli);
router.get('/', listKundlis);
router.get('/:id', getKundli);
router.delete('/:id', deleteKundli);

export default router;
