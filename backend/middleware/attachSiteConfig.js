import SiteConfig from '../models/SiteConfig.js';
import defaultSiteConfig from '../config/site.js';

let cachedSiteConfig = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL

/**
 * Manually invalidate the in-memory config cache
 */
export const clearSiteConfigCache = () => {
  cachedSiteConfig = null;
  lastFetchTime = 0;
};

/**
 * Express middleware to attach site configuration to req.siteConfig
 */
export const attachSiteConfig = async (req, res, next) => {
  const now = Date.now();

  if (cachedSiteConfig && now - lastFetchTime < CACHE_TTL_MS) {
    req.siteConfig = cachedSiteConfig;
    return next();
  }

  try {
    const doc = await SiteConfig.getSingleton();
    cachedSiteConfig = doc ? doc.toObject() : defaultSiteConfig;
    lastFetchTime = Date.now();
    req.siteConfig = cachedSiteConfig;
  } catch (error) {
    console.error('Error fetching SiteConfig, falling back to default site config:', error);
    req.siteConfig = defaultSiteConfig;
  }

  next();
};

export default attachSiteConfig;
