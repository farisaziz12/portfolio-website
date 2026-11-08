export const farisModes = ['auto', 'light', 'dark'] as const
export const farisBackgrounds = ['none', 'arc'] as const
export const farisCoverVariants = ['badge', 'editorial', 'speaker'] as const

export type FarisMode = (typeof farisModes)[number]
export type FarisBackground = (typeof farisBackgrounds)[number]
export type FarisCoverVariant = (typeof farisCoverVariants)[number]

export interface FarisResolvedConfig {
  mode: FarisMode
  background: FarisBackground
  coverVariant: FarisCoverVariant
}

export interface FarisSlideConfig {
  mode?: FarisMode
  background?: FarisBackground
  coverVariant?: FarisCoverVariant
}

const warnedValues = new Set<string>()

function isFarisMode(value: unknown): value is FarisMode {
  return typeof value === 'string' && farisModes.includes(value as FarisMode)
}

function isFarisBackground(value: unknown): value is FarisBackground {
  return typeof value === 'string' && farisBackgrounds.includes(value as FarisBackground)
}

function isCoverVariant(value: unknown): value is FarisCoverVariant {
  return typeof value === 'string' && farisCoverVariants.includes(value as FarisCoverVariant)
}

function warnInvalid(key: string, value: unknown, page: number): void {
  if (value === undefined)
    return

  const signature = `${key}:${String(value)}:${page}`
  if (warnedValues.has(signature))
    return

  warnedValues.add(signature)
  console.warn(`[slidev-theme-faris] Ignoring invalid ${key} value "${String(value)}" on slide ${page}.`)
}

export function resolveFarisConfig(
  themeConfig: Record<string, unknown> | undefined,
  slideConfig: FarisSlideConfig | undefined,
  page: number,
): FarisResolvedConfig {
  const deckMode = themeConfig?.farisMode
  const deckBackground = themeConfig?.farisBackground

  if (!isFarisMode(deckMode))
    warnInvalid('themeConfig.farisMode', deckMode, page)
  if (!isFarisBackground(deckBackground))
    warnInvalid('themeConfig.farisBackground', deckBackground, page)
  if (!isFarisMode(slideConfig?.mode))
    warnInvalid('faris.mode', slideConfig?.mode, page)
  if (!isFarisBackground(slideConfig?.background))
    warnInvalid('faris.background', slideConfig?.background, page)
  if (!isCoverVariant(slideConfig?.coverVariant))
    warnInvalid('faris.coverVariant', slideConfig?.coverVariant, page)

  return {
    coverVariant: isCoverVariant(slideConfig?.coverVariant) ? slideConfig.coverVariant : 'badge',
    mode: isFarisMode(slideConfig?.mode)
      ? slideConfig.mode
      : isFarisMode(deckMode)
        ? deckMode
        : 'auto',
    background: isFarisBackground(slideConfig?.background)
      ? slideConfig.background
      : isFarisBackground(deckBackground)
        ? deckBackground
        : 'none',
  }
}
