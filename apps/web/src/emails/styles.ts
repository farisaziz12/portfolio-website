// Design System v3 ("Panels & Bands") for email, mirroring apps/web/src/styles/tokens.css.
// Email clients don't support CSS variables or gradients reliably, so values are
// inlined as hex and the brand band is two table cells (see parts.tsx).
// When adding a new template, import from this file; do NOT hard-code colors.

// Brand tokens (dark first, like the site).
const INK = '#0F0F10'          // --c-ink: page ground
const SURFACE = '#191A1D'      // --c-surface: cards
const HAIRLINE = '#2A2A2E'     // --c-hairline
const HAIRLINE_STRONG = '#44413C' // --c-hairline-strong
const CREAM = '#F8F4EB'        // --c-cream: headings, strong text
const MUTED = '#C8C1B5'        // --c-muted: body
const FAINT = '#8A8378'        // --c-faint: labels, footer
const YELLOW = '#F4C63A'       // --c-yellow: the one accent
const BLUE = '#2E88B8'         // --c-blue: band edge only

const FONT = 'Figtree, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif'

export const colors = {
  ink: INK,
  surface: SURFACE,
  hairline: HAIRLINE,
  hairlineStrong: HAIRLINE_STRONG,
  cream: CREAM,
  muted: MUTED,
  faint: FAINT,
  yellow: YELLOW,
  blue: BLUE,
} as const

export const body = {
  backgroundColor: INK,
  fontFamily: FONT,
  margin: '0',
  padding: '0',
}

export const container = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '32px 20px 40px',
}

// ── Header: band + wordmark + label (parts.tsx <EmailHeader>) ──────────────────
export const band = { width: '100%', borderCollapse: 'collapse' as const, margin: '0 0 28px 0' }
export const bandBlue = { backgroundColor: BLUE, width: '12%', height: '8px', lineHeight: '8px', fontSize: '1px' }
export const bandYellow = { backgroundColor: YELLOW, height: '8px', lineHeight: '8px', fontSize: '1px' }

export const wordmark = {
  color: CREAM,
  fontSize: '17px',
  fontWeight: '800' as const,
  letterSpacing: '-0.03em',
  margin: '0 0 4px 0',
  textDecoration: 'none',
}

export const headerLabel = {
  color: YELLOW,
  fontSize: '11px',
  fontWeight: '700' as const,
  letterSpacing: '0.14em',
  textTransform: 'uppercase' as const,
  margin: '0 0 28px 0',
}

export const content = {
  padding: '0',
}

export const heading = {
  color: CREAM,
  fontSize: '30px',
  fontWeight: '800' as const,
  lineHeight: '1.1',
  margin: '0 0 20px 0',
  fontFamily: FONT,
  letterSpacing: '-0.035em',
}

export const paragraph = {
  color: MUTED,
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
}

// Used for inline <strong> bumps inside paragraphs (template-level inline style).
export const inkStrong = CREAM

// Uppercase eyebrow, the site's .ds-kicker.
export const kicker = {
  fontSize: '11px',
  fontWeight: '700' as const,
  letterSpacing: '0.14em',
  textTransform: 'uppercase' as const,
  color: YELLOW,
  margin: '0 0 10px 0',
}

// Detail-row table styles for admin notification emails.
export const detailTable = {
  width: '100%',
  fontSize: '14px',
  borderCollapse: 'collapse' as const,
  margin: '0 0 20px 0',
  borderTop: `1px solid ${HAIRLINE}`,
}

export const detailLabel = {
  padding: '10px 0',
  color: FAINT,
  width: '140px',
  verticalAlign: 'top' as const,
  borderBottom: `1px solid ${HAIRLINE}`,
}

export const detailValue = {
  padding: '10px 0',
  color: CREAM,
  verticalAlign: 'top' as const,
  borderBottom: `1px solid ${HAIRLINE}`,
}

// Free-form text block (message/goals): a surface card that preserves line breaks.
export const longText = {
  color: CREAM,
  whiteSpace: 'pre-wrap' as const,
  lineHeight: '1.55',
  margin: '0',
  fontSize: '15px',
  backgroundColor: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderLeft: `4px solid ${YELLOW}`,
  borderRadius: '6px',
  padding: '16px 18px',
}

export const buttonSection = {
  margin: '24px 0',
}

// Yellow button, ink text: the site's .ds-btn--yellow.
export const primaryButton = {
  backgroundColor: YELLOW,
  color: INK,
  padding: '14px 24px',
  borderRadius: '4px',
  fontSize: '15px',
  fontWeight: '800' as const,
  textDecoration: 'none',
  display: 'inline-block',
}

export const secondaryButton = {
  backgroundColor: 'transparent',
  color: CREAM,
  padding: '12px 22px',
  borderRadius: '4px',
  fontSize: '14px',
  fontWeight: '700' as const,
  textDecoration: 'none',
  display: 'inline-block',
  border: `2px solid ${CREAM}`,
}

export const divider = {
  borderColor: HAIRLINE,
  margin: '32px 0 24px',
}

export const signature = {
  color: CREAM,
  fontSize: '15px',
  fontWeight: '700' as const,
  margin: '0 0 4px 0',
}

export const signatureLink = {
  margin: '0',
  fontSize: '14px',
}

export const link = {
  color: YELLOW,
  textDecoration: 'underline',
}

export const footer = {
  padding: '24px 0 0 0',
}

export const footerText = {
  color: FAINT,
  fontSize: '12px',
  lineHeight: '1.5',
  margin: '0 0 8px 0',
}
