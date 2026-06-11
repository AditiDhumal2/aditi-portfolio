const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
  instagram: { type: String, default: '' },
  email: { type: String, default: '' },
  resume: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);