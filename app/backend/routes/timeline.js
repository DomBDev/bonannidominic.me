const express = require('express');
const router = express.Router();
const TimelineElement = require('../models/TimelineEvent');
const auth = require('../middleware/auth');

// Get all timeline elements
router.get('/', async (req, res) => {
  try {
    const elements = await TimelineElement.find().sort({ order: 1 });
    res.json(elements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new timeline element
router.post('/', auth, async (req, res) => {
  try {
    const lastElement = await TimelineElement.findOne().sort({ order: -1 });
    const newOrder = lastElement ? lastElement.order + 1 : 0;

    const element = new TimelineElement({
      ...req.body,
      order: newOrder
    });

    const newElement = await element.save();
    res.status(201).json(newElement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Reorder timeline elements
router.put('/reorder', auth, async (req, res) => {
  try {
    const { elements } = req.body;

    if (!Array.isArray(elements) || elements.length === 0) {
      return res.status(400).json({ message: 'Invalid elements array' });
    }

    // Use Promise.all for concurrent updates
    await Promise.all(elements.map(async (element, index) => {
      if (!element._id) {
        throw new Error(`Element at index ${index} is missing _id`);
      }
      const updatedElement = await TimelineElement.findByIdAndUpdate(element._id, { order: index }, { new: true });
      if (!updatedElement) {
        throw new Error(`Element with id ${element._id} not found`);
      }
    }));

    res.json({ message: 'Elements reordered successfully' });
  } catch (err) {
    console.error('Reorder error:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update a timeline element
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedElement = await TimelineElement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedElement) {
      return res.status(404).json({ message: 'Timeline element not found' });
    }
    res.json(updatedElement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a timeline element
router.delete('/:id', auth, async (req, res) => {
  try {
    const element = await TimelineElement.findById(req.params.id);
    if (element == null) {
      return res.status(404).json({ message: 'Element not found' });
    }

    await element.deleteOne();
    res.json({ message: 'Element deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Bulk add elements
router.post('/bulk', auth, async (req, res) => {
  try {
    const { elements } = req.body;
    if (!Array.isArray(elements) || elements.length === 0) {
      return res.status(400).json({ message: 'Invalid elements array' });
    }

    // Remove _id from each element to allow MongoDB to generate new IDs
    const elementsWithoutIds = elements.map(({ _id, ...rest }) => rest);

    // Find the highest order value
    const lastElement = await TimelineElement.findOne().sort({ order: -1 });
    let order = lastElement ? lastElement.order + 1 : 0;

    // Add order to each element
    const elementsWithOrder = elementsWithoutIds.map(element => ({
      ...element,
      order: order++
    }));

    const newElements = await TimelineElement.create(elementsWithOrder);
    res.status(201).json(newElements);
  } catch (err) {
    console.error('Bulk add error:', err);
    res.status(400).json({ message: err.message });
  }
});


module.exports = router;