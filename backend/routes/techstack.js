import express from 'express';
import mongoose from 'mongoose';
import TechStack from '../models/TechStack.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/techstack
// @desc    Get all tech stack items
// @access  Public
router.get('/', async (req, res) => {
  try {
    const techStack = await TechStack.find();
    res.json(techStack);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving tech stack.' });
  }
});

// @route   POST /api/techstack
// @desc    Create a new tech stack item
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name, icon } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required.' });
  }

  try {
    const newItem = new TechStack({ name, icon });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Tech stack item with this name already exists.' });
    }
    res.status(500).json({ message: 'Error saving tech stack item.' });
  }
});

// @route   PUT /api/techstack/:id
// @desc    Update a tech stack item with fallback search & auto-upsert
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { name, icon } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required.' });
  }

  const updateData = { name, icon };

  try {
    let updatedItem = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      updatedItem = await TechStack.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
    }

    if (!updatedItem) {
      updatedItem = await TechStack.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
        updateData,
        { new: true, runValidators: true }
      );
    }

    if (!updatedItem) {
      updatedItem = new TechStack(updateData);
      await updatedItem.save();
    }

    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating tech stack item:', error);
    res.status(500).json({ message: 'Error updating tech stack item.' });
  }
});

// @route   DELETE /api/techstack/:id
// @desc    Delete a tech stack item
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    let deletedItem = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      deletedItem = await TechStack.findByIdAndDelete(id);
    }

    if (!deletedItem) {
      deletedItem = await TechStack.findOneAndDelete({
        name: { $regex: new RegExp(`^${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
      });
    }

    res.json({ message: 'Tech stack item deleted successfully.' });
  } catch (error) {
    console.error('Error deleting tech stack item:', error);
    res.status(500).json({ message: 'Error deleting tech stack item.' });
  }
});

export default router;
