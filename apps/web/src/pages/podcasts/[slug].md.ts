import type { APIRoute } from 'astro';
import { sanityFetch } from '../../lib/sanity/client';
import { podcastEpisodesQuery } from '../../lib/sanity/queries';
import { mdResponse, mdDate } from '../../lib/markdown';

interface Chapter { timestamp: string; title: string; note?: string }
interface Quote { text: string; timestamp?: string }

interface Episode {
  title: string;
  url: string;
  type: string;
  publishedAt?: string;
  source?: string;
  excerpt?: string;
  slug: string;
  summary?: string;
  keyTakeaways?: string[];
  chapters?: Chapter[];
  quotes?: Quote[];
  relatedTalk?: { title: string; slug: string };
}

export async function getStaticPaths() {
  const episodes = await sanityFetch<Episode[]>(podcastEpisodesQuery).catch(() => []);
  return episodes.map((episode) => ({ params: { slug: episode.slug }, props: { episode } }));
}

export const GET: APIRoute = async ({ props }) => {
  const e = (props as { episode: Episode }).episode;

  const body = [
    `# ${e.title}`,
    ``,
    `> ${e.type === 'interview' ? 'Interview' : 'Podcast episode'} featuring Faris Aziz${e.source ? ` on ${e.source}` : ''}${e.publishedAt ? ` (${mdDate(e.publishedAt)})` : ''}. Listen: ${e.url}`,
    ``,
    e.summary ? `${e.summary}\n` : '',
    e.keyTakeaways?.length
      ? `## Key takeaways\n\n${e.keyTakeaways.map((t) => `- ${t}`).join('\n')}\n`
      : '',
    e.chapters?.length
      ? `## Chapters\n\n${e.chapters.map((c) => `- **${c.timestamp}** — ${c.title}${c.note ? `: ${c.note}` : ''}`).join('\n')}\n`
      : '',
    e.quotes?.length
      ? `## Quotes\n\n${e.quotes.map((q) => `> "${q.text}"${q.timestamp ? ` — at ${q.timestamp}` : ''}`).join('\n\n')}\n`
      : '',
    e.relatedTalk
      ? `## Related talk\n\nThis conversation pairs with the bookable talk "${e.relatedTalk.title}": https://faziz-dev.com/talks/${e.relatedTalk.slug}\n`
      : '',
    `## Want a conversation like this on your show?\n\nInvite Faris: https://faziz-dev.com/invite`,
  ]
    .filter(Boolean)
    .join('\n');

  return mdResponse(body);
};
