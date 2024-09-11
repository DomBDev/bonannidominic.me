const express = require('express');
const router = express.Router();
const TimelineEvent = require('../models/TimelineEvent');
const auth = require('../middleware/auth'); // Assuming you have an auth middleware

// Get all timeline events
router.get('/', async (req, res) => {
  try {
    const events = await TimelineEvent.find().sort({ year: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new timeline event(s)
router.post('/', auth, async (req, res) => {
  try {
    let newEvents;
    if (Array.isArray(req.body)) {
      // If the request body is an array, create multiple events
      newEvents = await TimelineEvent.insertMany(req.body);
    } else {
      // If it's a single object, create one event
      const event = new TimelineEvent(req.body);
      newEvents = [await event.save()];
    }
    res.status(201).json(newEvents);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a timeline event
router.put('/:id', auth, async (req, res) => {
  try {
    const event = await TimelineEvent.findById(req.params.id);
    if (event == null) {
      return res.status(404).json({ message: 'Event not found' });
    }

    Object.assign(event, req.body);

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a timeline event
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await TimelineEvent.findById(req.params.id);
    if (event == null) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.deleteOne();
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;