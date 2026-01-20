export type EventType =
  | 'conference'
  | 'workshop'
  | 'meetup'
  | 'podcast'
  | 'webinar'
  | 'panel'
  | 'hosting'
  | 'judging'
  | 'mentoring'
  | 'attending';

export type MediaType = 'photo' | 'video' | 'press' | 'screenshot' | 'podcast';

export type TestimonialContext =
  | 'speaking'
  | 'mentorship'
  | 'consulting'
  | 'collaboration';

export interface Location {
  city: string;
  country: string;
  isOnline?: boolean;
}

export interface SeoFields {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
}

export interface Talk {
  _id: string;
  title: string;
  slug: { current: string };
  abstract?: string;
  audience?: string;
  takeaways?: string[];
  topics?: string[];
  duration?: number;
  assets?: {
    slidesUrl?: string;
    repoUrl?: string;
  };
  seo?: SeoFields;
}

export interface Event {
  _id: string;
  title: string;
  slug: { current: string };
  type: EventType;
  conference: string;
  date: string;
  endDate?: string;
  location: Location;
  description?: string;
  isBookable?: boolean;
  talk?: Talk;
  links?: {
    eventUrl?: string;
    videoUrl?: string;
    slidesUrl?: string;
  };
  featured?: boolean;
}

// Non-bookable event types (activities like MC, judging, etc.)
export const NON_BOOKABLE_EVENT_TYPES: EventType[] = [
  'hosting',
  'judging',
  'mentoring',
  'panel',
  'attending',
];

// Helper to check if an event type is bookable
export function isBookableEventType(type: EventType): boolean {
  return !NON_BOOKABLE_EVENT_TYPES.includes(type);
}

export interface Workshop {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  duration?: string;
  outcomes?: string[];
  agenda?: Array<{ topic: string; duration: string }>;
  prerequisites?: string[];
  technologies?: string[];
  seo?: SeoFields;
}

export interface Project {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  longDescription?: string;
  category?: string;
  role?: string;
  date?: string;
  featured?: boolean;
  technologies?: string[];
  image?: string;
  screenshots?: string[];
  links?: {
    liveUrl?: string;
    githubUrl?: string;
  };
  challenges?: string;
  outcomes?: string;
}

export interface Company {
  _id: string;
  name: string;
  logo?: string;
  industry?: string;
  description?: string;
  role?: string;
  period?: string;
  url?: string;
  highlight?: string;
  order?: number;
}

export interface Media {
  _id: string;
  title?: string;
  type: MediaType;
  image?: string;
  videoUrl?: string;
  date?: string;
  description?: string;
  event?: { _id: string; title: string; slug: { current: string } };
  talk?: { _id: string; title: string; slug: { current: string } };
  credit?: string;
  featured?: boolean;
}

export interface Testimonial {
  _id: string;
  quote: string;
  author: string;
  role?: string;
  company?: string;
  image?: string;
  source?: string;
  context?: TestimonialContext;
  featured?: boolean;
}

export interface ExternalPost {
  _id: string;
  title: string;
  url: string;
  type: 'article' | 'podcast' | 'video' | 'panel' | 'interview';
  publishedAt?: string;
  source?: string;
  excerpt?: string;
  image?: string;
}

export interface SpeakerProfile {
  _id: string;
  tagline?: string;
  bioShort?: string;
  bioMedium?: string;
  bioFull?: string;
  headshots?: Array<{
    url: string;
    style: 'formal' | 'casual' | 'speaking' | 'headshot';
    downloadable: boolean;
  }>;
  topicClusters?: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  formats?: Array<{
    name: string;
    duration: string;
    description: string;
  }>;
  technicalRequirements?: string;
  travelBase?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    email?: string;
  };
}

export interface SpeakingStats {
  totalEvents: number;
  upcomingEvents: number;
  countries: number;
  cities: number;
}
