import mongoose from 'mongoose';

const kundliSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    birth: {
      date: { type: String, required: true },
      time: { type: String, required: true },
      place: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      timezone: { type: String, required: true },
      utc: { type: String, required: true }
    },
    settings: {
      zodiac: { type: String, default: 'sidereal' },
      ayanamsha: { type: String, default: 'lahiri' },
      nodeType: { type: String, default: 'mean' },
      houseSystem: { type: String, default: 'whole-sign' },
      chartStyle: { type: String, default: 'north-indian' }
    },
    result: { type: mongoose.Schema.Types.Mixed, required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Kundli', kundliSchema);
