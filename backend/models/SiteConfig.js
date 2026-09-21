import mongoose from 'mongoose';
import defaultSiteConfig from '../config/site.js';

const siteConfigSchema = new mongoose.Schema(
  {
    identity: {
      name: { type: String, default: defaultSiteConfig.identity.name },
      tagline: { type: String, default: defaultSiteConfig.identity.tagline },
      description: { type: String, default: defaultSiteConfig.identity.description },
      domain: { type: String, default: defaultSiteConfig.identity.domain },
      contactEmail: { type: String, default: defaultSiteConfig.identity.contactEmail },
      location: { type: String, default: defaultSiteConfig.identity.location },
      resumeUrl: { type: String, default: defaultSiteConfig.identity.resumeUrl }
    },
    socialLinks: {
      github: { type: String, default: defaultSiteConfig.socialLinks.github },
      linkedin: { type: String, default: defaultSiteConfig.socialLinks.linkedin },
      twitter: { type: String, default: defaultSiteConfig.socialLinks.twitter },
      portfolio: { type: String, default: defaultSiteConfig.socialLinks.portfolio }
    },
    fallbackAssets: {
      defaultProjectImage: { type: String, default: defaultSiteConfig.fallbackAssets.defaultProjectImage },
      defaultAvatar: { type: String, default: defaultSiteConfig.fallbackAssets.defaultAvatar }
    },
    defaults: {
      defaultStackTags: { type: [String], default: defaultSiteConfig.defaults.defaultStackTags }
    },
    features: {
      enableContactForm: { type: Boolean, default: defaultSiteConfig.features.enableContactForm },
      enableProjectsAPI: { type: Boolean, default: defaultSiteConfig.features.enableProjectsAPI },
      defaultPageSize: { type: Number, default: defaultSiteConfig.features.defaultPageSize },
      maxPageSize: { type: Number, default: defaultSiteConfig.features.maxPageSize }
    },
    seo: {
      metaTitle: { type: String, default: defaultSiteConfig.seo.metaTitle },
      metaKeywords: { type: String, default: defaultSiteConfig.seo.metaKeywords },
      ogImage: { type: String, default: defaultSiteConfig.seo.ogImage }
    }
  },
  { timestamps: true }
);

// Pre-save hook to enforce Singleton Pattern (prevent creating multiple site config documents)
siteConfigSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await mongoose.models.SiteConfig.countDocuments();
    if (count > 0) {
      const err = new Error('Singleton Violation: Only one SiteConfig document is allowed.');
      return next(err);
    }
  }
  next();
});

/**
 * Static method to fetch the active Singleton document or populate with defaults
 */
siteConfigSchema.statics.getSingleton = async function () {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create(defaultSiteConfig);
  }
  return doc;
};

const SiteConfig = mongoose.model('SiteConfig', siteConfigSchema);

export default SiteConfig;
