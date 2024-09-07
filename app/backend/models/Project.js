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
  details: { type: String, required: true },
  timeline: { type: String, required: true },
  skills: { type: [String], required: true },
  learned: { type: String, required: true },
  status: { type: String, enum: ['completed', 'wip', 'planned'], required: true },
  image: { type: String, required: true },
  public: { type: Boolean, required: true },
  media: [mediaSchema]
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;