---
name: add-email
description: Add a Resend transactional email and API route for faziz-dev.com. Use when creating a new form, notification, confirmation, or workshop email.
paths: apps/web/src/emails/**,apps/web/src/pages/api/**
---

# Add a Resend email

Spec: `apps/web/CLAUDE.md`. Do not skip it.

1. Create `apps/web/src/emails/MyEmail.tsx`. Copy `InviteConfirmationEmail.tsx` (submitter) or `InviteAdminEmail.tsx` (ops). Structure: terminal header → content → `— Faris` signature → footer.
2. Style only via `import * as s from './styles'`. New values go in `styles.ts` first (keep hex in sync with `global.css`).
3. Route in `apps/web/src/pages/api/`: import `sendOrLog` from `lib/email.ts`. Never `new Resend(...)`. Never `import.meta.env.RESEND_*`.
4. Critical vs best-effort: admin notification failure → 502. Confirmation failure → log only. Subscribe/audience writes: `Promise.allSettled`, don't block the response on audience errors.
5. Audience IDs: server-side Sanity lookup only.
6. No `mailto:` in site UI that collects this email. Forms stay islands posting to the route.
7. Update the tables in `apps/web/CLAUDE.md` in the same PR.

Preview with React Email if you have it; otherwise screenshot the rendered HTML. Still follow `agent-pr-visual-evidence` (emails are a visual surface).
