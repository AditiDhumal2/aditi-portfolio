const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, enum: ['Academic', 'Competition', 'Professional', 'Leadership', 'Research'], default: 'Academic' },
  date: { type: String, default: '' },
  link: { type: String, default: '' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Achievement', achievementSchema);