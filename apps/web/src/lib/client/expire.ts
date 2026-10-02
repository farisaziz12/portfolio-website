/**
 * Pages are static, rebuilt a few times a day. Between builds an "upcoming"
 * item can end. Anything marked `data-until="<ISO>"` is hidden once that
 * instant has passed. Inside a `data-until-group`, the first visible item's
 * `data-until-sep` is hidden too, and a group with nothing left is hidden.
 */
function expire(): void {
  const now = Date.now();
  document.querySelectorAll<HTMLElement>('[data-until]').forEach((el) => {
    const until = Date.parse(el.dataset.until ?? '');
    if (Number.isFinite(until) && until <= now) el.hidden = true;
  });
  document.querySelectorAll<HTMLElement>('[data-until-group]').forEach((group) => {
    const items = [...group.querySelectorAll<HTMLElement>('[data-until]')];
    const visible = items.filter((el) => !el.hidden);
    if (items.length && !visible.length) {
      group.hidden = true;
      return;
    }
    visible[0]?.querySelector<HTMLElement>('[data-until-sep]')?.setAttribute('hidden', '');
  });
}

expire();
document.addEventListener('astro:page-load', expire);
