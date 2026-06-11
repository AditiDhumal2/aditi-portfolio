const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, default: '' },
  period: { type: String, default: '' },
  type: { type: String, enum: ['Internship', 'Full-time', 'Leadership', 'Volunteer'], default: 'Internship' },
  achievements: [{ type: String }],
  technologies: [{ type: String }],
  link: { type: String, default: '' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Experience', experienceSchema);