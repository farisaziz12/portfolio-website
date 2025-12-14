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
import impactMetricV2 from './impactMetricV2';
import impactPage from './impactPage';
import serviceOffer from './serviceOffer';
import servicePage from './servicePage';
import serviceLandingPage from './serviceLandingPage';
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
  impactMetricV2,
  impactPage,

  // Services
  serviceOffer,
  servicePage,
  serviceLandingPage,

  // Site config
  siteNavigation,
  siteSettings,

  // Pages & profile
  page,
  speakerProfile,
];
