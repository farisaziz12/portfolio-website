import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { sanityFetch } from '../lib/sanity/client';
import { allEventsQuery, externalPostsQuery } from '../lib/sanity/queries';
import { listPublishedPosts } from '../lib/beehiiv/posts';

interface SanityEvent {
  _id: string;
  title: string;
  slug: string;
  type: string;
  conference: string;
  date: string;
  description?: string;
}

interface ExternalPost {
  _id: string;
  title: string;
  url: string;
  type: string;
  publishedAt: string;
  excerpt?: string;
}

export async function GET(context: APIContext) {
  const [events, posts, newsletterIssues] = await Promise.all([
    sanityFetch<SanityEvent[]>(allEventsQuery).catch(() => []),
    sanityFetch<ExternalPost[]>(externalPostsQuery).catch(() => []),
    listPublishedPosts({ limit: 50 }).catch(() => []),
  ]);

  const items = [
    ...events.map((event) => ({
      title: `${event.title} at ${event.conference}`,
      pubDate: new Date(event.date),
      description: event.description || `Speaking at ${event.conference}`,
      link: `${context.site}events/${event.slug}`,
      categories: [event.type],
    })),
    ...posts.map((post) => ({
      title: post.title,
      pubDate: new Date(post.publishedAt),
      description: post.excerpt || post.title,
      link: post.url,
      categories: [post.type],
    })),
    ...newsletterIssues.map((issue) => ({
      title: `Newsletter: ${issue.title}`,
      pubDate: issue.publish_date ? new Date(issue.publish_date * 1000) : new Date(),
      description: issue.subtitle || issue.preview_text || issue.meta_default_description || issue.title,
      link: `${context.site}newsletter/${issue.slug}`,
      categories: ['newsletter'],
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: 'Faris Aziz - Speaking & Content',
    description:
      'Updates on speaking engagements, conference talks, newsletter issues, and content from Faris Aziz - Staff Software Engineer and Conference Speaker.',
    site: context.site!,
    items: items.slice(0, 50),
    customData: `<language>en-us</language>`,
  });
}
