/**
 * Cover art for podcasts and videos published elsewhere, when the Sanity
 * document has no image: looked up from the link at build time.
 *   YouTube        → i.ytimg.com thumbnail (derived from the id, no request)
 *   Spotify        → oEmbed thumbnail_url
 *   Apple Podcasts → iTunes lookup artworkUrl600
 * Anything else, or any failure, gives undefined and the card keeps its tile.
 */

export type ArtworkSource =
  | { kind: 'direct'; url: string }
  | { kind: 'spotify'; url: string }
  | { kind: 'apple'; id: string };

const YT_ID = /^[\w-]{11}$/;

/** Where the artwork for a link comes from, without any network access. */
export function artworkSource(link: string): ArtworkSource | undefined {
  let u: URL;
  try {
    u = new URL(link);
  } catch {
    return undefined;
  }
  const host = u.hostname.replace(/^(www|m|music)\./, '');

  if (host === 'youtube.com' || host === 'youtu.be') {
    const id =
      host === 'youtu.be'
        ? u.pathname.slice(1).split('/')[0]
        : u.searchParams.get('v') ?? u.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]+)/)?.[1];
    return id && YT_ID.test(id) ? { kind: 'direct', url: `https://i.ytimg.com/vi/${id}/hqdefault.jpg` } : undefined;
  }
  if (host === 'open.spotify.com' && /^\/(?:[\w-]+\/)?(episode|show)\/\w+/.test(u.pathname)) {
    return { kind: 'spotify', url: `${u.origin}${u.pathname}` };
  }
  if (host === 'podcasts.apple.com') {
    // Episode links carry ?i=<episode id>; show links only the /id<show id> path segment.
    const id = u.searchParams.get('i') ?? u.pathname.match(/\/id(\d+)/)?.[1];
    return id && /^\d+$/.test(id) ? { kind: 'apple', id } : undefined;
  }
  return undefined;
}

async function getJson(url: string, ms = 4000): Promise<unknown> {
  const res = await fetch(url, { signal: AbortSignal.timeout(ms), headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

const https = (s: unknown): string | undefined => (typeof s === 'string' && s.startsWith('https://') ? s : undefined);

/** The artwork URL for a podcast/video link, or undefined. Never throws. */
export async function lookupArtwork(link: string): Promise<string | undefined> {
  const src = artworkSource(link);
  if (!src) return undefined;
  if (src.kind === 'direct') return src.url;
  try {
    if (src.kind === 'spotify') {
      const data = (await getJson(`https://open.spotify.com/oembed?url=${encodeURIComponent(src.url)}`)) as { thumbnail_url?: unknown };
      return https(data.thumbnail_url);
    }
    const data = (await getJson(`https://itunes.apple.com/lookup?id=${src.id}&entity=podcastEpisode`)) as {
      results?: { artworkUrl600?: unknown; artworkUrl160?: unknown }[];
    };
    const hit = data.results?.find((r) => r.artworkUrl600 || r.artworkUrl160);
    return https(hit?.artworkUrl600) ?? https(hit?.artworkUrl160);
  } catch {
    return undefined;
  }
}
