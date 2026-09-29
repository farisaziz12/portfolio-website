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
 *     <span data-filter-shown></span>
 *   </div>
 *
 * An item matches a key when its space-separated `data-<key>` list contains
 * the active value (or the value is "all").
 */

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
  let shown = 0;
  root.querySelectorAll<HTMLElement>('[data-filter-item]').forEach((item) => {
    const ok = Object.entries(state).every(([key, value]) => {
      if (!value || value === 'all') return true;
      return (item.dataset[key] ?? '').split(/\s+/).includes(value);
    });
    item.hidden = !ok;
    if (ok) shown++;
  });
  root.querySelectorAll<HTMLElement>('[data-filter-group]').forEach((g) => {
    g.hidden = !g.querySelector('[data-filter-item]:not([hidden])');
  });
  root.querySelectorAll<HTMLElement>('[data-filter-empty]').forEach((e) => (e.hidden = shown > 0));
  root.querySelectorAll<HTMLElement>('[data-filter-shown]').forEach((e) => (e.textContent = String(shown)));

  if (pushUrl) {
    const url = new URL(location.href);
    for (const [key, value] of Object.entries(state)) {
      if (!value || value === 'all') url.searchParams.delete(key);
      else url.searchParams.set(key, value);
    }
    history.replaceState(history.state, '', url);
  }
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
        return;
      }
      if (target.closest('[data-filter-reset]')) {
        for (const key of keys) state[key] = 'all';
        apply(root, state, true);
      }
    });
  });
}
