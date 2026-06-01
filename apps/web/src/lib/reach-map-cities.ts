/**
 * Reach-map city positions + auto-layout label placer.
 *
 * The SVG canvas is 1200 × 480 (viewBox "0 0 1200 480"). Pin positions
 * are eyeballed for visual rhythm, not true lat/lng — the map reads
 * "I speak globally," not as a literal atlas.
 *
 * Labels are placed automatically by `layoutLabels()` below: we try a
 * preferred slot under each pin, fall back to above / further out if
 * that collides with an existing label, and draw a thin leader line
 * from pin to label whenever the label has to move significantly.
 */

export type Region = 'americas' | 'europe' | 'mena' | 'asia' | 'oceania';

export interface MapCity {
  name: string;
  x: number;
  y: number;
  region: Region;
}

export interface PlacedLabel {
  name: string;
  /** Pin position */
  px: number;
  py: number;
  /** Label position (text anchor point) */
  lx: number;
  ly: number;
  anchor: 'start' | 'middle' | 'end';
  /** True if the label was bumped away from the pin and needs a leader line */
  hasLeader: boolean;
  isHub?: boolean;
}

export const HUB: MapCity = { name: 'Geneva', x: 580, y: 220, region: 'europe' };

const CITY_LOOKUP: Record<string, MapCity> = {
  // ── Americas ─────────────────────────────────────────────────────────
  'san francisco': { name: 'San Francisco', x: 95, y: 245, region: 'americas' },
  'los angeles':   { name: 'Los Angeles',   x: 105, y: 280, region: 'americas' },
  'new york':      { name: 'New York',      x: 225, y: 215, region: 'americas' },
  'toronto':       { name: 'Toronto',       x: 215, y: 180, region: 'americas' },
  'mexico city':   { name: 'Mexico City',   x: 170, y: 305, region: 'americas' },
  'são paulo':     { name: 'São Paulo',     x: 310, y: 390, region: 'americas' },
  'sao paulo':     { name: 'São Paulo',     x: 310, y: 390, region: 'americas' },
  'buenos aires':  { name: 'Buenos Aires',  x: 295, y: 425, region: 'americas' },

  // ── Western Europe ───────────────────────────────────────────────────
  'dublin':        { name: 'Dublin',        x: 475, y: 140, region: 'europe' },
  'london':        { name: 'London',        x: 510, y: 160, region: 'europe' },
  'amsterdam':     { name: 'Amsterdam',     x: 555, y: 135, region: 'europe' },
  'brussels':      { name: 'Brussels',      x: 550, y: 175, region: 'europe' },
  'paris':         { name: 'Paris',         x: 530, y: 200, region: 'europe' },

  // ── Iberia ───────────────────────────────────────────────────────────
  'porto':         { name: 'Porto',         x: 455, y: 245, region: 'europe' },
  'lisbon':        { name: 'Lisbon',        x: 460, y: 270, region: 'europe' },
  'coimbra':       { name: 'Coimbra',       x: 475, y: 255, region: 'europe' },
  'madrid':        { name: 'Madrid',        x: 495, y: 245, region: 'europe' },
  'barcelona':     { name: 'Barcelona',     x: 525, y: 250, region: 'europe' },

  // ── Central Europe ───────────────────────────────────────────────────
  'zurich':        { name: 'Zurich',        x: 590, y: 215, region: 'europe' },
  'milan':         { name: 'Milan',         x: 605, y: 245, region: 'europe' },
  'rome':          { name: 'Rome',          x: 625, y: 280, region: 'europe' },
  'berlin':        { name: 'Berlin',        x: 625, y: 145, region: 'europe' },
  'vienna':        { name: 'Vienna',        x: 660, y: 200, region: 'europe' },
  'prague':        { name: 'Prague',        x: 655, y: 170, region: 'europe' },
  'warsaw':        { name: 'Warsaw',        x: 695, y: 140, region: 'europe' },
  'kyiv':          { name: 'Kyiv',          x: 735, y: 170, region: 'europe' },

  // ── Northern Europe ──────────────────────────────────────────────────
  'oslo':          { name: 'Oslo',          x: 605, y: 80,  region: 'europe' },
  'stockholm':     { name: 'Stockholm',     x: 650, y: 80,  region: 'europe' },
  'helsinki':      { name: 'Helsinki',      x: 710, y: 80,  region: 'europe' },
  'copenhagen':    { name: 'Copenhagen',    x: 625, y: 110, region: 'europe' },

  // ── Mediterranean / Middle East ──────────────────────────────────────
  'athens':        { name: 'Athens',        x: 675, y: 260, region: 'europe' },
  'istanbul':      { name: 'Istanbul',      x: 720, y: 235, region: 'mena' },
  'tel aviv':      { name: 'Tel Aviv',      x: 730, y: 300, region: 'mena' },
  'dubai':         { name: 'Dubai',         x: 805, y: 315, region: 'mena' },

  // ── Asia ─────────────────────────────────────────────────────────────
  'mumbai':        { name: 'Mumbai',        x: 855, y: 325, region: 'asia' },
  'bengaluru':     { name: 'Bengaluru',     x: 885, y: 345, region: 'asia' },
  'bangalore':     { name: 'Bengaluru',     x: 885, y: 345, region: 'asia' },
  'singapore':     { name: 'Singapore',     x: 975, y: 390, region: 'asia' },
  'hong kong':     { name: 'Hong Kong',     x: 1020, y: 295, region: 'asia' },
  'taipei':        { name: 'Taipei',        x: 1050, y: 275, region: 'asia' },
  'seoul':         { name: 'Seoul',         x: 1060, y: 205, region: 'asia' },
  'tokyo':         { name: 'Tokyo',         x: 1100, y: 225, region: 'asia' },

  // ── Oceania ──────────────────────────────────────────────────────────
  'sydney':        { name: 'Sydney',        x: 1145, y: 420, region: 'oceania' },
  'melbourne':     { name: 'Melbourne',     x: 1125, y: 440, region: 'oceania' },
};

export const REGION_LABEL: Record<Region, string> = {
  americas: 'Americas',
  europe: 'Europe',
  mena: 'Middle East',
  asia: 'Asia',
  oceania: 'Oceania',
};

const REGION_ORDER: Region[] = ['americas', 'europe', 'mena', 'asia', 'oceania'];

export function groupByRegion(points: MapCity[]): { region: Region; label: string; cities: string[] }[] {
  const groups = new Map<Region, string[]>();
  for (const p of points) {
    if (!groups.has(p.region)) groups.set(p.region, []);
    const list = groups.get(p.region)!;
    if (!list.includes(p.name)) list.push(p.name);
  }
  return REGION_ORDER
    .filter((r) => groups.has(r))
    .map((r) => ({ region: r, label: REGION_LABEL[r], cities: groups.get(r)!.sort() }));
}

export function citiesToMap(rawCities: (string | undefined | null)[]): MapCity[] {
  const seen = new Set<string>();
  const out: MapCity[] = [];
  for (const c of rawCities) {
    if (!c) continue;
    const key = c.trim().toLowerCase();
    const hit = CITY_LOOKUP[key];
    if (hit && !seen.has(hit.name)) {
      seen.add(hit.name);
      out.push(hit);
    }
  }
  return out;
}

/* ─────────────────────────────────────────────────────────────────────────
   Auto-layout: place labels with collision detection.

   For each pin we try a list of candidate label positions in priority
   order (below pin → above pin → further below → further above → side).
   First slot that doesn't collide with any already-placed label wins.
   If we had to move the label more than `LEADER_THRESHOLD` pixels from
   the pin, we draw a leader line at render time.
   ───────────────────────────────────────────────────────────────────── */

// Rough horizontal width of a label in canvas units. The map font is 12px
// mono, average character width ≈ 6.6px; pad both sides by 4 for safety.
function estimateWidth(text: string): number {
  return text.length * 6.6 + 8;
}

const LABEL_HEIGHT = 14; // visual line height for collision purposes
const LEADER_THRESHOLD = 8; // pixels of forced displacement before we draw a leader

interface Box { x0: number; x1: number; y0: number; y1: number }

function boxFor(name: string, lx: number, ly: number, anchor: 'start' | 'middle' | 'end'): Box {
  const w = estimateWidth(name);
  const half = w / 2;
  const x0 = anchor === 'start' ? lx - 2 : anchor === 'end' ? lx - w + 2 : lx - half;
  return { x0, x1: x0 + w, y0: ly - LABEL_HEIGHT, y1: ly + 2 };
}

function overlaps(a: Box, b: Box, gap = 2): boolean {
  return !(a.x1 + gap < b.x0 || b.x1 + gap < a.x0 || a.y1 + gap < b.y0 || b.y1 + gap < a.y0);
}

interface Candidate {
  lx: number;
  ly: number;
  anchor: 'start' | 'middle' | 'end';
}

function candidatesFor(p: MapCity): Candidate[] {
  // Preferred: directly below pin
  // Then alternates spiralling outward
  return [
    { lx: p.x,       ly: p.y + 18, anchor: 'middle' },   // below
    { lx: p.x,       ly: p.y - 10, anchor: 'middle' },   // above
    { lx: p.x + 10,  ly: p.y + 4,  anchor: 'start'  },   // right
    { lx: p.x - 10,  ly: p.y + 4,  anchor: 'end'    },   // left
    { lx: p.x,       ly: p.y + 32, anchor: 'middle' },   // further below
    { lx: p.x,       ly: p.y - 24, anchor: 'middle' },   // further above
    { lx: p.x + 14,  ly: p.y - 8,  anchor: 'start'  },   // upper-right
    { lx: p.x - 14,  ly: p.y - 8,  anchor: 'end'    },   // upper-left
    { lx: p.x + 14,  ly: p.y + 18, anchor: 'start'  },   // lower-right
    { lx: p.x - 14,  ly: p.y + 18, anchor: 'end'    },   // lower-left
    { lx: p.x,       ly: p.y + 46, anchor: 'middle' },   // far below
    { lx: p.x,       ly: p.y - 38, anchor: 'middle' },   // far above
  ];
}

export function layoutLabels(points: MapCity[]): PlacedLabel[] {
  const placed: { box: Box; out: PlacedLabel }[] = [];

  // Hub gets its label first, always above and centred
  const hubLabel: PlacedLabel = {
    name: HUB.name,
    px: HUB.x,
    py: HUB.y,
    lx: HUB.x,
    ly: HUB.y - 18,
    anchor: 'middle',
    hasLeader: false,
    isHub: true,
  };
  placed.push({ box: boxFor(HUB.name, hubLabel.lx, hubLabel.ly, hubLabel.anchor), out: hubLabel });

  // Process other cities sorted by x so European cluster gets stable layout
  const sorted = [...points].sort((a, b) => a.x - b.x);

  for (const p of sorted) {
    const cands = candidatesFor(p);
    let chosen: Candidate | null = null;

    for (const c of cands) {
      const box = boxFor(p.name, c.lx, c.ly, c.anchor);
      const hits = placed.some((q) => overlaps(box, q.box));
      if (!hits) {
        chosen = c;
        break;
      }
    }

    // Fallback: progressively bump down until clear (within the canvas)
    if (!chosen) {
      for (let dy = 60; dy <= 200 && !chosen; dy += 14) {
        const c: Candidate = { lx: p.x, ly: p.y + dy, anchor: 'middle' };
        const box = boxFor(p.name, c.lx, c.ly, c.anchor);
        if (!placed.some((q) => overlaps(box, q.box))) chosen = c;
      }
    }
    if (!chosen) {
      // Last resort: just put it where the first candidate was and let it overlap (won't happen in practice)
      chosen = cands[0];
    }

    const dxFromPin = Math.abs(chosen.lx - p.x);
    const dyFromPin = Math.abs(chosen.ly - p.y);
    const hasLeader = dxFromPin > LEADER_THRESHOLD || dyFromPin > 26;

    const out: PlacedLabel = {
      name: p.name,
      px: p.x,
      py: p.y,
      lx: chosen.lx,
      ly: chosen.ly,
      anchor: chosen.anchor,
      hasLeader,
    };
    placed.push({ box: boxFor(p.name, out.lx, out.ly, out.anchor), out });
  }

  return placed.map((p) => p.out);
}
