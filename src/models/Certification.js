const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  link: { type: String, default: '' },
  date: { type: String, default: '' },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  skills: [{ type: String }],
  credentialId: { type: String, default: '' },
  validity: { type: String, default: '' },
  grade: { type: String, default: '' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Certification', certificationSchema);