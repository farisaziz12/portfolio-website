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

  // Pages & profile
  page,
  speakerProfile,
];
