const mongoose = require('mongoose');

const skillsSchema = new mongoose.Schema({
  programming: [{ type: String }],
  dataTools: [{ type: String }],
  mlTools: [{ type: String }],
  databases: [{ type: String }],
  web: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Skills', skillsSchema);