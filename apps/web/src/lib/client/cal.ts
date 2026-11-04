/**
 * Cal.com modal embed helpers. Shared by BaseLayout link interception and
 * WebMCP `open_discovery_call` so agents and humans use the same path.
 */

type CalFn = ((...args: unknown[]) => void) & {
  loaded?: boolean;
  ns?: Record<string, CalFn>;
  q?: unknown[][];
};

declare global {
  interface Window {
    Cal?: CalFn;
    posthog?: { capture: (event: string, props?: Record<string, unknown>) => void };
  }
}

let injected = false;

/** Inject embed.js once and init the Cal namespace (official bootstrap). */
export function ensureCal(): void {
  if (injected) return;
  injected = true;
  const C = window;
  const A = 'https://app.cal.com/embed/embed.js';
  const L = 'init';
  const push = (a: { q?: unknown[][] }, ar: unknown[]) => {
    (a.q ??= []).push(ar);
  };
  C.Cal =
    C.Cal ||
    function (this: void, ...ar: unknown[]) {
      const cal = C.Cal!;
      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q || [];
        C.document.head.appendChild(C.document.createElement('script')).src = A;
        cal.loaded = true;
      }
      if (ar[0] === L) {
        const api = function (...inner: unknown[]) {
          push(api, inner);
        } as CalFn;
        api.q = [];
        const namespace = ar[1];
        if (typeof namespace === 'string') {
          cal.ns![namespace] = cal.ns![namespace] || api;
          push(cal.ns![namespace], ar);
          push(cal, ['initNamespace', namespace]);
        } else {
          push(cal, ar);
        }
        return;
      }
      push(cal, ar);
    };
  C.Cal('init', { origin: 'https://cal.com' });
  C.Cal('ui', {
    theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
    hideEventTypeDetails: false,
    layout: 'month_view',
  });
}

function calAnchor(target: EventTarget | null): HTMLAnchorElement | null {
  return target instanceof Element ? target.closest('a[href^="https://cal.com/"]') : null;
}

/**
 * Open a Cal.com event type as an on-site modal. Falls back to a new tab if
 * the embed never materializes (blocked script, offline).
 */
export function openDiscoveryCall(href: string): { ok: true; mode: 'modal' | 'tab' } {
  ensureCal();
  const url = new URL(href, location.origin);
  const calLink = url.pathname.replace(/^\//, '');
  if (typeof window.Cal === 'function') {
    window.Cal('modal', { calLink });
    try {
      window.posthog?.capture('discovery_call_opened', { path: location.pathname });
    } catch {
      /* analytics optional */
    }
    window.setTimeout(() => {
      if (!document.querySelector('cal-modal-box')) window.open(href, '_blank', 'noopener');
    }, 2500);
    return { ok: true, mode: 'modal' };
  }
  window.open(href, '_blank', 'noopener');
  return { ok: true, mode: 'tab' };
}

let calLinksReady = false;

/** Sitewide: cal.com links open as modal; warm embed on hover. Idempotent. */
export function initCalLinks(): void {
  if (calLinksReady) return;
  calLinksReady = true;
  document.addEventListener(
    'pointerover',
    (e) => {
      if (calAnchor(e.target)) ensureCal();
    },
    { passive: true },
  );
  document.addEventListener('click', (e) => {
    const a = calAnchor(e.target);
    if (!a) return;
    e.preventDefault();
    openDiscoveryCall(a.href);
  });
}
