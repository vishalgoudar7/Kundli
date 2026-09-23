import mongoose from 'mongoose';

const kundliSchema = new mongoose.Schema(
  {
    // =====================================
    // OWNER
    // =====================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    // =====================================
    // PERSON / RELATIONSHIP
    // =====================================

    relationship: {
      type: String,
      enum: [
        'self',
        'partner',
        'father',
        'mother',
        'brother',
        'sister',
        'child',
        'friend',
        'other'
      ],
      default: 'self'
    },

    // =====================================
    // NAME
    // =====================================

    name: {
      type: String,
      required: true,
      trim: true
    },

    // =====================================
    // BIRTH DETAILS
    // =====================================

    birth: {
      date: {
        type: String,
        required: true
      },

      time: {
        type: String,
        required: true
      },

      place: {
        type: String,
        required: true
      },

      latitude: {
        type: Number,
        required: true
      },

      longitude: {
        type: Number,
        required: true
      },

      timezone: {
        type: String,
        required: true
      },

      utc: {
        type: String,
        required: true
      }
    },

    // =====================================
    // SETTINGS
    // =====================================

    settings: {
      zodiac: {
        type: String,
        default: 'sidereal'
      },

      ayanamsha: {
        type: String,
        default: 'lahiri'
      },

      nodeType: {
        type: String,
        default: 'mean'
      },

      houseSystem: {
        type: String,
        default: 'whole-sign'
      },

      chartStyle: {
        type: String,
        default: 'north-indian'
      }
    },

    // =====================================
    // CALCULATED RESULT
    // =====================================

    result: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  },
  {
    timestamps: true
  }
);

kundliSchema.index({
  user: 1,
  createdAt: -1
});

export default mongoose.model(
  'Kundli',
  kundliSchema
);