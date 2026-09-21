import express from 'express';
import mongoose from 'mongoose';
import Skill from '../models/Skill.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/skills
// @desc    Get all skills
// @access  Public
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving skills.' });
  }
});

// @route   POST /api/skills
// @desc    Create a new skill category
// @access  Private
router.post('/', auth, async (req, res) => {
  const { category, items } = req.body;

  if (!category || !items || !Array.isArray(items)) {
    return res.status(400).json({ message: 'Please enter category and items array.' });
  }

  try {
    const newSkill = new Skill({ category, items });
    await newSkill.save();
    res.status(201).json(newSkill);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Category already exists.' });
    }
    res.status(500).json({ message: 'Error saving skill.' });
  }
});

// @route   PUT /api/skills/:id
// @desc    Update a skill category with fallback search & auto-upsert
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { category, items } = req.body;

  if (!category || !items || !Array.isArray(items)) {
    return res.status(400).json({ message: 'Please enter category and items array.' });
  }

  const updateData = { category, items };

  try {
    let updatedSkill = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      updatedSkill = await Skill.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
    }

    if (!updatedSkill) {
      updatedSkill = await Skill.findOneAndUpdate(
        { category: { $regex: new RegExp(`^${category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
        updateData,
        { new: true, runValidators: true }
      );
    }

    if (!updatedSkill) {
      updatedSkill = new Skill(updateData);
      await updatedSkill.save();
    }

    res.json(updatedSkill);
  } catch (error) {
    console.error('Error updating skill:', error);
    res.status(500).json({ message: 'Error updating skill.' });
  }
});

// @route   DELETE /api/skills/:id
// @desc    Delete a skill category
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    let deletedSkill = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      deletedSkill = await Skill.findByIdAndDelete(id);
    }

    if (!deletedSkill) {
      deletedSkill = await Skill.findOneAndDelete({
        category: { $regex: new RegExp(`^${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
      });
    }

    res.json({ message: 'Skill category deleted successfully.' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ message: 'Error deleting skill.' });
  }
});

export default router;
