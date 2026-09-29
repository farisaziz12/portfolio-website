import type { APIRoute } from 'astro';
import { mdResponse } from '../lib/markdown';
import { getProfile } from '../lib/sanity/v3';

const SITE = 'https://faziz-dev.com';

export const GET: APIRoute = async () => {
  const profile = await getProfile();
  const socials = [
    ['LinkedIn', profile.links.linkedin],
    ['Bluesky', profile.links.bluesky],
    ['X', profile.links.twitter],
  ].filter((s): s is [string, string] => Boolean(s[1]));

  const body = [
    `# Contact Faris Aziz`,
    ``,
    `> Two doors. Speaking and workshops go through the invitation form; everything else (podcasts, press, a question, a hello) goes through a short message form. Both reach Faris only; he replies within ${profile.replyTime}. There is no public email address.`,
    ``,
    `## 1. Speaking and workshops`,
    ``,
    `Invitation form: ${SITE}/invite (three required fields: name, email, and one line about the event, show or publication). Details for agents: ${SITE}/invite.md`,
    ``,
    `## 2. Everything else`,
    ``,
    `Message form (email + message): ${SITE}/contact#message. A confirmation with a reference number appears only once the message is stored.`,
    ``,
    socials.length ? `## Socials\n\n${socials.map(([l, u], i) => `- ${l}: ${u}${i === 0 ? ' (fastest)' : ''}`).join('\n')}` : '',
    ``,
    `Press kit (bios, photos, rider): ${SITE}/press-kit`,
  ].join('\n');

  return mdResponse(body);
};
