import express from 'express';
import mongoose from 'mongoose';
import Certification from '../models/Certification.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/certifications
// @desc    Get all certifications
// @access  Public
router.get('/', async (req, res) => {
  try {
    const certifications = await Certification.find();
    res.json(certifications);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving certifications.' });
  }
});

// @route   POST /api/certifications
// @desc    Create a new certification
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, name, issuer, url } = req.body;
  const finalTitle = title || name;

  if (!finalTitle) {
    return res.status(400).json({ message: 'Certification title/name is required.' });
  }

  try {
    const newCertification = new Certification({
      title: finalTitle,
      issuer,
      url
    });
    await newCertification.save();
    res.status(201).json(newCertification);
  } catch (error) {
    res.status(500).json({ message: 'Error saving certification.' });
  }
});

// @route   PUT /api/certifications/:id
// @desc    Update a certification with fallback search & auto-upsert
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { title, name, issuer, url } = req.body;
  const finalTitle = title || name;

  if (!finalTitle) {
    return res.status(400).json({ message: 'Certification title/name is required.' });
  }

  const updateData = { title: finalTitle, issuer, url };

  try {
    let updatedCertification = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      updatedCertification = await Certification.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
    }

    if (!updatedCertification) {
      updatedCertification = await Certification.findOneAndUpdate(
        { title: { $regex: new RegExp(`^${finalTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
        updateData,
        { new: true, runValidators: true }
      );
    }

    if (!updatedCertification) {
      updatedCertification = new Certification(updateData);
      await updatedCertification.save();
    }

    res.json(updatedCertification);
  } catch (error) {
    console.error('Error updating certification:', error);
    res.status(500).json({ message: 'Error updating certification.' });
  }
});

// @route   DELETE /api/certifications/:id
// @desc    Delete a certification
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    let deletedCertification = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      deletedCertification = await Certification.findByIdAndDelete(id);
    }

    if (!deletedCertification) {
      deletedCertification = await Certification.findOneAndDelete({
        title: { $regex: new RegExp(`^${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
      });
    }

    res.json({ message: 'Certification deleted successfully.' });
  } catch (error) {
    console.error('Error deleting certification:', error);
    res.status(500).json({ message: 'Error deleting certification.' });
  }
});

export default router;
