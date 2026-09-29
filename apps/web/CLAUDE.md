# apps/web — Email subsystem

> Agent entrypoint: [`AGENTS.md`](../../AGENTS.md). This file is the Resend/email spec — keep it in sync with the code.

Everything that sends mail goes through Resend. This file documents the architecture, env-var setup, design tokens, and the recipe for adding a new email. Keep this file in sync with the code; if you change a route or template, update the relevant section.

---

## Policy: no `mailto:` links

Every contact path on the site goes through a Resend-backed form (`InviteForm`,
`MentorshipInquiryForm`, `ContactForm`) — never a raw `mailto:`. The only
`mailto:` allowed in the codebase is inside admin email templates (so Faris can
reply to a submitter from his inbox).

## Architecture

```
Contact form (React island)
  → POST /api/<route>
    → lib/email.ts  (Resend singleton + env() + sendOrLog wrapper)
      → Resend
```

The email routes, each in `src/pages/api/`:

| Route | Method | Sends | Critical-path? |
|---|---|---|---|
| `/api/invite` | POST | Admin notification (`InviteAdminEmail`) + submitter confirmation (`InviteConfirmationEmail`). Body: `kind` (`conference` · `podcast` · `workshop` · `panel` · `article` · `other`, see `lib/invite-kinds.ts`; legacy `format` accepted), `name`, `email`, `what` (required) + `when`, `audience`, `message`. | Admin = critical: 200 `{ ok, ref, confirmationSent }` only once Resend accepted it, else 502 `delivery-failed`. Missing email env → 503 `not-configured` (never a silent success). 400 `invalid` with `fields`. Confirmation = best-effort (`confirmationSent`). |
| `/api/mentorship` | POST | Admin notification (`MentorshipAdminEmail`) + submitter confirmation (`MentorshipConfirmationEmail`). Body: `name`, `email`, `goals` (required) + `currency`, `budget`, `timeline`, `cadence`, `message`. | Admin = critical: 200 `{ ok, ref, confirmationSent }` only once Resend accepted it, else 502 `delivery-failed`. Missing email env → 503 `not-configured` (never a silent success). 400 `invalid` with `fields`. Confirmation = best-effort (`confirmationSent`). |
| `/api/contact` | POST | Admin notification (`ContactAdminEmail`) + submitter confirmation (`ContactConfirmationEmail`). General contact incl. full-time-role inquiries. Body: `email`, `message` (required) + `name`, `topic` (`role` · `speaking` · `press` · `consulting` · `mentorship` · `other`), `company`. | Same contract as `/api/invite` (200 with `ref` only after Resend accepted the admin email; 503 / 502 / 400 otherwise). |
| `/api/workshop/subscribe` | POST | `WorkshopWelcomeEmail` (source=`workshop-attend`) **or** `GeneralSubscribeConfirmEmail` (source=`website`); also writes to Resend audience(s) | All best-effort — `Promise.allSettled` so audience-write or email failures never block the response. Workshop-attend looks up the instance by **access token** (`instanceToken` / legacy `instanceSlug` value). |
| `/api/workshop/session` | GET/POST | Sets signed `workshop_session` cookie on POST (gate); GET resumes session for a token | Cookie HMAC via `WORKSHOP_SESSION_SECRET` (falls back to `ADMIN_PASSWORD`). |
| `/api/workshop/section` | GET | Lazy-load one section body (`token` + `sectionKey`) | Public CDN read; attend page ships schedule metadata only. |
| `/api/workshop/follow-up` | POST | `WorkshopFollowUpEmail` to all contacts in a workshop instance's Resend audience | Admin-protected (`Authorization: Bearer $ADMIN_PASSWORD` **or** signed `admin_session` cookie from `/admin`). |

**Two-stage send pattern** (used by `/api/invite`, `/api/mentorship`, and `/api/contact`; shared helpers in `src/lib/inquiry.ts`):
0. If `isEmailConfigured()` is false, return **503 `{ error: 'not-configured' }`**. Nothing was stored, so the form must not say it was.
1. Send the admin notification first. This is the "durable storage" step: the inquiry only counts as stored once Resend accepted it. If it fails, return **502 `{ error: 'delivery-failed' }`**.
2. Send the submitter confirmation. If that fails, just log it and report `confirmationSent: false` — the submission still made it to the admin inbox.
3. Return **200 `{ ok: true, ref, confirmationSent }`** where `ref` is `FA-<yymmdd>-<4 chars>` (`inquiryRef()`), also written into the admin email subject/body so Faris can match a reply to a reference.

**Form contract** (`InviteForm`, `ContactForm`, `MentorshipInquiryForm`): show the success state ONLY on a 200 with `ok` and `ref`. Every other outcome (400, 502, 503, network error) shows the failed state ("nothing was stored") and keeps the entered text so the visitor can retry.

**Audience writes** (subscribe route): contacts go to the global audience (`RESEND_AUDIENCE_ID`) *and* the per-workshop audience (`workshopInstance.resendAudienceId` in Sanity) when both are set. The Sanity lookup happens server-side — never trust a client-supplied audience ID.

---

## Environment variables

All env reads go through `env(key)` in `src/lib/email.ts`. It checks `process.env` first (the only place Vercel exposes non-public vars at runtime in serverless functions), then falls back to `import.meta.env` (which works for `astro dev`). **Do not** read `import.meta.env.RESEND_*` directly — it inlines at build time and ends up `undefined` in production.

| Var | Required? | Used by | Notes |
|---|---|---|---|
| `RESEND_API_KEY` | ✅ | all email routes | Format `re_*`. Without it, the inquiry routes return 503 `not-configured` and the forms show their failed state (see Gotchas). |
| `RESEND_FROM_EMAIL` | ✅ | all email routes | A plain email address (no display name — the routes add their own label). Must be on a domain you've verified in Resend. |
| `RESEND_AUDIENCE_ID` | ⬜ optional | `/api/workshop/subscribe` | Global audience that every workshop subscriber joins, regardless of instance. |
| `INVITE_INBOX` | ⬜ optional | `/api/invite` | Override the destination inbox. Defaults to `faris@zurichjs.com`. |
| `MENTORSHIP_INBOX` | ⬜ optional | `/api/mentorship` | Falls back to `INVITE_INBOX`, then `faris@zurichjs.com`. |
| `CONTACT_INBOX` | ⬜ optional | `/api/contact` | Falls back to `INVITE_INBOX`, then `faris@zurichjs.com`. |
| `ADMIN_PASSWORD` | ✅ for follow-up + `/admin` | `/api/workshop/follow-up`, `/admin`, cookie HMAC fallback | Pass as `Authorization: Bearer $ADMIN_PASSWORD` to the follow-up route. |
| `WORKSHOP_SESSION_SECRET` | ⬜ optional | Workshop + admin signed cookies | Falls back to `ADMIN_PASSWORD` when unset. |

### Setup checklist

1. **Local dev** — create `apps/web/.env.local` with at minimum:
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxx
   RESEND_FROM_EMAIL=noreply@faziz-dev.com
   ```
2. **Resend dashboard** — verify the sending domain (e.g. `faziz-dev.com`) at <https://resend.com/domains>. Add the SPF / DKIM / DMARC records they generate to your DNS provider. The FROM mailbox doesn't have to actually exist — Resend treats it as a sender identity.
3. **Vercel** — set both vars on **Production** and **Preview** environments. Vercel build logs won't catch a missing var; the forms will simply fail (503) at runtime. Verify after deploy by submitting a real form and checking you get a reference number.
4. **Optional** — if you maintain multiple inboxes, set `INVITE_INBOX` / `MENTORSHIP_INBOX` on Preview deploys so test submissions don't pollute prod inbox.
5. **Verify** — `isEmailConfigured()` (exported from `lib/email.ts`) returns `false` when either core var is missing. In that state the inquiry routes return HTTP 503 `{ error: 'not-configured' }` and log `not configured … NOT stored`. Watch for that string in logs.

---

## Templates

All templates live in `src/emails/` and use `@react-email/components`. They share styling via `src/emails/styles.ts`, which is the single source of truth for email visual design.

| File | Triggered from | Role |
|---|---|---|
| `InviteAdminEmail.tsx` | `/api/invite` | Notification to Faris with event details |
| `InviteConfirmationEmail.tsx` | `/api/invite` | "Thanks, I'll reply in 2 days" to submitter |
| `MentorshipAdminEmail.tsx` | `/api/mentorship` | Notification to Faris with inquiry details |
| `MentorshipConfirmationEmail.tsx` | `/api/mentorship` | "Thanks, I'll reply in 2 days" to submitter |
| `ContactAdminEmail.tsx` | `/api/contact` | Notification to Faris with topic/company/message (general contact + hiring) |
| `ContactConfirmationEmail.tsx` | `/api/contact` | "Thanks, I'll reply in 2 days" to submitter |
| `WorkshopWelcomeEmail.tsx` | `/api/workshop/subscribe` (workshop-attend) | "You're in — here are materials" |
| `GeneralSubscribeConfirmEmail.tsx` | `/api/workshop/subscribe` (website) | "You're on the list" |
| `WorkshopFollowUpEmail.tsx` | `/api/workshop/follow-up` | Post-workshop feedback request |

### Design tokens

`src/emails/styles.ts` mirrors Design System v2 from `src/styles/global.css`. Email clients don't support CSS variables, so values are hex literals — keep both in sync when the palette changes.

| Token | Hex | Used for |
|---|---|---|
| `--bg` | `#0A0C10` | Page/body background |
| `--surface-1` | `#151A23` | Terminal header, raised cards |
| `--ink` | `#F3F5F8` | Headings, bold body |
| `--ink-muted` | `#A9B4C2` | Body text |
| `--ink-faint` | `#6A7686` | Footer, labels, kickers |
| `--edge` | `#232B36` | Borders, dividers |
| `--edge-strong` | `#34404F` | Secondary button border |
| `--accent` | `#3D7BFF` | Primary button background |
| `--accent-bright` | `#6AA1FF` | Links, terminal command text |

**Fonts:** Space Grotesk (headings) → Hanken Grotesk (body) → IBM Plex Mono / JetBrains Mono (terminal/kicker). All declared with fallbacks because email clients won't load webfonts.

**Structure rhythm** every template follows:
1. **Terminal header** — `● ● ●` dots + `$ ack <slug>` command + one-line status output. Sets the brand voice.
2. **Content** — `Kicker` (mono uppercase eyebrow, admin emails only) → `Heading` → body paragraphs/tables/buttons.
3. **Signature + footer** — `— Faris` line + faziz-dev.com link + footer disclaimer.

---

## Adding a new email

1. Create `src/emails/MyNewEmail.tsx`. Import `@react-email/components` primitives and styles via `import * as s from './styles'`.
2. Mirror the terminal-header → content → signature → footer structure of an existing template (start by copying `InviteConfirmationEmail.tsx` for submitter-facing, or `InviteAdminEmail.tsx` for ops-facing).
3. Use only style objects from `styles.ts`. If you need a value that isn't there, add it to `styles.ts` first — never hard-code hex in templates.
4. In your API route, import `sendOrLog` from `../../lib/email` (don't `new Resend(...)` directly). Pass `context` so log lines are scoped (e.g. `'invite:confirm'`).
5. Decide explicitly: is this email critical? If yes, check `outcome.ok` and return 502 on failure. If best-effort, just `await` and move on.

---

## Gotchas

- **`process.env` first, `import.meta.env` second** (`lib/email.ts`). Vercel inlines `import.meta.env` at build time for non-public vars — they're `undefined` at runtime. The `env()` helper handles this; don't bypass it. See in-code comment in `lib/email.ts`.
- **Missing email config is a failure, not a success (V3).** When `RESEND_API_KEY` or `RESEND_FROM_EMAIL` is missing, `/api/invite`, `/api/contact` and `/api/mentorship` return HTTP 503 `{ error: 'not-configured' }` and the forms show "That didn't go through, and nothing was stored." with the text retained. The old silent `{ success: true, warning: 'email-disabled' }` 200 is gone: it showed visitors a success screen for inquiries that were never delivered. Locally (no `.env.local`) this means the forms always fail; to see the accepted state, add real Resend vars or intercept the route in a test (`page.route('**/api/invite', …)` fulfilling `{ ok: true, ref: 'FA-…' }`). `/api/workshop/subscribe` returns 500 when the API key is missing.
- **Success = Resend accepted the admin notification.** There is no database; the admin email is the store. Never return 200/`ok` before `sendOrLog` for the admin email resolved `ok: true`, and never render a success state on a timer or optimistic update.
- **Sanity audience lookups stay server-side.** `workshopInstanceByTokenQuery` (attend) / `workshopInstanceBySlugQuery` (follow-up) are the sanctioned lookups. Never accept an audience ID from the request body.
- **React Email doesn't support CSS variables.** Keep hex literals in `styles.ts`. If you reference a token in a template via inline `style`, import the constant from styles (`s.inkStrong`), don't paste the hex.
- **Resend domain verification is non-optional.** Until SPF/DKIM/DMARC all show "Verified" in the Resend dashboard, every send fails. Verify after any DNS change.
- **Don't include a display name in `RESEND_FROM_EMAIL`.** The routes wrap it themselves: `Invite Form <${RESEND_FROM_EMAIL}>` etc. If you put `"Faris" <foo@x>` in the env var, the result is `Invite Form <"Faris" <foo@x>>` and Resend rejects it.

---

## Operating `/api/workshop/follow-up`

Admin-protected. Call from CLI:

```sh
curl -X POST https://faziz-dev.com/api/workshop/follow-up \
  -H "Authorization: Bearer $ADMIN_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"instanceSlug":"<workshop-instance-slug>","feedbackUrl":"https://forms.gle/...","dryRun":true}'
```

`dryRun: true` returns the list of recipients without sending — always use it first on a new audience. Remove the flag to actually send. Response is `{ sent, failed, total }`.

Requirements: the workshop instance must have `resendAudienceId` set in Sanity, and the audience must have at least one non-unsubscribed contact.
