# Measurement: PostHog funnels & events

The site emits a small, deliberate set of PostHog events. This doc is the
single reference for what fires where, and the funnels/insights worth building
in the PostHog UI (they can't be created from code).

## Architecture

- `apps/web/src/components/posthog.astro` — loader, init config, session-recording
  gate, and the sitewide auto-events (`cta_click`, `outbound_link_click`,
  `scroll_depth`).
- `apps/web/src/lib/analytics.ts` — typed `track()` / `identify()` /
  `trackFormStarted()` wrappers used by React islands. The `AnalyticsEvent`
  union there is the canonical event list; keep it in sync with this doc.
- Key/host come from `PUBLIC_POSTHOG_KEY` / `PUBLIC_POSTHOG_HOST` env vars,
  falling back to the production EU project. Capture is disabled on
  `localhost` so dev never pollutes prod data.

### Init config highlights

- `defaults: '2025-05-24'` — history-change pageviews (works with Astro
  ViewTransitions), autocapture, heatmaps, rageclicks.
- `person_profiles: 'identified_only'` — anonymous visitors are event-only
  (cheaper); a person profile is created the moment a form identifies them.
- `capture_pageleave`, `capture_dead_clicks`, `capture_exceptions` (error
  tracking) are on.
- Super-property `theme` (`dark`/`light`) is registered on every event and
  updated on the `themechange` custom event.

## Identify

Identification happens at two moments:

1. **As soon as an email is entered.** A document-level `focusout` listener in
   `posthog.astro` watches every `input[type="email"]` sitewide: blur a field
   containing a valid address and the visitor is identified immediately (and
   `email_entered` fires) — even if they abandon the form one field later.
2. **On successful submit.** The islands call `identify(email, props)` again
   to enrich the same person with what the form learned: `name`, plus
   form-specific props (`company`, `last_contact_topic`, `last_invite_event`,
   `newsletter_subscriber`, `workshop_attendee`).

The lowercased email is the distinct ID in both cases, so the same person
converges across devices, forms, and visits.

## Session recording

Recording is initialized **disabled** and started only when a pageview hits a
conversion page: `/invite`, `/contact`, `/consulting`, `/mentorship` (path or
sub-path). Once started it keeps recording for the rest of the session, so you
see what happens *after* the conversion page too. All inputs are masked
(`maskAllInputs: true`); mask any other sensitive element with a
`data-ph-mask` attribute. To record site-wide, edit `RECORD_PATHS` in
`posthog.astro` (and remember recording must also be enabled in the PostHog
project settings).

## Events

| Event | Fires when | Properties |
|---|---|---|
| `cta_click` | Any element with `data-track` is clicked (document-level listener) | `cta` (slug, e.g. `header-cta`, `contact-door`, `contact-panel-primary`, `talk-stickybar`, `megamenu-invite`, `megamenu-discovery-call`), `label`, `href`, `path` |
| `invite_form_submitted` | Speaker invite form success (`/invite`) | `format`, `audience_size`, `event`, `has_date`, `has_location` |
| `mentorship_inquiry_submitted` | Mentorship inquiry success (`/mentorship`) | `budget`, `currency`, `timeline`, `cadence` |
| `contact_form_submitted` | General contact form success (`/contact`) | `topic` (`role` / `speaking` / `consulting` / `mentorship` / `other`), `has_company`, `message_length` |
| `newsletter_subscribed` | Conference-schedule subscribe success | `source`, `placement` (`compact` / `card`) |
| `workshop_signed_up` | Workshop attend gate completed | `workshop`, `instance` |
| `discovery_call_opened` | A cal.com link opened as the on-site modal | `path` |
| `email_entered` | A valid email is blurred in any email field (also identifies the visitor) | `path`, `field` |
| `form_started` | First interaction with a form (once per page lifetime) | `form` (`contact` / `invite` / `mentorship`) |
| `form_validation_failed` | Client-side validation blocked a submit | `form`, `fields` (which failed) |
| `form_submit_failed` | Server error or network failure on submit | `form`, `reason` (`server` / `network`), `status` |
| `scroll_depth` | 25/50/75/100% scroll milestones, once per pageview | `depth`, `path` |
| `outbound_link_click` | Click on an external link (cal.com excluded) | `href`, `domain`, `label`, `path` |
| `terminal_command` | A command is executed in the hero/404 terminal | `command`, `known`, `mode` |
| `command_palette_opened` | ⌘K palette opened | `path` |
| `command_palette_action` | A palette command is run | `command`, `group`, `href` |
| `$pageview`, `$pageleave`, `$autocapture`, `$exception`, … | PostHog defaults | — |

## Funnels to build (PostHog UI)

1. **Speaking:** `$pageview` (any) → `cta_click` where `cta ∈ {header-cta, megamenu-invite, contact-panel-primary, talk-stickybar}` → `$pageview` of `/invite` → `form_started` (`form=invite`) → `invite_form_submitted`. Break down by first-touch `path` and by referrer.
2. **Consulting:** `$pageview` of `/consulting` or `/services` → `discovery_call_opened`. (The booking itself completes inside cal.com — reconcile counts against cal.com's dashboard monthly.)
3. **Mentorship:** `$pageview` of `/mentorship` → `form_started` (`form=mentorship`) → `mentorship_inquiry_submitted`.
4. **Hiring / general:** `cta_click` where `cta = contact-door` (breakdown by `label`) → `form_started` (`form=contact`) → `contact_form_submitted` (breakdown by `topic`).

The `form_started` step is the abandonment probe: a big drop between
`form_started` and `*_submitted` means friction inside the form — go watch
the session recordings for that page.

## Insights worth pinning

- `cta_click` breakdown by `cta` — which surfaces actually drive action (mega-menu vs footer vs panels vs sticky bar vs terminal-adjacent CTAs).
- `contact_form_submitted` by `topic` over time — is the full-time-role door pulling?
- `form_validation_failed` by `fields` — a recurring field points at confusing copy or layout.
- `email_entered` with no `*_submitted` in the same session — identified warm leads who bailed mid-form; the session recording shows why.
- `scroll_depth` ≥75 on `/talks`, `/consulting`, `/mentorship` — is the long-form content read or skipped?
- `outbound_link_click` by `domain` — where the site leaks attention (GitHub, LinkedIn, YouTube…).
- `terminal_command` where `known = false` — what people *try* to type is a feature wishlist.
- Referrer breakdown filtered to AI surfaces (`chatgpt.com`, `perplexity.ai`, `claude.ai`, `copilot.microsoft.com`) — low volume, disproportionate intent; watch conversion rate per source.
- Session recordings on `/invite`, `/contact`, `/consulting`, `/mentorship` (the gate only records these) — watch a handful weekly for friction.
- Error tracking (`$exception`) — a spike after a deploy is a regression on a real visitor's browser.

## Cadence

Review funnels ~4 weeks after deploy, then monthly. Let the data pick the next
experiment (e.g. door copy variants, form field order) instead of intuition.
The events are intentionally few — add a new one only when a decision depends
on it, add it to `AnalyticsEvent` in `lib/analytics.ts`, and document it here.
