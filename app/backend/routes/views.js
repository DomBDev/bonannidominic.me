const express = require('express');
const router = express.Router();
const View = require('../models/Views');

// Record a view
router.post('/', async (req, res) => {
  const { projectId, sessionId } = req.body;


  if (!sessionId) {
    return res.status(400).json({ error: 'sessionId is required' });
  }

  try {
    const newView = new View({ 
      projectId: projectId || null, 
      sessionId 
    });
    const savedView = await newView.save();
    res.status(201).json(savedView);
  } catch (error) {
    console.error('Error recording view:', error);
    res.status(500).json({ error: 'Failed to record view' });
  }
});

// Get views
router.get('/', async (req, res) => {
  const { projectId } = req.query;
  try {
    const filter = projectId ? { projectId } : { projectId: null };
    const views = await View.find(filter);
    res.json({ views });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching views' });
  }
});

// Get total views
router.get('/total', async (req, res) => {
  const { projectId } = req.query;
  try {
    const filter = projectId ? { projectId } : { projectId: null };
    const totalViews = await View.countDocuments(filter);
    res.json({ totalViews });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching total views' });
  }
});

// Get view count by project
router.get('/project/:projectId', async (req, res) => {
  const { projectId } = req.params;
  try {
    const viewCount = await View.countDocuments({ projectId });
    res.json({ projectViews: viewCount });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching view count by project' });
  }
});

module.exports = router;
