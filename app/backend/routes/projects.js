const express = require('express');
const router = express.Router();
const { Project, CategoryOrder } = require('../models/Project');
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

// Get all unique categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Project.distinct('category');
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: err.message });
  }
});

// Add a new category
router.post('/categories', auth, async (req, res) => {
  try {
    const { category } = req.body;
    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }
    const existingCategory = await Project.findOne({ category });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    // We don't need to create a new project here, just return success
    res.status(201).json({ message: 'Category added successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get category order
router.get('/category-order', async (req, res) => {
  try {
    let categoryOrder = await CategoryOrder.findOne();
    if (!categoryOrder) {
      const categories = await Project.distinct('category');
      categoryOrder = new CategoryOrder({ order: categories });
      await categoryOrder.save();
    }
    res.json(categoryOrder.order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update category order
router.put('/category-order', auth, async (req, res) => {
  try {
    const { order } = req.body;
    let categoryOrder = await CategoryOrder.findOne();
    if (!categoryOrder) {
      categoryOrder = new CategoryOrder({ order });
    } else {
      categoryOrder.order = order;
    }
    await categoryOrder.save();
    res.json(categoryOrder.order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all unique statuses
router.get('/statuses', async (req, res) => {
  try {
    const statuses = await Project.distinct('status');
    res.json(statuses);
  } catch (err) {
    console.error('Error fetching statuses:', err);
    res.status(500).json({ message: err.message });
  }
});

// Add a new status
router.post('/statuses', auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    const existingStatus = await Project.findOne({ status });
    if (existingStatus) {
      return res.status(400).json({ message: 'Status already exists' });
    }
    // We don't need to create a new project here, just return success
    res.status(201).json({ message: 'Status added successfully' });
  } catch (err) {
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
      const imagePath = path.join('/app/uploads', project.image.replace('/uploads/', ''));
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Error deleting project image:', err);
      });
    }

    project.media.forEach(item => {
      if (item.url.startsWith('/uploads/')) {
        const filePath = path.join('/app/uploads', item.url.replace('/uploads/', ''));
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

    // Special handling for public/private toggle
    if (req.body.public !== undefined) {
      project.public = req.body.public;
    }

    // Special handling for image and media if needed
    if (req.body.image && project.image !== req.body.image) {
      // Delete the old image if it's a local file
      if (project.image.startsWith('/uploads/')) {
        const imagePath = path.join('/app/uploads', project.image.replace('/uploads/', ''));
        fs.unlink(imagePath, (err) => {
          if (err) console.error('Error deleting project image:', err);
        });
      }
    }

    if (req.body.media) {
      // Handle media updates logic here
      project.media.forEach(item => {
        if (item.url.startsWith('/uploads/')) {
          const filePath = path.join('/app/uploads', item.url.replace('/uploads/', ''));
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

module.exports = router;