import type { APIRoute } from 'astro';
import { getProjects } from '../lib/secondary-content';
import { mdResponse } from '../lib/markdown';
import { SITE } from '../lib/seo';

export const GET: APIRoute = async () => {
  const projects = await getProjects();

  const body = [
    `# Projects · Faris Aziz`,
    ``,
    `> Things Faris Aziz has built: products, platforms and tools, from community infrastructure to open-source helpers.${projects.length ? ` ${projects.length} published.` : ''}`,
    ``,
    ...(projects.length
      ? projects.map((p) =>
          [
            `- [${p.title}](${SITE}/projects/${p.slug})`,
            [p.category, p.featured ? 'featured' : ''].filter(Boolean).join(', ') && ` (${[p.category, p.featured ? 'featured' : ''].filter(Boolean).join(', ')})`,
            p.description ? `: ${p.description.replace(/\s+/g, ' ')}` : '',
            p.technologies.length ? ` Built with ${p.technologies.join(', ')}.` : '',
            p.links.liveUrl ? ` Live: ${p.links.liveUrl}` : '',
            p.links.githubUrl ? ` Source: ${p.links.githubUrl}` : '',
          ].join('')
        )
      : ['No project write-ups are published yet. Code: https://github.com/farisaziz12']),
    ``,
    `Work together: ${SITE}/services`,
  ].join('\n');

  return mdResponse(body);
};
