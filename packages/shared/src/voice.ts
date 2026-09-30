/**
 * Voice rules: the phrases that make copy read as machine-written. One list,
 * used by the site's copy lint (apps/web/scripts/voice.ts), the CMS scan
 * (`pnpm voice:cms`), Studio warnings and the Sanity MCP voice prompt.
 * Guide with the reasoning and examples: docs/voice.md.
 *
 * Keep patterns specific: a rule that fires on honest copy gets ignored.
 */

export interface VoiceRule {
  id: string;
  pattern: RegExp;
  /** What to do instead, in a few words. */
  say: string;
}

const w = (words: string) => new RegExp(`\\b(?:${words})\\b`, 'gi');

export const VOICE_RULES: VoiceRule[] = [
  // Words nobody says out loud.
  { id: 'delve', pattern: w('delve[sd]?|delving'), say: 'look at, get into' },
  { id: 'seamless', pattern: w('seamless(?:ly)?'), say: 'say what actually works' },
  { id: 'leverage', pattern: w('leverag(?:e|es|ed|ing)'), say: 'use' },
  { id: 'robust', pattern: w('robust'), say: 'say what it survives' },
  { id: 'elevate', pattern: w('elevat(?:e|es|ed|ing)'), say: 'improve, or say how' },
  { id: 'unlock', pattern: w('unlock(?:s|ed|ing)?'), say: 'get, open up, let you' },
  { id: 'empower', pattern: w('empower(?:s|ed|ing|ment)?'), say: 'help, let' },
  { id: 'harness', pattern: w('harness(?:es|ed|ing)?'), say: 'use' },
  { id: 'foster', pattern: w('foster(?:s|ed|ing)?'), say: 'build, grow' },
  { id: 'landscape', pattern: w("(?:the|today's|tech|digital|modern|ever-changing) landscape"), say: 'name the actual thing' },
  { id: 'realm', pattern: w('realms?'), say: 'area, or name it' },
  { id: 'tapestry', pattern: w('tapestry|testament to'), say: 'cut it' },
  { id: 'pivotal', pattern: w('pivotal|crucial|paramount'), say: 'important, or show why' },
  { id: 'hype', pattern: w('game[- ]chang(?:er|ing)|cutting[- ]edge|world[- ]class|best[- ]in[- ]class|next[- ]level|state[- ]of[- ]the[- ]art|unparalleled|transformative|revolutioni[sz](?:e|ing)'), say: 'drop the adjective, show the proof' },
  { id: 'persona', pattern: w('passionate|thought leader(?:ship)?|rockstar|ninja|guru|visionary'), say: 'say what you did' },
  { id: 'corporate', pattern: w('synerg(?:y|ies)|holistic|innovative|streamlin(?:e|ed|es|ing)|supercharg(?:e|ed|es|ing)|actionable|stakeholders'), say: 'plainer word' },
  { id: 'polish', pattern: w('meticulous(?:ly)?|effortless(?:ly)?|curated|bespoke|comprehensive|nuanced|intricate'), say: 'cut it, or be specific' },
  { id: 'journey', pattern: w('embark(?:ed|ing)?|(?:my|your|the|this) journey'), say: 'say what happened' },
  { id: 'resonate', pattern: w('resonat(?:e|es|ed|ing)|showcas(?:e|es|ed|ing)|boasts?'), say: 'plainer verb' },
  { id: 'deep-dive', pattern: w('deep[- ]dives?|dive (?:into|deep)|diving into'), say: 'look at, walk through' },
  { id: 'formal', pattern: w('upon request|unmodified|utili[sz](?:e|es|ed|ing)|in order to|prior to|facilitat(?:e|es|ed|ing)|commence'), say: 'ask, as is, use, to, before, help, start' },

  // Sentence shapes.
  { id: 'today', pattern: w("in today's|ever[- ](?:evolving|changing)|fast[- ]paced|in the digital age"), say: 'cut the scene-setting' },
  { id: 'whether', pattern: w("whether you're|whether you are"), say: 'talk to one reader' },
  { id: 'not-just', pattern: w("(?:it'?s |is )?not just (?:a |an |about )?[\\w-]+(?: [\\w-]+){0,4},? (?:it'?s |but )"), say: 'say the one thing it is' },
  { id: 'more-than', pattern: w('more than just'), say: 'say what it is' },
  { id: 'core', pattern: w('at (?:its|the|my) core|at the heart of'), say: 'cut it' },
  { id: 'comes-in', pattern: w("that'?s where [\\w ]{1,30} comes? in"), say: 'say it directly' },
  { id: 'setup-line', pattern: w("here'?s the thing|the best part\\??|the kicker\\??|let'?s be honest|spoiler:|no fluff|the result\\?"), say: 'cut the setup, keep the point' },
  { id: 'sales', pattern: w('look no further|rest assured|take (?:it|your \\w+) to the next level|reach out|don\'?t hesitate'), say: 'ask plainly: "Tell me about it"' },
  { id: 'essays', pattern: w('essays?'), say: 'writing, articles, posts' },
  // Copy that explains the page, the counting or the code instead of saying something.
  { id: 'narrating', pattern: w("counted separately|so (?:a|the|any) [\\w ]{1,24} can be shared|(?:filters?|pills?|tabs?) (?:write|sync|update)s? (?:to )?the URL|this (?:page|section) (?:is|lists|shows|collects|brings together)|as you can see|below you'?ll find"), say: 'cut it: let the page show it' },

  // Punctuation.
  { id: 'em-dash', pattern: /(?<!>)\s—\s|\w—\w/g, say: 'comma, colon, full stop or brackets' },
];

export interface VoiceHit {
  rule: string;
  match: string;
  say: string;
  index: number;
}

/** Every AI tell in `text`, in order. */
export function findTells(text: string, rules: VoiceRule[] = VOICE_RULES): VoiceHit[] {
  if (!text) return [];
  const hits: VoiceHit[] = [];
  for (const rule of rules) {
    rule.pattern.lastIndex = 0;
    for (const m of text.matchAll(rule.pattern)) {
      hits.push({ rule: rule.id, match: m[0].trim(), say: rule.say, index: m.index ?? 0 });
    }
  }
  return hits.sort((a, b) => a.index - b.index);
}

/** Fields that hold data, not prose: never scanned. */
const SKIP_KEYS = new Set([
  '_id', '_type', '_key', '_ref', '_rev', '_createdAt', '_updatedAt', '_weak', '_strengthenOnPublish',
  'slug', 'current', 'url', 'href', 'link', 'email', 'asset', 'crop', 'hotspot', 'style', 'listItem',
  'markDefs', 'marks', 'timezone', 'date', 'endDate', 'startsAt', 'asOf', 'status', 'role', 'topic',
  'pillar', 'format', 'kind', 'platform', 'level', 'domain', 'mimeType', 'country', 'code',
  // Other people's words stay verbatim (docs/voice.md: "External voice, unedited").
  'quote',
]);

export interface TextField {
  path: string;
  text: string;
}

/**
 * Walks a Sanity document (or any JSON) and returns its prose fields, with
 * Portable Text blocks flattened to one string per block.
 */
export function collectText(value: unknown, path = ''): TextField[] {
  if (typeof value === 'string') {
    return /\s/.test(value.trim()) || value.length > 24 ? [{ path, text: value }] : [];
  }
  if (Array.isArray(value)) {
    return value.flatMap((v, i) => collectText(v, `${path}[${i}]`));
  }
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    if (obj._type === 'block' && Array.isArray(obj.children)) {
      const text = obj.children.map((c) => (c as { text?: string }).text ?? '').join('');
      return text ? [{ path, text }] : [];
    }
    return Object.entries(obj).flatMap(([k, v]) =>
      SKIP_KEYS.has(k) ? [] : collectText(v, path ? `${path}.${k}` : k),
    );
  }
  return [];
}

/** One line per hit, for Studio warnings and reports. */
export function describeTells(fields: TextField[]): string[] {
  return fields.flatMap(({ path, text }) =>
    findTells(text).map((h) => `${path}: "${h.match}" (${h.say})`),
  );
}
