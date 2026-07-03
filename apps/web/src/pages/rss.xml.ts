import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { sanityFetch } from '../lib/sanity/client';
import { allEventsQuery, externalPostsQuery, allBlogPostsQuery } from '../lib/sanity/queries';

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

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt: string;
  category?: string;
}

export async function GET(context: APIContext) {
  const [events, posts, blogPosts] = await Promise.all([
    sanityFetch<SanityEvent[]>(allEventsQuery).catch(() => []),
    sanityFetch<ExternalPost[]>(externalPostsQuery).catch(() => []),
    sanityFetch<BlogPost[]>(allBlogPostsQuery).catch(() => []),
  ]);

  // Combine own blog posts, events, and external posts into feed items
  const items = [
    ...blogPosts.map((post) => ({
      title: post.title,
      pubDate: new Date(post.publishedAt),
      description: post.excerpt || post.title,
      link: `${context.site}blog/${post.slug}`,
      categories: post.category ? [post.category] : ['blog'],
    })),
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
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: 'Faris Aziz - Speaking & Content',
    description:
      'Updates on speaking engagements, conference talks, and content from Faris Aziz - Staff Software Engineer and Conference Speaker.',
    site: context.site!,
    items: items.slice(0, 50), // Limit to 50 most recent items
    customData: `<language>en-us</language>`,
  });
}
