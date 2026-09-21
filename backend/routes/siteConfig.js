import express from 'express';
import SiteConfig from '../models/SiteConfig.js';
import auth from '../middleware/auth.js';
import { clearSiteConfigCache } from '../middleware/attachSiteConfig.js';

const router = express.Router();

/**
 * Helper to validate URL strings safely
 */
const isValidUrl = (urlStr) => {
  if (!urlStr || urlStr === '#') return true;
  try {
    new URL(urlStr);
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * Helper to validate email addresses safely
 */
const isValidEmail = (emailStr) => {
  if (!emailStr) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(emailStr);
};

// @route   GET /api/config
// @desc    Fetch active site metadata & config
// @access  Public
router.get('/', async (req, res) => {
  try {
    if (req.siteConfig) {
      return res.json(req.siteConfig);
    }
    const configDoc = await SiteConfig.getSingleton();
    res.json(configDoc);
  } catch (error) {
    console.error('Error fetching site configuration:', error);
    res.status(500).json({ message: 'Error retrieving site configuration.' });
  }
});

// @route   PUT /api/config
// @desc    Update dynamic site configuration
// @access  Private (Authenticated)
router.put('/', auth, async (req, res) => {
  try {
    const { identity, socialLinks, fallbackAssets, defaults, features, seo } = req.body;

    // Strict input validations
    if (identity?.contactEmail && !isValidEmail(identity.contactEmail)) {
      return res.status(400).json({ message: 'Invalid contact email address format.' });
    }

    if (identity?.domain && !isValidUrl(identity.domain)) {
      return res.status(400).json({ message: 'Invalid domain URL format.' });
    }

    if (socialLinks) {
      for (const [platform, link] of Object.entries(socialLinks)) {
        if (link && !isValidUrl(link)) {
          return res.status(400).json({ message: `Invalid URL format for ${platform} link.` });
        }
      }
    }

    let configDoc = await SiteConfig.getSingleton();

    if (identity) {
      configDoc.identity = { ...configDoc.identity.toObject(), ...identity };
    }
    if (socialLinks) {
      configDoc.socialLinks = { ...configDoc.socialLinks.toObject(), ...socialLinks };
    }
    if (fallbackAssets) {
      configDoc.fallbackAssets = { ...configDoc.fallbackAssets.toObject(), ...fallbackAssets };
    }
    if (defaults) {
      if (defaults.defaultStackTags && Array.isArray(defaults.defaultStackTags)) {
        configDoc.defaults.defaultStackTags = defaults.defaultStackTags;
      }
    }
    if (features) {
      configDoc.features = { ...configDoc.features.toObject(), ...features };
    }
    if (seo) {
      configDoc.seo = { ...configDoc.seo.toObject(), ...seo };
    }

    await configDoc.save();

    // Clear memory cache so all middleware references get immediate fresh data
    clearSiteConfigCache();

    res.json({
      message: 'Site configuration updated successfully.',
      config: configDoc
    });
  } catch (error) {
    console.error('Error updating site configuration:', error);
    res.status(500).json({ message: 'Failed to update site configuration.' });
  }
});

export default router;
