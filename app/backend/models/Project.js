const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['image', 'video'],
    required: true
  },
  url: {
    type: String,
    required: true
  }
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  details: { type: String },
  timeline: { type: String },
  skills: { type: [String] },
  learned: { type: String },
  status: { 
    type: String, 
    enum: ['completed', 'wip', 'planned'],
    default: 'planned'
  },
  image: { type: String },
  public: { type: Boolean, default: false },
  media: [mediaSchema],
  github: { type: String },
  live: { type: String },
  featured: { type: Boolean, default: false }
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;