import talk from './talk';
import event from './event';
import workshop from './workshop';
import project from './project';
import media from './media';
import testimonial from './testimonial';
import socialPost from './socialPost';
import company from './company';
import externalPost from './externalPost';
import page from './page';
import speakerProfile from './speakerProfile';
import impactCategory from './impactCategory';
import impactMetric from './impactMetric';
import serviceOffer from './serviceOffer';
import servicePage from './servicePage';
import siteNavigation from './siteNavigation';
import siteSettings from './siteSettings';

export const schemaTypes = [
  // Core speaking content
  talk,
  event,
  workshop,

  // Portfolio
  project,
  company,

  // Media & social proof
  media,
  testimonial,
  socialPost,
  externalPost,

  // Impact metrics
  impactCategory,
  impactMetric,

  // Services
  serviceOffer,
  servicePage,

  // Site config
  siteNavigation,
  siteSettings,

  // Pages & profile
  page,
  speakerProfile,
];
