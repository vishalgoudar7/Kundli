import Kundli from '../models/Kundli.js';
import { generateKundli } from '../services/kundli.service.js';

export async function createKundli(req, res, next) {
  try {
    const generated = await generateKundli(req.body);
    const doc = await Kundli.create(generated);
    res.status(201).json(doc);
  } catch (e) {
    next(e);
  }
}

export async function listKundlis(_req, res, next) {
  try {
    const docs = await Kundli.find().sort({ createdAt: -1 }).select('name birth settings createdAt');
    res.json(docs);
  } catch (e) {
    next(e);
  }
}

export async function getKundli(req, res, next) {
  try {
    const doc = await Kundli.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Kundli not found' });
    res.json(doc);
  } catch (e) {
    next(e);
  }
}

export async function deleteKundli(req, res, next) {
  try {
    const doc = await Kundli.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Kundli not found' });
    res.json({ deleted: true });
  } catch (e) {
    next(e);
  }
}
