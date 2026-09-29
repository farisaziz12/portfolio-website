import type { APIRoute } from 'astro';
import { TOPIC_SHORT } from 'shared';
import { getWriting, fullDate } from '../../lib/sanity/v3';
import { getWritingPost } from '../../lib/writing-post';
import { mdResponse, portableTextToMarkdown } from '../../lib/markdown';
import { SITE } from '../../lib/seo';

export async function getStaticPaths() {
  const items = await getWriting();
  return items.filter((i) => i.isInternal && i.href.startsWith('/blog/')).map((i) => ({ params: { slug: i.href.slice('/blog/'.length) } }));
}

const abs = (href: string) => (href.startsWith('http') ? href : `${SITE}${href}`);

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug as string;
  const [post, writing] = await Promise.all([getWritingPost(slug), getWriting()]);
  if (!post) return new Response('Not found', { status: 404 });

  const item = writing.find((i) => i.href === `/blog/${slug}`);
  const minutes = post.minutes ?? item?.minutes;
  const related = writing.filter((i) => i.href !== `/blog/${slug}` && i.topic === post.topic).slice(0, 3);
  const meta = [
    'By Faris Aziz',
    `published ${fullDate(post.publishedAt)}`,
    post.updatedAt ? `updated ${fullDate(post.updatedAt)}` : '',
    post.topic ? `topic: ${TOPIC_SHORT[post.topic]}` : '',
    minutes ? `${minutes} min read` : '',
    post.tags.length ? `tags: ${post.tags.join(', ')}` : '',
  ].filter(Boolean);

  const lines = [
    `# ${post.title}`,
    '',
    `> ${meta.join(' · ')}`,
    '',
    post.excerpt ?? '',
    '',
    ...(post.corrections.length
      ? ['## Corrections', '', ...post.corrections.map((c) => `- ${c.date ? `${fullDate(c.date)}: ` : ''}${c.note}`), '']
      : []),
    portableTextToMarkdown(post.body),
    '',
    ...(post.relatedTalk || post.relatedEvent || related.length
      ? [
          '## Related',
          '',
          ...(post.relatedTalk ? [`- Talk: [${post.relatedTalk.title}](${SITE}/talks/${post.relatedTalk.slug})`] : []),
          ...(post.relatedEvent ? [`- Event: [${post.relatedEvent.title}](${SITE}/events/${post.relatedEvent.slug})`] : []),
          ...related.map((r) => `- [${r.title}](${abs(r.href)}) (${r.source}, ${fullDate(r.date)})`),
          '',
        ]
      : []),
    `Canonical: ${SITE}/blog/${slug}`,
    `All writing: ${SITE}/blog.md`,
  ];

  return mdResponse(lines.join('\n').replace(/\n{3,}/g, '\n\n'));
};
