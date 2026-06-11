const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  problem: { type: String, default: '' },
  dataset: { type: String, default: '' },
  methodology: { type: String, default: '' },
  tools: { type: String, default: '' },
  results: { type: String, default: '' },
  impact: { type: String, default: '' },
  image: { type: String, default: '' },
  githubLink: { type: String, default: '' },
  deployedLink: { type: String, default: '' },
  paperLink: { type: String, default: '' },
  codeLink: { type: String, default: '' },
  challenges: { type: String, default: '' },
  futureWork: { type: String, default: '' },
  featured: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);