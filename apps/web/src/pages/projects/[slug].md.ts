import type { APIRoute } from 'astro';
import { getProjects, getProjectBySlug } from '../../lib/secondary-content';
import { mdResponse, portableTextToMarkdown } from '../../lib/markdown';
import { yearOf } from '../../lib/sanity/v3';
import { SITE } from '../../lib/seo';

export async function getStaticPaths() {
  const projects = await getProjects();
  return projects.map((p) => ({ params: { slug: p.slug } }));
}

export const GET: APIRoute = async ({ params }) => {
  const p = await getProjectBySlug(String(params.slug));
  if (!p) return new Response('Not found', { status: 404 });

  const facts = [
    p.role && `- Role: ${p.role}`,
    p.category && `- Type: ${p.category}`,
    p.date && `- Year: ${yearOf(p.date)}`,
    p.technologies.length > 0 && `- Built with: ${p.technologies.join(', ')}`,
    p.links.liveUrl && `- Live: ${p.links.liveUrl}`,
    p.links.githubUrl && `- Source: ${p.links.githubUrl}`,
    p.links.npmUrl && `- npm: ${p.links.npmUrl}`,
  ].filter(Boolean);

  const long = portableTextToMarkdown(p.longDescription);
  const body = [
    `# ${p.title}`,
    ``,
    `> A project by Faris Aziz.${p.description ? ` ${p.description.replace(/\s+/g, ' ')}` : ''} Page: ${SITE}/projects/${p.slug}`,
    ``,
    facts.length ? `${facts.join('\n')}\n` : '',
    long ? `## About\n\n${long}\n` : '',
    p.challenges ? `## The hard part\n\n${p.challenges}\n` : '',
    p.outcomes.length ? `## What came of it\n\n${p.outcomes.map((o) => `- ${o}`).join('\n')}\n` : '',
    `All projects: ${SITE}/projects`,
  ]
    .filter((l, i, a) => l !== '' || a[i - 1] !== '')
    .join('\n');

  return mdResponse(body);
};
