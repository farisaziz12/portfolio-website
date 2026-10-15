/** Stable grapheme identities, including repeated letters and combined emoji. */
export function characterKeys(text: string, group = '0', counts = new Map<string, number>()) {
  const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' })
  return Array.from(segmenter.segment(text), ({ segment }) => {
    const code = Array.from(segment).map(c => c.codePointAt(0)!.toString(16)).join('-')
    const count = counts.get(segment) ?? 0
    counts.set(segment, count + 1)
    return { text: segment, name: `caching-g${group}-${code}-${count}` }
  })
}
