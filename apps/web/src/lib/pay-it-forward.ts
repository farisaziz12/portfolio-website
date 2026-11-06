/**
 * /pay-it-forward: one-off 15-minute chats. Copy approved by Faris (Paper
 * "Pay it forward" page); the booking link lives on the ZurichJS Cal.com
 * account. Booking questions (LinkedIn, what you've tried, what you want out
 * of it) are configured on the Cal.com event type, not here.
 */

export const PAY_IT_FORWARD_CAL = 'https://cal.com/faris-aziz-zurichjs/pay-it-forward';
/** Path form for the inline embed (Cal("inline", { calLink })). */
export const PAY_IT_FORWARD_CAL_LINK = 'faris-aziz-zurichjs/pay-it-forward';

export const PAY_IT_FORWARD_COPY = {
  kicker: 'Open calendar',
  title: 'My calendar is open.',
  lede: "A one-off 15-minute chat. Come with a clear idea of what you want out of it, and I'll give you some thoughts from my own experience.",
  isntTitle: "What this isn't",
  isntBody:
    "CV reviews, mock interviews or introductions. Handing me your CV won't be the most useful 15 minutes. Chatting through what you've tried will be.",
  longerTitle: 'Want something longer?',
  longerBody: 'I also do longer-term mentoring.',
  close: "Let's keep paying it forward.",
};

export interface Starter {
  title: string;
  line: string;
  /** Omitted when there is nothing to bring. */
  bring?: string;
}

/** Titles match the options of the Cal.com "What would help most?" (`topic`) field, so a card prefills it. */
export const STARTERS: Starter[] = [
  { title: "What you've tried", line: "Chat through what's working and what isn't.", bring: "three things you've tried that haven't worked" },
  {
    title: 'Getting more visible',
    line: 'Your portfolio, your profile, how people find your work.',
    bring: "what you've already tried, so I can give you the right signal rather than what you've already heard",
  },
  { title: 'Where to look', line: "No cold introductions, but I'll help you work out how to make them and where to look.", bring: 'the kind of place you want to end up' },
  { title: 'Public speaking', line: 'Getting on stage, writing a CFP, your first talk.', bring: 'the idea you keep putting off' },
  { title: 'Meetups and community', line: 'Organising meetups and building community spaces.', bring: "what you're starting or running" },
];

/** Cal.com link with the topic field prefilled (the site's modal handler passes query params as prefill). */
export function starterHref(s: Pick<Starter, 'title'>): string {
  return `${PAY_IT_FORWARD_CAL}?topic=${encodeURIComponent(s.title)}`;
}
