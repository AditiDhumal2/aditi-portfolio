const mongoose = require('mongoose');

const researchSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, default: 'Conference Paper' },
  status: { type: String, default: 'Submitted' },
  description: { type: String, default: '' },
  abstract: { type: String, default: '' },
  link: { type: String, default: '' },
  paperLink: { type: String, default: '' },
  pdfLink: { type: String, default: '' },
  arxivLink: { type: String, default: '' },
  doi: { type: String, default: '' },
  authors: { type: String, default: '' },
  venue: { type: String, default: '' },
  year: { type: String, default: '' },
  citations: { type: String, default: '' },
  impact: { type: String, default: '' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Research', researchSchema);