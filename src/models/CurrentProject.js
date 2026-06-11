const mongoose = require('mongoose');

const currentProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  progress: { type: String, default: '0%' },
  features: [{ type: String }],
  technologies: [{ type: String }],
  timeline: { type: String, default: '' },
  githubLink: { type: String, default: '' },
  demoLink: { type: String, default: '' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('CurrentProject', currentProjectSchema);