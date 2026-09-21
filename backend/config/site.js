import dotenv from 'dotenv';
dotenv.config();

/**
 * Single Source of Truth (SSOT) Centralized Site Configuration
 * Safe fallback defaults populated from environment variables
 */
const defaultSiteConfig = {
  identity: {
    name: process.env.SITE_NAME || 'Dennis Lalwani',
    tagline: process.env.SITE_TAGLINE || 'Full Stack Developer & Systems Engineer',
    description: process.env.SITE_DESCRIPTION || 'Full Stack Developer with production ownership of MERN applications and Node/Express/MongoDB websites.',
    domain: process.env.SITE_DOMAIN || 'https://dennislalwani.dev',
    contactEmail: process.env.CONTACT_EMAIL || 'dennislalwani09@gmail.com',
    location: process.env.SITE_LOCATION || 'Ahmedabad, Gujarat, India',
    resumeUrl: process.env.RESUME_URL || 'https://drive.google.com/file/d/1VjYRJl7DUU6M1De9ktyjiISnoXLtx-OD/preview'
  },
  socialLinks: {
    github: process.env.GITHUB_URL || 'https://github.com/dennis090503/',
    linkedin: process.env.LINKEDIN_URL || 'https://linkedin.com/in/dennis-lalwani-900805266',
    twitter: process.env.TWITTER_URL || 'https://x.com/dennis_lalwani',
    portfolio: process.env.PORTFOLIO_URL || 'https://dennislalwani.dev'
  },
  fallbackAssets: {
    defaultProjectImage: process.env.DEFAULT_PROJECT_IMAGE || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    defaultAvatar: process.env.DEFAULT_AVATAR || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  },
  defaults: {
    defaultStackTags: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript']
  },
  features: {
    enableContactForm: process.env.ENABLE_CONTACT_FORM === 'false' ? false : true,
    enableProjectsAPI: process.env.ENABLE_PROJECTS_API === 'false' ? false : true,
    defaultPageSize: parseInt(process.env.DEFAULT_PAGE_SIZE, 10) || 10,
    maxPageSize: parseInt(process.env.MAX_PAGE_SIZE, 10) || 50
  },
  seo: {
    metaTitle: process.env.SEO_META_TITLE || 'Dennis Lalwani | Full Stack Developer Portfolio',
    metaKeywords: process.env.SEO_META_KEYWORDS || 'MERN Stack, React, Node.js, Express, MongoDB, VPS, Nginx',
    ogImage: process.env.SEO_OG_IMAGE || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80'
  }
};

export default defaultSiteConfig;
