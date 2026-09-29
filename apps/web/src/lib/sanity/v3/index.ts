/**
 * V3 content API. Pages import from here, never write GROQ inline:
 *
 *   import { getUpcomingEvents, getSpeakingStats } from '../lib/sanity/v3';
 *
 * Every loader is failure-tolerant (returns defaults on CMS outage) and
 * reads both V3 and legacy V2 document shapes.
 */
export * from './types';
export * from './dates';
export * from './events';
export * from './talks';
export * from './writing';
export * from './praise';
export * from './site';
export * from './stats';
export { DEFAULT_NOW_LINE, DEFAULT_SERVICES_INTRO } from './defaults';
export * from './home';
