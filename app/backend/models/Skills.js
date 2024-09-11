const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  category: String,
  name: String,
  description: String,
  icon: String,
  isCore: Boolean,
  color: String  // Add this line
});

module.exports = mongoose.model('Skill', SkillSchema);
