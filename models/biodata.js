const mongoose = require('mongoose');

const biodataSchema = new mongoose.Schema({
  name: String,
  age: Number,
  bio: String
});

module.exports = mongoose.model('Biodata', biodataSchema);