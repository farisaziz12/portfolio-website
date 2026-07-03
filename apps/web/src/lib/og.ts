/**
 * Build-time Open Graph card renderer.
 *
 * satori (HTML/CSS subset → SVG) + resvg (SVG → PNG), rendered statically via
 * the /og/[...slug].png endpoint — zero runtime cost, immutable URLs. Cards
 * follow the site's dark brand with an inner hairline border so they hold up
 * on both light and dark feed chrome (X, LinkedIn, Slack, Bluesky, iMessage).
 */
import satori from 'satori';
import { html } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// Design tokens (hex literals — satori has no CSS-variable support).
const BG = '#0A0C10';
const SURFACE = '#0F131A';
const INK = '#F3F5F8';
const INK_MUTED = '#A9B4C2';
const INK_FAINT = '#6A7686';
const ACCENT = '#3D7BFF';
const ACCENT_BRIGHT = '#6AA1FF';
const EDGE = '#232B36';

let fontsPromise: Promise<{ name: string; data: Buffer; weight: 400 | 500 | 600 | 700; style: 'normal' }[]> | null = null;

function loadFonts() {
  if (!fontsPromise) {
    fontsPromise = Promise.all([
      readFile(require.resolve('@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff')),
      readFile(require.resolve('@fontsource/space-grotesk/files/space-grotesk-latin-500-normal.woff')),
      readFile(require.resolve('@fontsource/hanken-grotesk/files/hanken-grotesk-latin-400-normal.woff')),
      readFile(require.resolve('@fontsource/hanken-grotesk/files/hanken-grotesk-latin-600-normal.woff')),
    ]).then(([sg700, sg500, hg400, hg600]) => [
      { name: 'Space Grotesk', data: sg700, weight: 700 as const, style: 'normal' as const },
      { name: 'Space Grotesk', data: sg500, weight: 500 as const, style: 'normal' as const },
      { name: 'Hanken Grotesk', data: hg400, weight: 400 as const, style: 'normal' as const },
      { name: 'Hanken Grotesk', data: hg600, weight: 600 as const, style: 'normal' as const },
    ]);
  }
  return fontsPromise;
}

export interface OgCard {
  /** Small mono-style uppercase eyebrow, e.g. "CONFERENCE TALK · 45 MIN". */
  kicker?: string;
  /** The big headline (clamped to ~3 lines). */
  title: string;
  /** Secondary line under the title. */
  meta?: string;
  /** Bottom-right context label, defaults to the site domain. */
  footer?: string;
}

// satori-html does not decode HTML entities in text nodes, so escaping would
// render literally ("&amp;"). Strip markup-significant characters instead.
function esc(s: string): string {
  return s.replace(/[<>]/g, '');
}

function clamp(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s;
}

export async function renderOgCard(card: OgCard): Promise<Uint8Array<ArrayBuffer>> {
  const fonts = await loadFonts();
  const title = clamp(card.title, 90);
  // Scale the headline down as it gets longer so 3 lines always fit.
  const titleSize = title.length > 60 ? 56 : title.length > 34 ? 64 : 76;

  const markup = html(`
    <div style="display:flex; width:1200px; height:630px; background:${BG}; padding:24px; font-family:'Hanken Grotesk';">
      <div style="display:flex; flex-direction:column; flex:1; border:1px solid ${EDGE}; border-top:4px solid ${ACCENT}; border-radius:20px; background:${SURFACE}; padding:60px 72px 56px;">
        ${
          card.kicker
            ? `<div style="display:flex; align-items:center; gap:14px; color:${INK_FAINT}; font-size:26px; font-weight:600; letter-spacing:3px; text-transform:uppercase;">
                 <div style="display:flex; width:28px; height:2px; background:${ACCENT};"></div>
                 ${esc(clamp(card.kicker, 60))}
               </div>`
            : ''
        }
        <div style="display:flex; flex:1; align-items:center;">
          <div style="display:flex; color:${INK}; font-family:'Space Grotesk'; font-weight:700; font-size:${titleSize}px; line-height:1.08; letter-spacing:-1.5px; max-width:1000px;">
            ${esc(title)}
          </div>
        </div>
        ${
          card.meta
            ? `<div style="display:flex; color:${INK_MUTED}; font-size:30px; font-weight:400; margin-bottom:36px; max-width:980px;">${esc(clamp(card.meta, 110))}</div>`
            : ''
        }
        <div style="display:flex; align-items:center; justify-content:space-between; border-top:1px solid ${EDGE}; padding-top:32px;">
          <div style="display:flex; align-items:center; gap:18px;">
            <div style="display:flex; align-items:center; justify-content:center; width:52px; height:52px; border-radius:12px; background:${ACCENT}; color:#FFFFFF; font-family:'Space Grotesk'; font-weight:700; font-size:24px;">FA</div>
            <div style="display:flex; flex-direction:column;">
              <div style="display:flex; color:${INK}; font-family:'Space Grotesk'; font-weight:500; font-size:28px;">Faris Aziz</div>
              <div style="display:flex; color:${INK_FAINT}; font-size:22px;">Staff Software Engineer · Conference Speaker</div>
            </div>
          </div>
          <div style="display:flex; color:${ACCENT_BRIGHT}; font-size:26px; font-weight:600;">${esc(card.footer || 'faziz-dev.com')}</div>
        </div>
      </div>
    </div>
  `);

  const svg = await satori(markup as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts,
  });

  // Copy into a plain ArrayBuffer-backed Uint8Array so it satisfies BodyInit.
  return Uint8Array.from(new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng());
}

export const OG_HEADERS = {
  'Content-Type': 'image/png',
  'Cache-Control': 'public, max-age=31536000, immutable',
};
