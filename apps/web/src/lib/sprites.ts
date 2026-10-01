/**
 * The cartoon Faris sprites organisers may use on event graphics, as is:
 * no flipping, recolouring or extra logos (the ZurichJS logo on the shirt
 * stays). Shown and offered for download on /press-kit.
 */
import farisSpeaking from '../assets/illustrations/faris-speaking.png';
import farisThinking from '../assets/illustrations/faris-thinking.png';

export const SPRITES = [
  { key: 'speaking', label: 'Speaking', alt: 'Cartoon Faris holding a microphone', image: farisSpeaking, file: 'faris-aziz-cartoon-speaking.png' },
  { key: 'thinking', label: 'Thinking', alt: 'Cartoon Faris thinking', image: farisThinking, file: 'faris-aziz-cartoon-thinking.png' },
] as const;

export type Sprite = (typeof SPRITES)[number];
