/**
 * Content Migration Script
 *
 * Migrates content from .migration-data JSON files to Sanity CMS.
 *
 * Usage:
 *   pnpm migrate
 *
 * Environment variables required:
 *   SANITY_PROJECT_ID - Your Sanity project ID
 *   SANITY_DATASET - Your Sanity dataset (e.g., "production")
 *   SANITY_API_TOKEN - API token with write access
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { join } from 'path';

// Types
interface RawEvent {
  title: string;
  type: string;
  conference: string;
  location: string;
  date: string;
  description: string;
  slidesUrl: string | null;
  videoUrl: string | null;
  eventUrl: string | null;
}

interface RawProject {
  id: number;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  technologies: string[];
  category: string;
  imageUrl: string;
  screenshots: string[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  date: string;
  role: string;
  challenges: string;
  outcomes: string;
}

interface RawCompany {
  id: number | string;
  name: string;
  logoUrl: string;
  industry: string;
  description: string;
  period: string;
  role: string;
  url: string;
  highlight: string;
}

// Parse location string like "London, United Kingdom" into { city, country }
function parseLocation(locationStr: string): { city: string; country: string } {
  if (locationStr === 'Online') {
    return { city: 'Online', country: 'Online' };
  }

  const parts = locationStr.split(', ');
  if (parts.length === 2) {
    return { city: parts[0], country: parts[1] };
  } else if (parts.length === 1) {
    return { city: parts[0], country: parts[0] };
  }

  return { city: locationStr, country: locationStr };
}

// Create URL-friendly slug from string
function createSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Event types that are NOT bookable (one-time activities, not repeatable talks)
const NON_BOOKABLE_TYPES = ['Hosting', 'Judging', 'Mentoring', 'Panel'];

// Map event type to Sanity schema type
function mapEventType(
  type: string
): 'conference' | 'workshop' | 'meetup' | 'podcast' | 'webinar' | 'panel' | 'hosting' | 'judging' | 'mentoring' {
  const typeMap: Record<string, any> = {
    Conference: 'conference',
    Workshop: 'workshop',
    Meetup: 'meetup',
    Podcast: 'podcast',
    Webinar: 'webinar',
    Panel: 'panel',
    Hosting: 'hosting',
    Judging: 'judging',
    Mentoring: 'mentoring',
  };
  return typeMap[type] || 'conference';
}

// Check if an event type represents a bookable talk/workshop
function isBookableEventType(type: string): boolean {
  return !NON_BOOKABLE_TYPES.includes(type);
}

async function migrate() {
  // Initialize Sanity client
  // Support both naming conventions
  const projectId = '94fb4yui';
  const dataset =  'production';
  const token = 'sk1L8YpGpYT1ISB43oT8ByFclyiFTwYxYig4JYby6iMYqpnrTvifxYqcqdv71vhRjIUM8N3VKaZnBP67YOxwDFBMqySvtpzBQ9Rk4Dhx4fiNKqjQsOYFGboNMC1yzisLPr14s9sArC6ePkcfXvnmv4viuyfToss3mP2efbG0Wc914L4x705A';

  if (!projectId || !token) {
    console.error('Missing required environment variables:');
    console.error('  SANITY_PROJECT_ID - Your Sanity project ID');
    console.error('  SANITY_API_TOKEN - API token with write access');
    console.error('\nCreate these in your Sanity project settings at sanity.io/manage');
    process.exit(1);
  }

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: '2024-01-01',
    useCdn: false,
  });

  console.log('Starting content migration...\n');

  // Read migration data
  const dataDir = join(process.cwd(), '.migration-data');

  const events: RawEvent[] = JSON.parse(readFileSync(join(dataDir, 'events.json'), 'utf-8'));
  const projects: RawProject[] = JSON.parse(readFileSync(join(dataDir, 'projects.json'), 'utf-8'));
  const companies: RawCompany[] = JSON.parse(readFileSync(join(dataDir, 'companies.json'), 'utf-8'));

  console.log(`Found ${events.length} events, ${projects.length} projects, ${companies.length} companies\n`);

  // Extract unique talks from events
  const talkTitles = new Set<string>();
  const talks: Array<{ title: string; abstract: string; slug: string }> = [];

  events.forEach((event) => {
    // Skip non-bookable event types - they're activities, not talks
    if (!isBookableEventType(event.type)) {
      return;
    }

    // Use title as talk identifier
    const talkTitle = event.title;
    if (!talkTitles.has(talkTitle)) {
      talkTitles.add(talkTitle);
      talks.push({
        title: talkTitle,
        abstract: event.description,
        slug: createSlug(talkTitle),
      });
    }
  });

  console.log(`Extracted ${talks.length} unique talks from events\n`);

  // Create talks in Sanity
  console.log('Creating talks...');
  const talkIdMap = new Map<string, string>();

  for (const talk of talks) {
    try {
      const doc = await client.create({
        _type: 'talk',
        title: talk.title,
        slug: { _type: 'slug', current: talk.slug },
        abstract: talk.abstract,
        topics: [], // Can be filled in later via Studio
      });
      talkIdMap.set(talk.title, doc._id);
      console.log(`  ✓ Created talk: ${talk.title}`);
    } catch (error: any) {
      console.error(`  ✗ Failed to create talk: ${talk.title}`, error.message);
    }
  }

  // Create events in Sanity
  console.log('\nCreating events...');
  let eventsCreated = 0;

  for (const event of events) {
    try {
      const location = parseLocation(event.location);
      const isBookable = isBookableEventType(event.type);
      const talkId = isBookable ? talkIdMap.get(event.title) : undefined;

      const eventDoc: any = {
        _type: 'event',
        title: event.title,
        slug: { _type: 'slug', current: `${createSlug(event.conference)}-${event.date}` },
        type: mapEventType(event.type),
        conference: event.conference,
        date: event.date,
        location: {
          city: location.city,
          country: location.country,
        },
        description: event.description,
        isBookable,
        links: {
          eventUrl: event.eventUrl || undefined,
          videoUrl: event.videoUrl || undefined,
          slidesUrl: event.slidesUrl || undefined,
        },
        featured: false,
      };

      // Link to talk if it exists and event is bookable
      if (talkId) {
        eventDoc.talk = { _type: 'reference', _ref: talkId };
      }

      await client.create(eventDoc);
      eventsCreated++;

      if (eventsCreated % 10 === 0) {
        console.log(`  ✓ Created ${eventsCreated} events...`);
      }
    } catch (error: any) {
      console.error(`  ✗ Failed to create event: ${event.title}`, error.message);
    }
  }
  console.log(`  ✓ Created ${eventsCreated} events total`);

  // Create projects in Sanity
  console.log('\nCreating projects...');

  for (const project of projects) {
    try {
      await client.create({
        _type: 'project',
        title: project.title,
        slug: { _type: 'slug', current: project.slug },
        description: project.description,
        longDescription: project.longDescription,
        category: project.category,
        technologies: project.technologies,
        role: project.role,
        outcomes: project.outcomes ? [project.outcomes] : [],
        links: {
          live: project.liveUrl || undefined,
          github: project.githubUrl || undefined,
        },
        featured: project.featured,
        date: project.date,
      });
      console.log(`  ✓ Created project: ${project.title}`);
    } catch (error: any) {
      console.error(`  ✗ Failed to create project: ${project.title}`, error.message);
    }
  }

  // Create companies in Sanity
  console.log('\nCreating companies...');

  for (let i = 0; i < companies.length; i++) {
    const company = companies[i];
    try {
      await client.create({
        _type: 'company',
        name: company.name,
        industry: company.industry,
        description: company.description,
        role: company.role,
        period: company.period,
        url: company.url,
        highlight: company.highlight,
        order: i + 1, // Preserve order
      });
      console.log(`  ✓ Created company: ${company.name}`);
    } catch (error: any) {
      console.error(`  ✗ Failed to create company: ${company.name}`, error.message);
    }
  }

  // Create initial speaker profile
  console.log('\nCreating speaker profile...');

  try {
    await client.create({
      _type: 'speakerProfile',
      tagline: 'Engaging talks on React, payments, and engineering excellence',
      bioShort:
        'Faris Aziz is a Staff Software Engineer and conference speaker specializing in React, Next.js, and payment systems. Based in Zurich, Switzerland.',
      bioMedium:
        'Faris Aziz is a Staff Software Engineer and international conference speaker based in Zurich, Switzerland. With expertise in React, Next.js, and payment systems, he brings real-world fintech experience to the stage. As the founder of ZurichJS, he is passionate about building developer communities and sharing knowledge through engaging talks and hands-on workshops.',
      topicClusters: [
        {
          _key: 'react',
          title: 'React & Next.js',
          description:
            'Performance optimization, architectural patterns, data fetching strategies, and production-ready development.',
          icon: '⚙',
        },
        {
          _key: 'payments',
          title: 'Payments & Monetization',
          description: 'Payment orchestration, multi-gateway integrations, Stripe, and scaling fintech systems globally.',
          icon: '💳',
        },
        {
          _key: 'dx',
          title: 'Developer Experience',
          description: 'Tooling, productivity, debugging strategies, and building great developer workflows.',
          icon: '🛠',
        },
        {
          _key: 'career',
          title: 'Career & Community',
          description: 'Growing as a developer, tech talks, public speaking skills, and community building.',
          icon: '👥',
        },
      ],
      formats: [
        { _key: 'keynote', name: 'Keynote', duration: '30-45 min', description: 'Inspirational, high-level talks' },
        { _key: 'conference', name: 'Conference Talk', duration: '20-40 min', description: 'Technical deep-dives' },
        { _key: 'workshop', name: 'Workshop', duration: '2-8 hours', description: 'Hands-on, interactive sessions' },
        { _key: 'panel', name: 'Panel Discussion', duration: 'Variable', description: 'Moderated Q&A sessions' },
        { _key: 'meetup', name: 'Meetup Talk', duration: '15-30 min', description: 'Informal, community-focused' },
        { _key: 'podcast', name: 'Podcast/Interview', duration: 'Variable', description: 'Conversation format' },
      ],
      travelBase: 'Zurich, Switzerland',
      socialLinks: {
        twitter: 'https://twitter.com/FarisAziz12',
        linkedin: 'https://linkedin.com/in/farisaziz12',
        github: 'https://github.com/farisaziz12',
        email: 'hello@faziz-dev.com',
      },
    });
    console.log('  ✓ Created speaker profile');
  } catch (error: any) {
    console.error('  ✗ Failed to create speaker profile:', error.message);
  }

  console.log('\n✅ Migration complete!');
  console.log('\nNext steps:');
  console.log('  1. Review content in Sanity Studio: pnpm studio');
  console.log('  2. Upload images via Sanity Studio (logos, headshots, etc.)');
  console.log('  3. Add testimonials via Sanity Studio');
  console.log('  4. Mark featured events in Sanity Studio');
}

migrate()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
