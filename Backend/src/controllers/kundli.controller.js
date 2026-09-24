import mongoose from 'mongoose';

import Kundli from '../models/Kundli.js';
import { generateKundli } from '../services/kundli.service.js';


// ========================================
// CREATE KUNDLI
// POST /api/kundli
// ========================================

export async function createKundli(
  req,
  res,
  next
) {
  try {
    const generated =
      await generateKundli(req.body);

    const doc =
      await Kundli.create({
        ...generated,

        user:
          req.user.id,

        relationship:
          req.body.relationship ||
          'self'
      });

    return res
      .status(201)
      .json(doc);

  } catch (error) {
    next(error);
  }
}


// ========================================
// LIST LOGGED-IN USER'S KUNDLIS
// GET /api/kundli
// ========================================

export async function listKundlis(
  req,
  res,
  next
) {
  try {
    const docs =
      await Kundli.find({
        user: req.user.id
      })
        .sort({
          createdAt: -1
        })
        .select(
          'name relationship birth settings createdAt updatedAt'
        );

    return res.json(docs);

  } catch (error) {
    next(error);
  }
}

// ========================================
// UPDATE KUNDLI
// PUT /api/kundli/:id
// ========================================

export async function updateKundli(
  req,
  res,
  next
) {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        message: 'Invalid Kundli ID'
      });
    }

    // ------------------------------------
    // Find user's existing Kundli
    // ------------------------------------

    const existing =
      await Kundli.findOne({
        _id: req.params.id,
        user: req.user.id
      });

    if (!existing) {
      return res.status(404).json({
        message: 'Kundli not found'
      });
    }

    // ------------------------------------
    // Merge existing birth data
    // with incoming changes
    // ------------------------------------

    const input = {
      name:
        req.body.name ??
        existing.name,

      date:
        req.body.date ??
        existing.birth.date,

      time:
        req.body.time ??
        existing.birth.time,

      place:
        req.body.place ??
        existing.birth.place,

      latitude:
        req.body.latitude ??
        existing.birth.latitude,

      longitude:
        req.body.longitude ??
        existing.birth.longitude,

      timezone:
        req.body.timezone ??
        existing.birth.timezone,

      settings: {
        ...existing.settings?.toObject?.(),
        ...req.body.settings
      }
    };

    // ------------------------------------
    // Recalculate entire Kundli
    // ------------------------------------

    const generated =
      await generateKundli(input);

    // ------------------------------------
    // Update
    // ------------------------------------

    existing.name =
      generated.name;

    existing.birth =
      generated.birth;

    existing.settings =
      generated.settings;

    existing.result =
      generated.result;

    if (req.body.relationship) {
      existing.relationship =
        req.body.relationship;
    }

    await existing.save();

    return res.json(existing);

  } catch (error) {
    next(error);
  }
}
// ========================================
// GET SINGLE KUNDLI
// GET /api/kundli/:id
// ========================================

export async function getKundli(
  req,
  res,
  next
) {
  try {

    // Check valid MongoDB ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        message:
          'Invalid Kundli ID'
      });
    }

    // IMPORTANT:
    // Search using BOTH Kundli ID + user ID.
    const doc =
      await Kundli.findOne({
        _id:
          req.params.id,

        user:
          req.user.id
      });

    if (!doc) {
      return res.status(404).json({
        message:
          'Kundli not found'
      });
    }

    return res.json(doc);

  } catch (error) {
    next(error);
  }
}


// ========================================
// DELETE KUNDLI
// DELETE /api/kundli/:id
// ========================================

export async function deleteKundli(
  req,
  res,
  next
) {
  try {

    // Check valid MongoDB ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        message:
          'Invalid Kundli ID'
      });
    }

    // Delete only if this Kundli
    // belongs to logged-in user.
    const doc =
      await Kundli.findOneAndDelete({
        _id:
          req.params.id,

        user:
          req.user.id
      });

    if (!doc) {
      return res.status(404).json({
        message:
          'Kundli not found'
      });
    }

    return res.json({
      deleted: true,
      id:
        doc._id
    });

  } catch (error) {
    next(error);
  }
}