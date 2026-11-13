# Reverse Engineering Seniority: sources

Source: `Reverse_Engineering_Seniority-compressed.pdf`, 98 pages at 1920x1080. Per-page text and the hash of every
output image are in `migration/source.json`. The PDF has no presenter notes, so the deck has none: do not invent them.

## Wording changed during migration

Typos and casing only. `scripts/seniority-migration.test.mjs` fails if any other on-slide text drifts from the PDF.

| Slide | PDF | Deck |
|---|---|---|
| 20 | Trust You With Decision That Could Impact | Trust You With Decisions That Could Impact |
| 35, 36 | Good at | Good At |
| 49-52 | System(S), Team(S) | System(s), Team(s) |
| 57 | What if I Work Work With an Unmotivated Team? | What if I Work With an Unmotivated Team? |
| 71 | Only as Valuable as Intention With Which | Only as Valuable as the Intention With Which |
| 85 | Dependancies | Dependencies |

## Images and redactions

The repo is public and published decks are served from faziz-dev.com, so anything readable on a slide is public.

| Slide | File | Treatment |
|---|---|---|
| 9 | google-seniority-definition.jpg | As in source |
| 13 | childhood-laptop.jpg | As in source |
| 14 | github-joined.jpg | As in source |
| 17 | crossfit-coaching.jpg | As in source. Other people are identifiable; it was already on stage. |
| 24 | bootcamp-admission-email.jpg | Flatiron admissions officer's email address covered with a black box |
| 30 | bootcamp-schedule-app.jpg | As in source (the source already blacks out an email field) |
| 38 | confidence-competence-curve.jpg | As in source. Origin of the chart is not recorded. |
| 42 | speaking-topics-email.jpg | Email body pixelated: it is a hiring-process email |
| 43 | (text) | Rebuilt as real text from the source screenshot. The interviewer's name is replaced by a redaction bar. |
| 47, 53, 54 | seniority-axes*.jpg | As in source. Origin of the five-axis model is not recorded. |
| 63 | one-on-one-notes.jpg | Document body pixelated: internal Smallpdf 1:1 notes (payments providers, experiments, people) |
| 98 | community-collage.jpg, linkedin-qr.png | Collage as in source. QR regenerated as a crisp PNG from the decoded source QR, same target: https://www.linkedin.com/in/farisaziz12/ |

Unredacted originals were not copied into the repo. To restore one, re-extract it from the PDF and accept that it becomes public.

## Claims to check before the next delivery

- 1: byline says Staff Software Engineer at Smallpdf. It changes after the move to Netlify in December 2026.
- 39: Adam Murray quotation. No source recorded.
- 38, 47: the confidence curve and the five-axis radar. Credit them if they are not Faris's own.
