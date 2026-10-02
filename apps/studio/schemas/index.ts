import { withVoiceCheck } from './_fields';

// ─── Speaking ───────────────────────────────────────────────
import talk from './talk';
import workshop from './workshop';
import eventSeries from './eventSeries';
import event from './event';
import workshopInstance from './workshopInstance';

// ─── Proof ──────────────────────────────────────────────────
import praise from './praise';
import metric from './metric';
import community from './community';
import company from './company';
import project from './project';
import media from './media';

// ─── Writing ────────────────────────────────────────────────
import blogPost from './blogPost';
import externalPost from './externalPost';

// ─── Services ───────────────────────────────────────────────
import serviceOffer from './serviceOffer';
import serviceLandingPage from './serviceLandingPage';

// ─── Singletons & pages ─────────────────────────────────────
import homePage from './homePage';
import speakerProfile from './speakerProfile';
import availability from './availability';
import siteSettings from './siteSettings';
import page from './page';

// ─── Legacy V2 (read-only fallbacks until migrated, see docs/sanity-mcp-prompts.md)
import socialPost from './legacy/socialPost';
import testimonial from './legacy/testimonial';
import impactMetric from './legacy/impactMetric';
import impactMetricV2 from './legacy/impactMetricV2';
import impactCategory from './legacy/impactCategory';
import impactPage from './legacy/impactPage';
import servicePage from './legacy/servicePage';
import siteNavigation from './legacy/siteNavigation';

export const SINGLETON_TYPES = ['homePage', 'speakerProfile', 'availability', 'siteSettings'] as const;

export const LEGACY_TYPES = [
  'socialPost',
  'testimonial',
  'impactMetric',
  'impactMetricV2',
  'impactCategory',
  'impactPage',
  'servicePage',
  'siteNavigation',
] as const;

/** Types whose prose gets the voice warning (praise quotes stay verbatim). */
export const schemaTypes = [
  withVoiceCheck(talk),
  withVoiceCheck(workshop),
  withVoiceCheck(eventSeries),
  withVoiceCheck(event),
  workshopInstance,

  praise,
  withVoiceCheck(metric),
  withVoiceCheck(community),
  withVoiceCheck(company),
  withVoiceCheck(project),
  media,

  withVoiceCheck(blogPost),
  withVoiceCheck(externalPost),

  withVoiceCheck(serviceOffer),
  withVoiceCheck(serviceLandingPage),

  withVoiceCheck(homePage),
  withVoiceCheck(speakerProfile),
  withVoiceCheck(availability),
  withVoiceCheck(siteSettings),
  withVoiceCheck(page),

  socialPost,
  testimonial,
  impactMetric,
  impactMetricV2,
  impactCategory,
  impactPage,
  servicePage,
  siteNavigation,
];
