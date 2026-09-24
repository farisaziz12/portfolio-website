/**
 * Podcast Episode Enrichment Pipeline
 *
 * Automatically enriches podcast/interview episodes with AI-generated
 * deep-dive content: summary, key takeaways, chapters, and pull quotes.
 *
 * Usage:
 *   pnpm enrich-podcasts              # Process all unenriched episodes
 *   pnpm enrich-podcasts --dry-run    # Preview without updating Sanity
 *   pnpm enrich-podcasts --id=abc123  # Process specific episode by ID
 *
 * Environment variables required:
 *   SANITY_PROJECT_ID  - Your Sanity project ID
 *   SANITY_DATASET     - Your Sanity dataset (e.g., "production")
 *   SANITY_API_TOKEN   - API token with write access
 *   ANTHROPIC_API_KEY  - Claude API key for content generation
 *
 * Optional:
 *   YOUTUBE_API_KEY    - For fetching YouTube transcripts (falls back to auto-captions)
 */

import { createClient } from '@sanity/client';
import Anthropic from '@anthropic-ai/sdk';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface Episode {
  _id: string;
  title: string;
  url: string;
  type: 'podcast' | 'interview';
  source?: string;
  publishedAt?: string;
  excerpt?: string;
}

interface EnrichedContent {
  slug: string;
  summary: string;
  keyTakeaways: string[];
  chapters: { timestamp: string; title: string; note?: string }[];
  quotes: { text: string; timestamp?: string }[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────────────────────

const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// ─────────────────────────────────────────────────────────────────────────────
// Transcript Fetching
// ─────────────────────────────────────────────────────────────────────────────

function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') return u.pathname.slice(1);
    if (u.hostname.includes('youtube.com')) return u.searchParams.get('v');
  } catch {}
  return null;
}

function extractSpotifyId(url: string): { type: string; id: string } | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes('spotify.com')) {
      const match = u.pathname.match(/\/(episode|show)\/([A-Za-z0-9]+)/);
      if (match) return { type: match[1], id: match[2] };
    }
  } catch {}
  return null;
}

async function fetchYouTubeTranscript(videoId: string): Promise<string | null> {
  try {
    // Try using youtube-transcript library approach (fetches auto-captions)
    const response = await fetch(
      `https://www.youtube.com/watch?v=${videoId}`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const html = await response.text();

    // Extract captions URL from the page
    const captionsMatch = html.match(/"captions":\s*({.*?"captionTracks":\s*\[.*?\].*?})/s);
    if (!captionsMatch) {
      console.log(`  ⚠ No captions found for YouTube video ${videoId}`);
      return null;
    }

    const captionsData = JSON.parse(captionsMatch[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\'));
    const tracks = captionsData?.playerCaptionsTracklistRenderer?.captionTracks;

    if (!tracks || tracks.length === 0) {
      console.log(`  ⚠ No caption tracks available`);
      return null;
    }

    // Prefer English, fall back to first available
    const track = tracks.find((t: any) => t.languageCode === 'en') || tracks[0];
    const captionsUrl = track.baseUrl;

    const captionsResponse = await fetch(captionsUrl);
    const captionsXml = await captionsResponse.text();

    // Parse XML captions
    const textMatches = captionsXml.matchAll(/<text[^>]*>([^<]*)<\/text>/g);
    const lines: string[] = [];
    for (const match of textMatches) {
      const text = match[1]
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .trim();
      if (text) lines.push(text);
    }

    return lines.join(' ');
  } catch (error) {
    console.error(`  ✗ Failed to fetch YouTube transcript:`, error);
    return null;
  }
}

async function fetchTranscript(url: string): Promise<string | null> {
  // Try YouTube
  const ytId = extractYouTubeId(url);
  if (ytId) {
    console.log(`  → Fetching YouTube transcript for ${ytId}...`);
    return fetchYouTubeTranscript(ytId);
  }

  // Spotify doesn't provide transcripts via API
  const spotifyId = extractSpotifyId(url);
  if (spotifyId) {
    console.log(`  ⚠ Spotify episodes require manual transcript upload`);
    return null;
  }

  console.log(`  ⚠ Unsupported platform, no transcript available`);
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// AI Content Generation
// ─────────────────────────────────────────────────────────────────────────────

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 96);
}

async function generateDeepDiveContent(
  episode: Episode,
  transcript: string
): Promise<EnrichedContent> {
  const prompt = `You are analyzing a podcast/interview episode to create structured content for a speaker's portfolio website.

Episode Title: ${episode.title}
Source/Show: ${episode.source || 'Unknown'}
Type: ${episode.type}

Transcript:
${transcript.slice(0, 50000)} ${transcript.length > 50000 ? '... [truncated]' : ''}

Generate the following in JSON format:

{
  "summary": "2-4 sentences summarizing what the conversation covers. First person, casual tone, as if the speaker (Faris) is describing it.",
  
  "keyTakeaways": [
    "3-7 one-sentence learnings. These are the skimmable heart of the page. Each should be a complete, standalone insight someone could tweet."
  ],
  
  "chapters": [
    {
      "timestamp": "mm:ss format, e.g. '12:45' or '1:23:45' for longer episodes",
      "title": "Section title (3-6 words)",
      "note": "Optional one-line description of what's discussed"
    }
  ],
  
  "quotes": [
    {
      "text": "A quotable line from the episode (1-2 sentences max)",
      "timestamp": "Optional mm:ss when this was said"
    }
  ]
}

Guidelines:
- Key takeaways should be actionable insights, not just topic summaries
- Chapters should be 4-8 sections covering the main flow of conversation
- Quotes should be memorable, tweetable moments (1-3 quotes)
- Use timestamps from the transcript if visible, otherwise estimate based on position
- Keep everything concise and scannable

Return ONLY the JSON object, no markdown formatting.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  // Parse JSON from response
  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse JSON from Claude response');
  }

  const parsed = JSON.parse(jsonMatch[0]);

  return {
    slug: generateSlug(episode.title),
    summary: parsed.summary,
    keyTakeaways: parsed.keyTakeaways,
    chapters: parsed.chapters,
    quotes: parsed.quotes,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Sanity Operations
// ─────────────────────────────────────────────────────────────────────────────

async function fetchUnenrichedEpisodes(): Promise<Episode[]> {
  const query = `*[
    _type == "externalPost" && 
    type in ["podcast", "interview"] &&
    (!defined(slug) || !defined(keyTakeaways) || count(keyTakeaways) == 0)
  ] | order(publishedAt desc) {
    _id,
    title,
    url,
    type,
    source,
    publishedAt,
    excerpt
  }`;

  return sanity.fetch(query);
}

async function fetchEpisodeById(id: string): Promise<Episode | null> {
  const query = `*[_type == "externalPost" && _id == $id][0] {
    _id,
    title,
    url,
    type,
    source,
    publishedAt,
    excerpt
  }`;

  return sanity.fetch(query, { id });
}

async function updateEpisode(id: string, content: EnrichedContent): Promise<void> {
  await sanity
    .patch(id)
    .set({
      slug: { _type: 'slug', current: content.slug },
      summary: content.summary,
      keyTakeaways: content.keyTakeaways,
      chapters: content.chapters.map((c, i) => ({
        _key: `chapter-${i}`,
        timestamp: c.timestamp,
        title: c.title,
        note: c.note,
      })),
      quotes: content.quotes.map((q, i) => ({
        _key: `quote-${i}`,
        text: q.text,
        timestamp: q.timestamp,
      })),
    })
    .commit();
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function processEpisode(episode: Episode, dryRun: boolean): Promise<boolean> {
  console.log(`\n📼 Processing: ${episode.title}`);
  console.log(`   URL: ${episode.url}`);

  // Fetch transcript
  const transcript = await fetchTranscript(episode.url);
  if (!transcript) {
    console.log(`  ✗ Skipping: No transcript available`);
    return false;
  }
  console.log(`  ✓ Transcript fetched (${transcript.length} chars)`);

  // Generate content with Claude
  console.log(`  → Generating deep-dive content with Claude...`);
  const content = await generateDeepDiveContent(episode, transcript);
  console.log(`  ✓ Generated: ${content.keyTakeaways.length} takeaways, ${content.chapters.length} chapters, ${content.quotes.length} quotes`);

  if (dryRun) {
    console.log(`  [DRY RUN] Would update with:`);
    console.log(`    Slug: ${content.slug}`);
    console.log(`    Summary: ${content.summary.slice(0, 100)}...`);
    console.log(`    Takeaways: ${content.keyTakeaways.slice(0, 2).join(' | ')}...`);
    return true;
  }

  // Update Sanity
  console.log(`  → Updating Sanity document...`);
  await updateEpisode(episode._id, content);
  console.log(`  ✓ Episode enriched! View at /podcasts/${content.slug}`);

  return true;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const specificId = args.find((a) => a.startsWith('--id='))?.split('=')[1];

  console.log('🎙️  Podcast Episode Enrichment Pipeline');
  console.log('─'.repeat(50));

  if (dryRun) {
    console.log('⚠️  DRY RUN MODE - No changes will be made to Sanity\n');
  }

  // Validate environment
  if (!process.env.SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
    console.error('✗ Missing Sanity credentials. Set SANITY_PROJECT_ID and SANITY_API_TOKEN.');
    process.exit(1);
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('✗ Missing ANTHROPIC_API_KEY for AI content generation.');
    process.exit(1);
  }

  let episodes: Episode[];

  if (specificId) {
    const episode = await fetchEpisodeById(specificId);
    if (!episode) {
      console.error(`✗ Episode not found: ${specificId}`);
      process.exit(1);
    }
    episodes = [episode];
  } else {
    episodes = await fetchUnenrichedEpisodes();
  }

  console.log(`Found ${episodes.length} episode(s) to process\n`);

  if (episodes.length === 0) {
    console.log('✓ All episodes are already enriched!');
    return;
  }

  let processed = 0;
  let failed = 0;

  for (const episode of episodes) {
    try {
      const success = await processEpisode(episode, dryRun);
      if (success) processed++;
      else failed++;
    } catch (error) {
      console.error(`  ✗ Error processing ${episode.title}:`, error);
      failed++;
    }

    // Rate limit: wait between episodes
    if (episodes.indexOf(episode) < episodes.length - 1) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  console.log('\n' + '─'.repeat(50));
  console.log(`✓ Done! Processed: ${processed}, Failed: ${failed}`);
}

main().catch(console.error);
