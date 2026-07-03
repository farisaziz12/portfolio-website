# Measurement: PostHog funnels & events

The site emits a small, deliberate set of PostHog events. This doc is the
single reference for what fires where, and the funnels/insights worth building
in the PostHog UI (they can't be created from code).

## Events

| Event | Fires when | Properties |
|---|---|---|
| `cta_click` | Any element with `data-track` is clicked (document-level listener in `BaseLayout`) | `cta` (slug, e.g. `header-cta`, `contact-door`, `contact-panel-primary`, `talk-stickybar`, `megamenu-invite`, `megamenu-discovery-call`), `label`, `href`, `path` |
| `invite_form_submitted` | Speaker invite form success (`/invite`) | `format` |
| `mentorship_inquiry_submitted` | Mentorship inquiry success (`/mentorship`) | — |
| `contact_form_submitted` | General contact form success (`/contact`) | `topic` (`role` / `speaking` / `consulting` / `mentorship` / `other`) |
| `discovery_call_opened` | A cal.com link opened as the on-site modal | `path` |
| `$pageview` etc. | PostHog defaults | — |

## Funnels to build (PostHog UI)

1. **Speaking:** `$pageview` (any) → `cta_click` where `cta ∈ {header-cta, megamenu-invite, contact-panel-primary, talk-stickybar}` → `$pageview` of `/invite` → `invite_form_submitted`. Break down by first-touch `path` and by referrer.
2. **Consulting:** `$pageview` of `/consulting` or `/services` → `discovery_call_opened`. (The booking itself completes inside cal.com — reconcile counts against cal.com's dashboard monthly.)
3. **Mentorship:** `$pageview` of `/mentorship` → `mentorship_inquiry_submitted`.
4. **Hiring / general:** `cta_click` where `cta = contact-door` (breakdown by `label`) → `contact_form_submitted` (breakdown by `topic`).

## Insights worth pinning

- `cta_click` breakdown by `cta` — which surfaces actually drive action (mega-menu vs footer vs panels vs sticky bar vs terminal-adjacent CTAs).
- `contact_form_submitted` by `topic` over time — is the full-time-role door pulling?
- Referrer breakdown filtered to AI surfaces (`chatgpt.com`, `perplexity.ai`, `claude.ai`, `copilot.microsoft.com`) — low volume, disproportionate intent; watch conversion rate per source.
- Session recordings: enable **only** for `/invite`, `/contact`, `/consulting`, `/mentorship` (conversion pages), and watch a handful weekly for friction.

## Cadence

Review funnels ~4 weeks after deploy, then monthly. Let the data pick the next
experiment (e.g. door copy variants, form field order) instead of intuition.
The events are intentionally few — add a new one only when a decision depends
on it, and document it here.
