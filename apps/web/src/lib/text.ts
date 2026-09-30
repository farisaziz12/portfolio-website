/**
 * Long CMS text for progressive disclosure: paragraphs (blank lines) keep
 * their single line breaks; sentences past `visible` are marked `extra` so
 * the page can fold them behind "Read more". The whole text always ships.
 */

export interface TextSegment {
  text: string;
  /** Beyond the first `visible` sentences: folded until the reader expands. */
  extra: boolean;
}

export interface TextParagraph {
  segments: TextSegment[];
  /** Every sentence in the paragraph is extra. */
  extra: boolean;
}

// A sentence ends at . ! ? (plus closing quotes/brackets) followed by space or the end.
const SENTENCE = /[^.!?]+(?:[.!?]+["”’)\]]*(?=\s|$)|$)\s*/g;

export function sentences(text: string): string[] {
  return (text.match(SENTENCE) ?? [text]).filter((s) => s.trim());
}

export function foldText(text: string | undefined, visible = 5): { paragraphs: TextParagraph[]; hasMore: boolean } {
  const paras = (text ?? '')
    .replace(/\r\n?/g, '\n')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  let seen = 0;
  const paragraphs = paras.map((p) => {
    const segments = sentences(p).map((s) => ({ text: s, extra: seen++ >= visible }));
    return { segments, extra: segments.every((s) => s.extra) };
  });
  return { paragraphs, hasMore: seen > visible };
}
