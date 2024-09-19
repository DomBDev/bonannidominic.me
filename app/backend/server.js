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

// API Routes
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

// Serve uploaded files
app.use('/uploads', express.static('/app/uploads'));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log('Production mode: Frontend serving is active');
  } else {
    console.log('Not in production mode: Frontend serving is inactive');
  }
});