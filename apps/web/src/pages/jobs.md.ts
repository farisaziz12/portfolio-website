import type { APIRoute } from 'astro';
import { getPublicJobs } from '../lib/sanity/v3/jobs';
import { mdResponse } from '../lib/markdown';
import { SITE } from '../lib/seo';

// Rendered per request, like /jobs, so expired roles never linger in a cached mirror.
export const prerender = false;

export const GET: APIRoute = async () => {
  const jobs = await getPublicJobs();
  const day = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Zurich' });

  const rows = jobs.map((j) => {
    const where = j.geoKind === 'hybrid-ch'
      ? [j.locationText, j.attendance].filter(Boolean).join(', ')
      : [j.locationText, j.eligibleCountries.length ? `eligible countries: ${j.eligibleCountries.join(', ')}` : ''].filter(Boolean).join(', ');
    return [
      `### ${j.companyName}: ${j.title}`,
      ``,
      j.summary ? `${j.summary}\n` : '',
      `- Where: ${j.geoLabel}${where ? ` (${where})` : ''}`,
      `- ${j.age}`,
      `- Last checked: ${day.format(new Date(j.lastVerifiedAt))}`,
      `- Apply: ${j.applyUrl}`,
    ].filter((l) => l !== '').join('\n');
  });

  const body = [
    `# Jobs worth a look · Faris Aziz`,
    ``,
    `> Engineering, platform and IT roles checked as open recently, each with written evidence that someone in Switzerland can apply. A hand-picked list, not every opening. ${SITE}/jobs`,
    ``,
    jobs.length ? `${jobs.length} role${jobs.length === 1 ? '' : 's'} listed.` : 'Nothing is listed right now. Only recently checked roles appear, so this can be empty.',
    ``,
    rows.join('\n\n'),
  ].join('\n');

  const res = await mdResponse(body);
  res.headers.set('Cache-Control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=0');
  return res;
};
