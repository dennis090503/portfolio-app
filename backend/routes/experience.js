import express from 'express';
import mongoose from 'mongoose';
import Experience from '../models/Experience.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/experiences
// @desc    Get all experiences sorted by order (ascending)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ order: 1 });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving experiences.' });
  }
});

// @route   POST /api/experiences
// @desc    Create a new experience
// @access  Private
router.post('/', auth, async (req, res) => {
  const { company, role, period, points, order } = req.body;

  if (!company || !role || !period || !points || !Array.isArray(points)) {
    return res.status(400).json({ message: 'Please enter company, role, period, and points array.' });
  }

  try {
    const newExperience = new Experience({ company, role, period, points, order });
    await newExperience.save();
    res.status(201).json(newExperience);
  } catch (error) {
    res.status(500).json({ message: 'Error saving experience.' });
  }
});

// @route   PUT /api/experiences/:id
// @desc    Update an experience with fallback search & auto-upsert
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { company, role, period, points, order } = req.body;

  if (!company || !role || !period || !points || !Array.isArray(points)) {
    return res.status(400).json({ message: 'Please enter company, role, period, and points array.' });
  }

  const updateData = { company, role, period, points, order };

  try {
    let updatedExperience = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      updatedExperience = await Experience.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
    }

    if (!updatedExperience) {
      updatedExperience = await Experience.findOneAndUpdate(
        { company: { $regex: new RegExp(`^${company.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
        updateData,
        { new: true, runValidators: true }
      );
    }

    if (!updatedExperience) {
      updatedExperience = new Experience(updateData);
      await updatedExperience.save();
    }

    res.json(updatedExperience);
  } catch (error) {
    console.error('Error updating experience:', error);
    res.status(500).json({ message: 'Error updating experience.' });
  }
});

// @route   DELETE /api/experiences/:id
// @desc    Delete an experience
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    let deletedExperience = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      deletedExperience = await Experience.findByIdAndDelete(id);
    }

    if (!deletedExperience) {
      deletedExperience = await Experience.findOneAndDelete({
        company: { $regex: new RegExp(`^${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
      });
    }

    res.json({ message: 'Experience deleted successfully.' });
  } catch (error) {
    console.error('Error deleting experience:', error);
    res.status(500).json({ message: 'Error deleting experience.' });
  }
});

export default router;
