const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
process.env.JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

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

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});