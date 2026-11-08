const illustrations = {
  'faris-speaking': {
    src: new URL('../assets/illustrations/faris-speaking.png', import.meta.url).href,
    alt: 'Faris speaking into a microphone', width: 1374, height: 1145,
  },
  'faris-thinking': {
    src: new URL('../assets/illustrations/faris-thinking.png', import.meta.url).href,
    alt: 'Faris thinking with a hand on his chin', width: 1306, height: 1205,
  },
  'duck-curious': {
    src: new URL('../assets/illustrations/duck-curious.png', import.meta.url).href,
    alt: 'The blue duck looking curious', width: 1199, height: 1312,
  },
  'duck-celebrating': {
    src: new URL('../assets/illustrations/duck-celebrating.png', import.meta.url).href,
    alt: 'The blue duck raising a wing', width: 1284, height: 1225,
  },
} as const

export type IllustrationName = keyof typeof illustrations

/** Unknown names stay explicit instead of becoming broken image URLs. */
export function resolveIllustration(name: string) {
  return Object.hasOwn(illustrations, name)
    ? illustrations[name as IllustrationName]
    : undefined
}
