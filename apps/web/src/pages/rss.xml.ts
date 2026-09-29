import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { TOPIC_SHORT } from 'shared';
import { getWriting } from '../lib/sanity/v3';

/** Writing feed: posts on this site, plus articles, podcasts and video elsewhere (as links). */
export async function GET(context: APIContext) {
  const site = context.site ?? new URL('https://faziz-dev.com');
  const items = await getWriting();

  return rss({
    title: 'Faris Aziz: writing & conversations',
    description: 'Posts on faziz-dev.com, plus guest articles, podcasts and video by Faris Aziz.',
    site,
    items: items.slice(0, 50).map((i) => ({
      title: i.isInternal ? i.title : `${i.title} (${i.source})`,
      pubDate: new Date(i.date),
      description: i.excerpt || i.title,
      link: i.isInternal ? new URL(i.href, site).href : i.href,
      categories: [i.format === 'article' ? 'written' : i.format, ...(i.topic ? [TOPIC_SHORT[i.topic]] : [])],
    })),
    customData: '<language>en</language>',
  });
}
