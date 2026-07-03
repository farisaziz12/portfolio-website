import type { APIRoute } from 'astro';
import { sanityFetch } from '../../lib/sanity/client';
import { allTalksQuery, talkBySlugQuery } from '../../lib/sanity/queries';
import { mdResponse, mdDate } from '../../lib/markdown';

interface TalkListItem {
  slug: string;
}

interface TalkDetail {
  title: string;
  slug: string;
  abstract?: string;
  audience?: string;
  takeaways?: string[];
  topics?: string[];
  duration?: number;
  assets?: { videoUrl?: string; slidesUrl?: string; repoUrl?: string };
  allFamilyEvents?: { title: string; date: string; conference?: string; links?: { videoUrl?: string; slidesUrl?: string } }[];
  events?: { title: string; date: string; conference?: string; links?: { videoUrl?: string; slidesUrl?: string } }[];
}

export async function getStaticPaths() {
  const talks = await sanityFetch<TalkListItem[]>(allTalksQuery).catch(() => []);
  return talks.map((t) => ({ params: { slug: t.slug } }));
}

export const GET: APIRoute = async ({ params }) => {
  const talk = await sanityFetch<TalkDetail | null>(talkBySlugQuery, { slug: params.slug }).catch(() => null);
  if (!talk) return new Response('Not found', { status: 404 });

  const deliveries = talk.allFamilyEvents?.length ? talk.allFamilyEvents : talk.events || [];

  const body = [
    `# ${talk.title}`,
    ``,
    `> Conference talk by Faris Aziz${talk.duration ? ` · ${talk.duration} min` : ''}${talk.topics?.length ? ` · ${talk.topics.join(', ')}` : ''}. Book it: https://faziz-dev.com/invite?format=talk&talk=${encodeURIComponent(talk.title)}`,
    ``,
    talk.abstract ? `## Abstract\n\n${talk.abstract}` : '',
    talk.audience ? `## Audience\n\n${talk.audience}` : '',
    talk.takeaways?.length ? `## Key takeaways\n\n${talk.takeaways.map((t) => `- ${t}`).join('\n')}` : '',
    talk.assets?.videoUrl || talk.assets?.slidesUrl || talk.assets?.repoUrl
      ? `## Assets\n\n${[
          talk.assets?.videoUrl ? `- Recording: ${talk.assets.videoUrl}` : null,
          talk.assets?.slidesUrl ? `- Slides: ${talk.assets.slidesUrl}` : null,
          talk.assets?.repoUrl ? `- Code: ${talk.assets.repoUrl}` : null,
        ]
          .filter(Boolean)
          .join('\n')}`
      : '',
    deliveries.length
      ? `## Deliveries (${deliveries.length})\n\n${deliveries
          .map((e) => `- ${mdDate(e.date)} — ${e.conference || e.title}${e.links?.videoUrl ? ` · [recording](${e.links.videoUrl})` : ''}`)
          .join('\n')}`
      : '',
  ]
    .filter(Boolean)
    .join('\n\n');

  return mdResponse(body);
};
