const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
console.log('Environment variables loaded');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
const projectRoutes = require('./routes/projects');
const userRoutes = require('./routes/users');
const skillRoutes = require('./routes/skills');
const uploadRoutes = require('./routes/upload');
const viewRoutes = require('./routes/views');
const timelineRoutes = require('./routes/timeline');
const contactRoutes = require('./routes/contacts');
const authRoutes = require('./routes/auth');
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/views', viewRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/auth', authRoutes);

// Update the path to serve static files
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Update the frontend build path
const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');
console.log('Frontend build path:', frontendBuildPath);

// Serve static files from the React frontend app
app.use(express.static(frontendBuildPath));

// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  const indexPath = path.join(frontendBuildPath, 'index.html');
  console.log('Attempting to serve:', indexPath);
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Frontend build not found');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log('Production mode: Frontend serving should be active');
  } else {
    console.log('Not in production mode: Frontend serving is inactive');
  }
});