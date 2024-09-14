const mongoose = require('mongoose');

const timelineElementSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['profile', 'future', 'event', 'current'],
    required: true
  },
  year: {
    type: Number,
    required: function() { return this.type === 'event'; }
  },
  title: {
    type: String,
    required: function() { return this.type === 'event'; }
  },
  icon: {
    type: String,
    required: function() { return this.type === 'event'; }
  },
  shortDescription: {
    type: String,
    required: function() { return this.type === 'event'; }
  },
  longDescription: {
    type: String,
    required: function() { return ['future', 'current'].includes(this.type); }
  },
  order: {
    type: Number,
    required: true
  },
  profile: {
    type: Map,
    of: String,
    required: function() { return this.type === 'profile'; }
  },
  future: {
    type: Map,
    of: String,
    required: function() { return this.type === 'future'; }
  }
}, { timestamps: true });

module.exports = mongoose.model('TimelineElement', timelineElementSchema);