/**
 * Build-time Open Graph card renderer, DS v3 ("Panels & Bands").
 *
 * satori (HTML/CSS subset → SVG) + resvg (SVG → PNG), rendered statically via
 * /og/[...slug].png — zero runtime cost, immutable URLs. The card is the site
 * in miniature: ink ground, a skewed yellow band with the 8px blue edge, a
 * cropped numeral or "F." on the band, Figtree 800 headline, the 8px band
 * along the bottom. Readable as a 300px thumbnail in feeds.
 */
import satori from 'satori';
import { html } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// Tokens as hex (satori has no CSS-variable support). Keep in sync with tokens.css.
const INK = '#0F0F10';
const SURFACE = '#191A1D';
const HAIRLINE = '#2A2A2E';
const CREAM = '#F8F4EB';
const MUTED = '#C8C1B5';
const FAINT = '#8A8378';
const YELLOW = '#F4C63A';
const BLUE = '#2E88B8';

type Weight = 400 | 600 | 700 | 800 | 900;
let fontsPromise: Promise<{ name: string; data: Buffer; weight: Weight; style: 'normal' }[]> | null = null;

function loadFonts() {
  if (!fontsPromise) {
    const file = (w: number) => readFile(require.resolve(`@fontsource/figtree/files/figtree-latin-${w}-normal.woff`));
    fontsPromise = Promise.all([file(400), file(600), file(700), file(800), file(900)]).then(([f4, f6, f7, f8, f9]) => [
      { name: 'Figtree', data: f4, weight: 400 as const, style: 'normal' as const },
      { name: 'Figtree', data: f6, weight: 600 as const, style: 'normal' as const },
      { name: 'Figtree', data: f7, weight: 700 as const, style: 'normal' as const },
      { name: 'Figtree', data: f8, weight: 800 as const, style: 'normal' as const },
      { name: 'Figtree', data: f9, weight: 900 as const, style: 'normal' as const },
    ]);
  }
  return fontsPromise;
}

export interface OgCard {
  /** Uppercase eyebrow, e.g. "TALK · ENGINEERING IN PRODUCTION · 30 MIN". */
  kicker?: string;
  /** The headline (clamped to ~3 lines). */
  title: string;
  /** Secondary line under the title. */
  meta?: string;
  /** Mark on the yellow band: a short numeral ("44", "22") or defaults to "F.". */
  mark?: string;
  /** Small label under the mark ("talks delivered"). */
  markLabel?: string;
  /** Bottom-left identity line, defaults to the "Now" line. */
  byline?: string;
  /** Bottom-right context, defaults to the domain. */
  footer?: string;
}

// satori-html does not decode entities in text nodes; strip markup characters instead.
function esc(s: string): string {
  return s.replace(/[<>]/g, '');
}

function clamp(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s;
}

export async function renderOgCard(card: OgCard): Promise<Uint8Array<ArrayBuffer>> {
  const fonts = await loadFonts();
  const title = clamp(card.title, 96);
  const titleSize = title.length > 70 ? 54 : title.length > 44 ? 62 : title.length > 26 ? 74 : 88;
  const mark = clamp(card.mark || 'F.', 5);
  const markSize = mark.length <= 2 ? 205 : mark.length <= 3 ? 160 : 125;
  const byline = card.byline || 'Software engineer · speaker · ZurichJS co-founder';

  const markup = html(`
    <div style="display:flex; position:relative; width:1200px; height:630px; background:${INK}; font-family:'Figtree'; overflow:hidden;">
      <div style="display:flex; position:absolute; right:-150px; top:-20px; width:520px; height:680px; background:${YELLOW}; transform:skewX(-14deg);"></div>
      <div style="display:flex; position:absolute; right:362px; top:-20px; width:10px; height:680px; background:${BLUE}; transform:skewX(-14deg);"></div>
      <div style="display:flex; flex-direction:column; align-items:flex-end; position:absolute; right:56px; top:70px; width:300px;">
        <div style="display:flex; color:${INK}; font-weight:900; font-size:${markSize}px; line-height:0.85; letter-spacing:-10px;">${esc(mark)}</div>
        ${card.markLabel ? `<div style="display:flex; margin-top:16px; color:${INK}; font-weight:700; font-size:26px; text-align:right;">${esc(clamp(card.markLabel, 28))}</div>` : ''}
      </div>
      <div style="display:flex; flex-direction:column; position:absolute; left:64px; top:64px; width:${card.markLabel || card.mark ? 700 : 720}px; height:470px;">
        ${
          card.kicker
            ? `<div style="display:flex; color:${YELLOW}; font-size:20px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase;">${esc(clamp(card.kicker, 58))}</div>`
            : ''
        }
        <div style="display:flex; flex:1; align-items:center;">
          <div style="display:flex; color:${CREAM}; font-weight:800; font-size:${titleSize}px; line-height:0.98; letter-spacing:-2.5px;">${esc(title)}</div>
        </div>
        ${card.meta ? `<div style="display:flex; color:${MUTED}; font-size:26px; line-height:1.35;">${esc(clamp(card.meta, 120))}</div>` : ''}
      </div>
      <div style="display:flex; position:absolute; left:0; right:0; bottom:8px; height:62px; align-items:center; justify-content:space-between; padding:0 64px; background:${INK}; border-top:1px solid ${HAIRLINE};">
        <div style="display:flex; align-items:center;">
          <div style="display:flex; color:${CREAM}; font-weight:800; font-size:24px; letter-spacing:-0.5px;">Faris Aziz</div>
          <div style="display:flex; margin-left:16px; color:${FAINT}; font-size:20px;">${esc(clamp(byline, 60))}</div>
        </div>
        <div style="display:flex; color:${YELLOW}; font-size:20px; font-weight:700;">${esc(card.footer || 'faziz-dev.com')}</div>
      </div>
      <div style="display:flex; position:absolute; left:0; bottom:0; width:144px; height:8px; background:${BLUE};"></div>
      <div style="display:flex; position:absolute; left:144px; right:0; bottom:0; height:8px; background:${YELLOW};"></div>
      <div style="display:flex; position:absolute; left:0; top:0; width:1px; height:1px; background:${SURFACE};"></div>
    </div>
  `);

  const svg = await satori(markup as Parameters<typeof satori>[0], { width: 1200, height: 630, fonts });
  return Uint8Array.from(new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng());
}

export const OG_HEADERS = {
  'Content-Type': 'image/png',
  'Cache-Control': 'public, max-age=31536000, immutable',
};
