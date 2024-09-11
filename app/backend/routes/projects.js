const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new projects (single or multiple)
router.post('/', auth, async (req, res) => {
  try {
    let projects = [];
    const projectsToCreate = Array.isArray(req.body) ? req.body : [req.body];

    for (const projectData of projectsToCreate) {
      // Check if an identical project already exists
      const existingProject = await Project.findOne({
        title: projectData.title,
        description: projectData.description,
        // Add other fields you want to check for duplicates
      });

      if (existingProject) {
        // Skip this project if it's a duplicate
        continue;
      }

      // If no identical project exists, create the new project
      const newProject = await Project.create(projectData);
      projects.push(newProject);
    }

    if (projects.length === 0) {
      return res.status(400).json({ message: 'All projects already exist or invalid data provided' });
    }

    res.status(201).json(projects);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all unique skills from projects
router.get('/skills', async (req, res) => {
  try {
    const projects = await Project.find({}, 'skills');
    const allSkills = projects.flatMap(project => project.skills);
    const uniqueSkills = [...new Set(allSkills)];
    res.json(uniqueSkills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a project
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Handle partial updates
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        project[key] = req.body[key];
      }
    });

    // Special handling for image and media if needed
    if (req.body.image && project.image !== req.body.image) {
      // Delete the old image if it's a local file
      if (project.image.startsWith('/uploads/')) {
        const imagePath = path.join(__dirname, '..', 'public', project.image);
        fs.unlink(imagePath, (err) => {
          if (err) console.error('Error deleting project image:', err);
        });
      }
    }

    if (req.body.media) {
      // Handle media updates logic here
      project.media.forEach(item => {
        if (item.url.startsWith('/uploads/')) {
          const filePath = path.join(__dirname, '..', 'public', item.url);
          fs.unlink(filePath, (err) => {
            if (err) console.error('Error deleting media file:', err);
          });
        }
      });
    }

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete a project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete associated image and media files
    if (project.image && project.image.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '..', 'public', project.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Error deleting project image:', err);
      });
    }

    project.media.forEach(item => {
      if (item.url.startsWith('/uploads/')) {
        const filePath = path.join(__dirname, '..', 'public', item.url);
        fs.unlink(filePath, (err) => {
          if (err) console.error('Error deleting media file:', err);
        });
      }
    });

    // Use deleteOne instead of findByIdAndDelete for more explicit error handling
    const result = await Project.deleteOne({ _id: req.params.id });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Project not found or already deleted' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ message: 'Error deleting project', error: err.message });
  }
});

module.exports = router;