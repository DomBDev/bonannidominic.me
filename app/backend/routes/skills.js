const express = require('express');
const router = express.Router();
const Skill = require('../models/Skills');
const auth = require('../middleware/auth');

// Get all skills
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update or create skill(s)
router.post('/', auth, async (req, res) => {
  try {
    let updatedSkills = [];

    if (Array.isArray(req.body)) {
      // If the request body is an array, update or create multiple skills
      for (let skillData of req.body) {
        if (skillData._id) {
          // If _id exists, update the existing skill
          const updatedSkill = await Skill.findByIdAndUpdate(
            skillData._id,
            skillData,
            { new: true, upsert: true }
          );
          updatedSkills.push(updatedSkill);
        } else {
          // If _id doesn't exist, create a new skill
          const newSkill = new Skill(skillData);
          const savedSkill = await newSkill.save();
          updatedSkills.push(savedSkill);
        }
      }
    } else {
      // If it's a single object, update or create one skill
      if (req.body._id) {
        const updatedSkill = await Skill.findByIdAndUpdate(
          req.body._id,
          req.body,
          { new: true, upsert: true }
        );
        updatedSkills.push(updatedSkill);
      } else {
        const skill = new Skill(req.body);
        const savedSkill = await skill.save();
        updatedSkills.push(savedSkill);
      }
    }

    res.status(200).json(updatedSkills);
  } catch (err) {
    console.error('Error saving skills:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete skill(s)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    await Skill.findByIdAndDelete(id);
    res.status(200).json({ message: 'Skill deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete all skills
router.delete('/', auth, async (req, res) => {
  try {
    await Skill.deleteMany({});
    res.status(200).json({ message: 'All skills deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
