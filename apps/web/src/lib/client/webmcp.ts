/**
 * Chrome WebMCP Imperative API — progressive enhancement.
 * Feature-detects document.modelContext; no-ops when unsupported.
 * @see https://developer.chrome.com/docs/ai/webmcp
 */

import { WEBMCP_PREFILL } from '../webmcp-prefill';
import { openDiscoveryCall } from './cal';
import { setFilterState } from './filters';

export { WEBMCP_PREFILL };

type Intent = 'speaking' | 'consulting' | 'mentorship' | 'contact' | 'press';

interface WebMcpCtx {
  shortBio: string;
  discoveryCallUrl: string;
}

let session: AbortController | null = null;

function modelContext(): ModelContext | undefined {
  return document.modelContext ?? navigator.modelContext;
}

function ctxFromDom(): WebMcpCtx {
  const el = document.getElementById('webmcp-ctx');
  return {
    shortBio: el?.dataset.bio ?? '',
    discoveryCallUrl: el?.dataset.discovery ?? '',
  };
}

function inquiryForm(): HTMLFormElement | null {
  return document.querySelector<HTMLFormElement>(
    'form[data-form="invite"], form[data-form="contact"], form[data-form="mentorship"]',
  );
}

async function register(
  mc: ModelContext,
  signal: AbortSignal,
  tool: WebMCPToolDefinition,
): Promise<void> {
  await mc.registerTool(tool, { signal });
}

async function registerSitewide(mc: ModelContext, signal: AbortSignal, ctx: WebMcpCtx): Promise<void> {
  await register(mc, signal, {
    name: 'route_intent',
    description:
      'Send the visitor to the right booking door: speaking invite, consulting discovery call, mentorship apply, general contact, or press kit.',
    inputSchema: {
      type: 'object',
      properties: {
        intent: {
          type: 'string',
          enum: ['speaking', 'consulting', 'mentorship', 'contact', 'press'],
          description: 'What the visitor wants to do.',
        },
      },
      required: ['intent'],
    },
    annotations: { readOnlyHint: false, consequentialHint: false },
    execute: async ({ intent }) => {
      const i = intent as Intent;
      if (i === 'speaking') {
        location.assign('/invite');
        return 'Opening the speaker invite form.';
      }
      if (i === 'mentorship') {
        location.assign('/mentorship');
        return 'Opening mentorship.';
      }
      if (i === 'contact') {
        location.assign('/contact');
        return 'Opening contact.';
      }
      if (i === 'press') {
        location.assign('/press-kit');
        return 'Opening the press kit.';
      }
      // consulting → discovery call when configured, else services
      if (ctx.discoveryCallUrl) {
        openDiscoveryCall(ctx.discoveryCallUrl);
        return 'Opened the discovery-call modal.';
      }
      location.assign('/services');
      return 'Opening services (no discovery call URL configured).';
    },
  });

  await register(mc, signal, {
    name: 'get_short_bio',
    description: 'Return Faris Aziz short bio for press, intros, or speaker blurbs.',
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: true },
    execute: async () => ctx.shortBio || 'Short bio is not available on this page.',
  });

  if (ctx.discoveryCallUrl) {
    await register(mc, signal, {
      name: 'open_discovery_call',
      description:
        'Open the on-site Cal.com discovery-call booking modal. Use for consulting intros and short calls.',
      inputSchema: { type: 'object', properties: {} },
      annotations: { readOnlyHint: false, consequentialHint: true },
      execute: async () => {
        openDiscoveryCall(ctx.discoveryCallUrl);
        return 'Discovery-call modal opened.';
      },
    });
  }
}

async function registerFilters(mc: ModelContext, signal: AbortSignal): Promise<void> {
  const root = document.querySelector<HTMLElement>('[data-filter-root]');
  if (!root) return;
  await register(mc, signal, {
    name: 'filter_catalogue',
    description:
      'Filter the visible catalogue (talks, events, writing, etc.) by a filter key and value, or reset all filters.',
    inputSchema: {
      type: 'object',
      properties: {
        reset: { type: 'boolean', description: 'When true, clear all filters.' },
        key: { type: 'string', description: 'Filter key, e.g. topic, role, year.' },
        value: { type: 'string', description: 'Filter value, or "all" to clear that key.' },
      },
    },
    annotations: { readOnlyHint: true },
    execute: async ({ reset, key, value }) => {
      if (reset || (!key && !value)) {
        const result = setFilterState(root, {}, true);
        return `Filters reset. Showing ${result.shown} of ${result.total}.`;
      }
      if (typeof key !== 'string' || typeof value !== 'string') {
        return 'Provide key and value, or set reset to true.';
      }
      const result = setFilterState(root, { [key]: value }, false);
      return `Filtered ${key}=${value}. Showing ${result.shown} of ${result.total}.`;
    },
  });
}

async function registerInvite(mc: ModelContext, signal: AbortSignal): Promise<void> {
  const form = document.querySelector<HTMLFormElement>('form[data-form="invite"]');
  if (!form) return;
  await register(mc, signal, {
    name: 'prefill_speaker_invite',
    description:
      'Prefill the speaker invite form. Does not submit. Use submit_visible_inquiry after the visitor confirms.',
    inputSchema: {
      type: 'object',
      properties: {
        kind: {
          type: 'string',
          enum: ['conference', 'podcast', 'workshop', 'panel', 'article', 'other'],
        },
        name: { type: 'string' },
        email: { type: 'string' },
        what: { type: 'string', description: 'Event, show, or topic line.' },
        when: { type: 'string' },
        audience: { type: 'string' },
        message: { type: 'string' },
      },
    },
    annotations: { readOnlyHint: false },
    execute: async (input) => {
      form.dispatchEvent(new CustomEvent(WEBMCP_PREFILL, { detail: input }));
      return 'Invite form prefilled. Ask the visitor to review, then call submit_visible_inquiry.';
    },
  });
}

async function registerContact(mc: ModelContext, signal: AbortSignal): Promise<void> {
  const form = document.querySelector<HTMLFormElement>('form[data-form="contact"]');
  if (!form) return;
  await register(mc, signal, {
    name: 'prefill_contact',
    description:
      'Prefill the general contact form. Does not submit. Use submit_visible_inquiry after review.',
    inputSchema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        message: { type: 'string' },
        topic: {
          type: 'string',
          enum: ['role', 'speaking', 'press', 'consulting', 'mentorship', 'other'],
        },
      },
    },
    annotations: { readOnlyHint: false },
    execute: async (input) => {
      form.dispatchEvent(new CustomEvent(WEBMCP_PREFILL, { detail: input }));
      return 'Contact form prefilled. Ask the visitor to review, then call submit_visible_inquiry.';
    },
  });
}

async function registerMentorship(mc: ModelContext, signal: AbortSignal): Promise<void> {
  const form = document.querySelector<HTMLFormElement>('form[data-form="mentorship"]');
  if (!form) return;
  await register(mc, signal, {
    name: 'prefill_mentorship',
    description:
      'Prefill the mentorship inquiry form. Does not submit. Use submit_visible_inquiry after review.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
        goals: { type: 'string' },
        currency: { type: 'string', enum: ['chf', 'eur', 'usd'] },
        budget: { type: 'string', enum: ['s', 'm', 'l', 'xl', 'flex'] },
        timeline: { type: 'string', enum: ['asap', 'soon', 'exploring'] },
        cadence: { type: 'string', enum: ['weekly', 'biweekly', 'monthly', 'open'] },
        message: { type: 'string' },
      },
    },
    annotations: { readOnlyHint: false },
    execute: async (input) => {
      form.dispatchEvent(new CustomEvent(WEBMCP_PREFILL, { detail: input }));
      return 'Mentorship form prefilled. Ask the visitor to review, then call submit_visible_inquiry.';
    },
  });
}

async function registerSubmit(mc: ModelContext, signal: AbortSignal): Promise<void> {
  if (!inquiryForm()) return;
  await register(mc, signal, {
    name: 'submit_visible_inquiry',
    description:
      'Submit the visible invite, contact, or mentorship form after the visitor has reviewed the fields. Sends email via the site forms; requires confirmation.',
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: false, consequentialHint: true },
    execute: async () => {
      const form = inquiryForm();
      if (!form) return 'No inquiry form on this page.';
      const kind = form.getAttribute('data-form') || 'inquiry';
      // consequentialHint asks the browser/agent to confirm before execute.
      form.requestSubmit();
      return `Submitted the ${kind} form. Wait for the on-page success or error state.`;
    },
  });
}

/** Abort prior tools and register for the current page. */
export async function startWebMcpSession(): Promise<void> {
  session?.abort();
  session = new AbortController();
  const mc = modelContext();
  if (!mc || typeof mc.registerTool !== 'function') return;
  const { signal } = session;
  const ctx = ctxFromDom();
  try {
    await registerSitewide(mc, signal, ctx);
    await registerFilters(mc, signal);
    await registerInvite(mc, signal);
    await registerContact(mc, signal);
    await registerMentorship(mc, signal);
    await registerSubmit(mc, signal);
  } catch (err) {
    // Permissions-Policy / OT may reject registration; never break the page.
    console.warn('[webmcp] tool registration failed', err);
  }
}

let webmcpInited = false;

/** Wire ViewTransition-safe registration. Idempotent. */
export function initWebMcp(): void {
  if (webmcpInited) return;
  webmcpInited = true;
  const run = () => {
    void startWebMcpSession();
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
  document.addEventListener('astro:page-load', run);
}
