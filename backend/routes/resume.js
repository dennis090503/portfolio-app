import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import auth from '../middleware/auth.js';
import SiteConfig from '../models/SiteConfig.js';
import { clearSiteConfigCache } from '../middleware/attachSiteConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.pdf';
    cb(null, `resume-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF documents are allowed!'));
    }
  }
});

const router = express.Router();

// @route   GET /api/resume
// @desc    Fetch active resume URL
// @access  Public
router.get('/', async (req, res) => {
  try {
    const configDoc = await SiteConfig.getSingleton();
    const resumeUrl = configDoc.identity?.resumeUrl || '/uploads/resume.pdf';
    res.json({ success: true, resumeUrl });
  } catch (error) {
    console.error('Error fetching resume URL:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve resume URL.' });
  }
});

// @route   POST /api/resume/upload
// @desc    Upload or replace resume PDF
// @access  Private (Authenticated)
router.post('/upload', auth, (req, res) => {
  upload.single('resume')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select a PDF file to upload.' });
    }

    try {
      const relativeUrl = `/uploads/${req.file.filename}`;
      const configDoc = await SiteConfig.getSingleton();
      
      configDoc.identity.resumeUrl = relativeUrl;
      await configDoc.save();
      clearSiteConfigCache();

      console.log('Resume updated successfully:', relativeUrl);

      return res.json({
        success: true,
        message: 'Resume uploaded and replaced successfully!',
        resumeUrl: relativeUrl
      });
    } catch (error) {
      console.error('Error updating resume in database:', error);
      return res.status(500).json({ success: false, message: 'Failed to update resume record in database.' });
    }
  });
});

export default router;
