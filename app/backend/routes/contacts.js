const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ message: 'Error submitting contact form' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { sortBy = 'createdAt', sortOrder = 'desc', filter = 'all' } = req.query;
    let query = {};
    if (filter === 'unread') query.read = false;
    if (filter === 'read') query.read = true;

    const messages = await Contact.find(query).sort({ [sortBy]: sortOrder });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

router.get('/unread-count', async (req, res) => {
  try {
    const count = await Contact.countDocuments({ read: false });
    res.json({ count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ message: 'Error fetching unread count' });
  }
});

router.put('/mark-read', async (req, res) => {
  try {
    const { ids } = req.body;
    await Contact.updateMany({ _id: { $in: ids } }, { read: true });
    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ message: 'Error marking messages as read' });
  }
});

router.put('/mark-unread', async (req, res) => {
  try {
    const { ids } = req.body;
    await Contact.updateMany({ _id: { $in: ids } }, { read: false });
    res.json({ message: 'Messages marked as unread' });
  } catch (error) {
    console.error('Error marking messages as unread:', error);
    res.status(500).json({ message: 'Error marking messages as unread' });
  }
});



router.delete('/', async (req, res) => {
  try {
    const { ids } = req.body;
    await Contact.deleteMany({ _id: { $in: ids } });
    res.json({ message: 'Messages deleted successfully' });
  } catch (error) {
    console.error('Error deleting messages:', error);
    res.status(500).json({ message: 'Error deleting messages' });
  }
});

module.exports = router;