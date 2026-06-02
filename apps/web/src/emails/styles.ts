// Design System v2 palette — kept in sync with apps/web/src/styles/global.css.
// Email clients don't support CSS variables, so values are inlined as hex literals.
// When adding a new template, import from this file; do NOT hard-code colors.

// Brand tokens (mirrors the dark theme — emails are dark-first like the site).
const BG = '#0A0C10'         // --bg
const SURFACE_1 = '#151A23'  // --surface-1
const INK = '#F3F5F8'        // --ink
const INK_MUTED = '#A9B4C2'  // --ink-muted
const INK_FAINT = '#6A7686'  // --ink-faint
const EDGE = '#232B36'       // --edge
const EDGE_STRONG = '#34404F'// --edge-strong
const ACCENT = '#3D7BFF'     // --accent
const ACCENT_BRIGHT = '#6AA1FF' // --accent-bright

// Re-export so individual templates can use exact brand colors inline when needed
// (e.g. <strong style={{ color: INK_STRONG }}>).
export const colors = {
  bg: BG,
  surface1: SURFACE_1,
  ink: INK,
  inkMuted: INK_MUTED,
  inkFaint: INK_FAINT,
  edge: EDGE,
  edgeStrong: EDGE_STRONG,
  accent: ACCENT,
  accentBright: ACCENT_BRIGHT,
} as const

export const body = {
  backgroundColor: BG,
  fontFamily: '"Hanken Grotesk", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  margin: '0',
  padding: '0',
}

export const container = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '40px 20px',
}

export const terminalHeader = {
  backgroundColor: SURFACE_1,
  borderRadius: '12px',
  padding: '20px 24px',
  marginBottom: '32px',
  border: `1px solid ${EDGE}`,
}

export const terminalDots = {
  color: INK_FAINT,
  fontSize: '10px',
  margin: '0 0 12px 0',
  letterSpacing: '4px',
}

export const terminalText = {
  fontFamily: '"IBM Plex Mono", "JetBrains Mono", ui-monospace, monospace',
  color: ACCENT_BRIGHT,
  fontSize: '14px',
  margin: '0 0 4px 0',
}

export const terminalOutput = {
  fontFamily: '"IBM Plex Mono", "JetBrains Mono", ui-monospace, monospace',
  color: INK_MUTED,
  fontSize: '13px',
  margin: '0',
}

export const content = {
  padding: '0 4px',
}

export const heading = {
  color: INK,
  fontSize: '28px',
  fontWeight: '700' as const,
  margin: '0 0 24px 0',
  fontFamily: '"Space Grotesk", "Hanken Grotesk", Inter, sans-serif',
  letterSpacing: '-0.01em',
}

export const paragraph = {
  color: INK_MUTED,
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
}

// Used for inline <strong> bumps inside paragraphs (template-level inline style).
export const inkStrong = INK

// Mono uppercase label/eyebrow — mirrors .ds-tag and the kicker pattern from the site.
export const kicker = {
  fontFamily: '"IBM Plex Mono", "JetBrains Mono", ui-monospace, monospace',
  fontSize: '11px',
  letterSpacing: '0.16em',
  textTransform: 'uppercase' as const,
  color: INK_FAINT,
  margin: '0 0 10px 0',
}

// Detail-row table styles for admin notification emails.
export const detailTable = {
  width: '100%',
  fontSize: '14px',
  borderCollapse: 'collapse' as const,
  margin: '0 0 8px 0',
}

export const detailLabel = {
  padding: '6px 0',
  color: INK_FAINT,
  width: '140px',
  verticalAlign: 'top' as const,
}

export const detailValue = {
  padding: '6px 0',
  color: INK,
  verticalAlign: 'top' as const,
}

// Free-form text block (message/goals) — preserves line breaks.
export const longText = {
  color: INK,
  whiteSpace: 'pre-wrap' as const,
  lineHeight: '1.55',
  margin: '0',
  fontSize: '15px',
}

export const buttonSection = {
  textAlign: 'center' as const,
  margin: '24px 0',
}

export const primaryButton = {
  backgroundColor: ACCENT,
  color: '#ffffff',
  padding: '14px 32px',
  borderRadius: '14px',
  fontSize: '16px',
  fontWeight: '600' as const,
  textDecoration: 'none',
  display: 'inline-block',
  boxShadow: '0 14px 40px -14px rgba(61,123,255,0.45)',
}

export const secondaryButton = {
  backgroundColor: 'transparent',
  color: INK_MUTED,
  padding: '12px 28px',
  borderRadius: '14px',
  fontSize: '14px',
  fontWeight: '500' as const,
  textDecoration: 'none',
  display: 'inline-block',
  border: `1px solid ${EDGE_STRONG}`,
}

export const divider = {
  borderColor: EDGE,
  margin: '32px 0',
}

export const signature = {
  color: INK,
  fontSize: '15px',
  fontWeight: '500' as const,
  margin: '0 0 4px 0',
}

export const signatureLink = {
  margin: '0',
}

export const link = {
  color: ACCENT_BRIGHT,
  textDecoration: 'underline',
}

export const footer = {
  padding: '24px 0 0 0',
}

export const footerText = {
  color: INK_FAINT,
  fontSize: '12px',
  lineHeight: '1.5',
  margin: '0 0 8px 0',
}
