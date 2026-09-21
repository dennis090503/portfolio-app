import express from 'express';
import mongoose from 'mongoose';
import Project from '../models/Project.js';
import auth from '../middleware/auth.js';
import defaultSiteConfig from '../config/site.js';

const router = express.Router();

/**
 * Helper to process stack tags into an array with central config fallback
 */
const formatStack = (stack, defaultStack = []) => {
  if (Array.isArray(stack) && stack.length > 0) return stack;
  if (typeof stack === 'string' && stack.trim().length > 0) {
    return stack.split(',').map((s) => s.trim());
  }
  return defaultStack;
};

// @route   GET /api/projects
// @desc    Get all projects (sorted by newest first)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Error retrieving projects.' });
  }
});

// @route   GET /api/projects/:id
// @desc    Get a single project by ID
// @access  Public
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    let project = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      project = await Project.findById(id);
    }

    if (!project) {
      project = await Project.findOne({
        title: { $regex: new RegExp(`^${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
      });
    }

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Error retrieving project.' });
  }
});

// @route   POST /api/projects
// @desc    Create a new project referencing central site config defaults
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, description, image, github, demo, stack } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required.' });
  }

  const fallbackAssets = req.siteConfig?.fallbackAssets || defaultSiteConfig.fallbackAssets;
  const defaultStackTags = req.siteConfig?.defaults?.defaultStackTags || defaultSiteConfig.defaults.defaultStackTags;
  const defaultGithub = req.siteConfig?.socialLinks?.github || defaultSiteConfig.socialLinks.github;

  try {
    const newProject = new Project({
      title,
      description,
      image: image || fallbackAssets.defaultProjectImage,
      github: github || defaultGithub,
      demo: demo || '#',
      stack: formatStack(stack, defaultStackTags)
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Error saving project.' });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update a project with fallback search & auto-upsert
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { title, description, image, github, demo, stack } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required.' });
  }

  const fallbackAssets = req.siteConfig?.fallbackAssets || defaultSiteConfig.fallbackAssets;
  const defaultStackTags = req.siteConfig?.defaults?.defaultStackTags || defaultSiteConfig.defaults.defaultStackTags;
  const defaultGithub = req.siteConfig?.socialLinks?.github || defaultSiteConfig.socialLinks.github;

  const updateData = {
    title,
    description,
    image: image || fallbackAssets.defaultProjectImage,
    github: github || defaultGithub,
    demo: demo || '#',
    stack: formatStack(stack, defaultStackTags)
  };

  try {
    let updatedProject = null;

    // 1. Try finding by MongoDB ObjectId if valid
    if (mongoose.Types.ObjectId.isValid(id)) {
      updatedProject = await Project.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
    }

    // 2. Fallback: Search by title if _id lookup produced no document
    if (!updatedProject) {
      updatedProject = await Project.findOneAndUpdate(
        { title: { $regex: new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
        updateData,
        { new: true, runValidators: true }
      );
    }

    // 3. Upsert fallback: create a new record if missing entirely
    if (!updatedProject) {
      updatedProject = new Project(updateData);
      await updatedProject.save();
    }

    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Error updating project.' });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete a project with fallback search
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    let deletedProject = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      deletedProject = await Project.findByIdAndDelete(id);
    }

    if (!deletedProject) {
      deletedProject = await Project.findOneAndDelete({
        title: { $regex: new RegExp(`^${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
      });
    }

    res.json({ message: 'Project deleted successfully.' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Error deleting project.' });
  }
});

export default router;