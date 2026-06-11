const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: { type: String, default: '' },
  graduation: { type: String, default: '' },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  education: { type: String, default: '' },
  interests: { type: String, default: '' },
  description: { type: String, default: '' },
  stats: {
    achievements: { type: Number, default: 0 },
    projects: { type: Number, default: 0 },
    certifications: { type: Number, default: 0 },
    researchPapers: { type: Number, default: 0 }
  },
  journey: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);