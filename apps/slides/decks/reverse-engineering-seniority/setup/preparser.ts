// Word-level "magic move" for this deck, like Keynote.
// Every plain `# Heading` line becomes one span per word, named by the word and its
// occurrence on the slide. With `transition: view-transition`, a word that exists on
// both slides glides to its new place and size; the rest fade. Headings that already
// contain HTML (clicks, custom markup) are left alone.
import { definePreparserSetup } from '@slidev/types'

const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function key(word: string) {
  const letters = word.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]/g, '')
  if (letters) return letters
  return `s${Array.from(word).map(c => c.codePointAt(0)!.toString(16)).join('')}`
}

export function magicHeading(text: string) {
  const counts = new Map<string, number>()
  const words: string[] = []
  // `**bold**` runs may span several words; every word keeps its own name.
  text.split(/(\*\*[^*]+\*\*)/).filter(Boolean).forEach(run => {
    const bold = run.startsWith('**') && run.endsWith('**')
    for (const word of (bold ? run.slice(2, -2) : run).split(/\s+/).filter(Boolean)) {
      const k = key(word)
      const n = counts.get(k) ?? 0
      counts.set(k, n + 1)
      const body = bold ? `<strong>${escape(word)}</strong>` : escape(word)
      words.push(`<span class="magic-word" style="view-transition-name: mw-${k}-${n}">${body}</span>`)
    }
  })
  return `<h1 class="magic-words">${words.join(' ')}</h1>`
}

export default definePreparserSetup(() => [{
  name: 'seniority-magic-words',
  async transformSlide(content) {
    let fenced = false
    return content.split('\n').map(line => {
      if (line.startsWith('```')) fenced = !fenced
      const match = !fenced && /^# (?!.*[<>])(.+)$/.exec(line)
      return match ? magicHeading(match[1].trim()) : line
    }).join('\n')
  },
}])
