const mongoose = require('mongoose');

const timelineEventSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true
  },
  longDescription: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('TimelineEvent', timelineEventSchema);