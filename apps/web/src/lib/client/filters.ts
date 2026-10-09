/**
 * Declarative list filters, shared by Talks, Events, Writing and What people
 * say. Server-rendered markup works without JS (everything shows); with JS,
 * pills filter instantly and write to the URL (?topic=engineering) so a
 * filtered view can be shared.
 *
 *   <div data-filter-root>
 *     <button data-filter="topic" data-value="all" aria-pressed="true">All</button>
 *     <button data-filter="topic" data-value="engineering" aria-pressed="false">…</button>
 *     <section data-filter-group> <li data-filter-item data-topic="engineering payments">…</li> </section>
 *     <p data-filter-empty hidden>Nothing here yet. <button data-filter-reset>Show everything</button></p>
 *     <span data-filter-shown></span><span data-filter-total hidden> of N</span>  (total shows only while filtered)
 *   </div>
 *
 * An item matches a key when its space-separated `data-<key>` list contains
 * the active value (or the value is "all").
 *
 * Optional, for lists filtered on several keys at once:
 *   - a pill's `[data-filter-count]` child shows how many items that pill would
 *     leave, given the other active filters; a pill that would leave none is
 *     disabled so you can't filter into an empty list.
 *   - `[data-filter-clear]` (usually a `data-filter-reset` button) shows only
 *     while something is filtered.
 */

function matches(item: HTMLElement, state: Record<string, string>): boolean {
  return Object.entries(state).every(([key, value]) => {
    if (!value || value === 'all') return true;
    return (item.dataset[key] ?? '').split(/\s+/).includes(value);
  });
}

function readState(root: HTMLElement): Record<string, string> {
  const state: Record<string, string> = {};
  root.querySelectorAll<HTMLElement>('[data-filter][aria-pressed="true"]').forEach((b) => {
    state[b.dataset.filter!] = b.dataset.value!;
  });
  return state;
}

function apply(root: HTMLElement, state: Record<string, string>, pushUrl: boolean) {
  root.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((b) => {
    const key = b.dataset.filter!;
    b.setAttribute('aria-pressed', String((state[key] ?? 'all') === b.dataset.value));
  });
  const items = [...root.querySelectorAll<HTMLElement>('[data-filter-item]')];
  let shown = 0;
  items.forEach((item) => {
    const ok = matches(item, state);
    item.hidden = !ok;
    if (ok) shown++;
  });
  root.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((b) => {
    const count = b.querySelector<HTMLElement>('[data-filter-count]');
    if (!count) return;
    const n = items.filter((item) => matches(item, { ...state, [b.dataset.filter!]: b.dataset.value! })).length;
    count.textContent = String(n);
    b.disabled = n === 0 && b.getAttribute('aria-pressed') !== 'true';
  });
  const filtered = Object.values(state).some((v) => v && v !== 'all');
  root.querySelectorAll<HTMLElement>('[data-filter-clear]').forEach((e) => (e.hidden = !filtered));
  root.querySelectorAll<HTMLElement>('[data-filter-group]').forEach((g) => {
    g.hidden = !g.querySelector('[data-filter-item]:not([hidden])');
  });
  root.querySelectorAll<HTMLElement>('[data-filter-empty]').forEach((e) => (e.hidden = shown > 0));
  root.querySelectorAll<HTMLElement>('[data-filter-shown]').forEach((e) => (e.textContent = String(shown)));
  const total = root.querySelectorAll('[data-filter-item]').length;
  root.querySelectorAll<HTMLElement>('[data-filter-total]').forEach((e) => (e.hidden = shown === total));

  if (pushUrl) {
    const url = new URL(location.href);
    for (const [key, value] of Object.entries(state)) {
      if (!value || value === 'all') url.searchParams.delete(key);
      else url.searchParams.set(key, value);
    }
    history.replaceState(history.state, '', url);
  }
}

/** Tell analytics (posthog.astro) a filter changed; the list stays analytics-agnostic. */
function announce(root: HTMLElement, key: string, value: string) {
  const shown = root.querySelectorAll('[data-filter-item]:not([hidden])').length;
  document.dispatchEvent(new CustomEvent('filters:change', { detail: { key, value, shown } }));
}

export function initFilters() {
  document.querySelectorAll<HTMLElement>('[data-filter-root]').forEach((root) => {
    if (root.dataset.filterReady) return;
    root.dataset.filterReady = '1';
    const keys = new Set([...root.querySelectorAll<HTMLElement>('[data-filter]')].map((b) => b.dataset.filter!));
    const state = readState(root);
    const params = new URL(location.href).searchParams;
    for (const key of keys) {
      const v = params.get(key);
      if (v && root.querySelector(`[data-filter="${key}"][data-value="${CSS.escape(v)}"]`)) state[key] = v;
    }
    apply(root, state, false);

    root.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const pill = target.closest<HTMLButtonElement>('[data-filter]');
      if (pill && root.contains(pill)) {
        state[pill.dataset.filter!] = pill.dataset.value!;
        apply(root, state, true);
        announce(root, pill.dataset.filter!, pill.dataset.value!);
        return;
      }
      if (target.closest('[data-filter-reset]')) {
        for (const key of keys) state[key] = 'all';
        apply(root, state, true);
        announce(root, 'reset', 'all');
      }
    });
  });
}
