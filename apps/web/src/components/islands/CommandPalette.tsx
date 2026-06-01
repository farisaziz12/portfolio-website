import { useEffect, useMemo, useRef, useState } from 'react';

type Cmd =
  | { group: string; label: string; icon: string; href: string; external?: boolean; keyHint?: string }
  | { group: string; label: string; icon: string; action: 'toggle-theme'; keyHint?: string };

const ICON: Record<string, string> = {
  home: '<path d="M3 11l9-8 9 8M5 10v10h14V10"/>',
  mic: '<path d="M9 3h6v8a3 3 0 0 1-6 0z"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/>',
  cal: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>',
  book: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  user: '<circle cx="9" cy="8" r="3"/><path d="M3 19a6 6 0 0 1 12 0M16 7a3 3 0 0 1 0 6M18.5 19a5 5 0 0 0-3-4.6"/>',
  chart: '<path d="M3 17l6-6 4 4 8-8"/><path d="M21 7v5h-5"/>',
  pen: '<path d="M4 5a2 2 0 0 1 2-2h7v18H6a2 2 0 0 1-2-2zM13 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5"/><path d="M7 7h3M7 11h3"/>',
  play: '<path d="M5 4.5v15l13-7.5z" fill="currentColor" stroke="none"/>',
  sun: '<circle cx="12" cy="12" r="3.6"/><path d="M12 3v1.5M12 19.5V21M4.2 4.2l1 1M18.8 18.8l1 1M3 12h1.5M19.5 12H21M4.2 19.8l1-1M18.8 5.2l1-1" stroke-linecap="round"/>',
  gh: '<path d="M9 19c-4 1.5-4-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6A4.6 4.6 0 0 0 18.5 6 4.3 4.3 0 0 0 18 2.5s-1-.3-3.5 1.3a12 12 0 0 0-6 0C6 2.2 5 2.5 5 2.5A4.3 4.3 0 0 0 4.5 6 4.6 4.6 0 0 0 3 9c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" stroke-linecap="round" stroke-linejoin="round"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
};

const COMMANDS: Cmd[] = [
  { group: 'Pages', label: 'Home', icon: ICON.home, href: '/' },
  { group: 'Pages', label: 'Speaking', icon: ICON.mic, href: '/speaking' },
  { group: 'Pages', label: 'Talks', icon: ICON.play, href: '/talks' },
  { group: 'Pages', label: 'Events', icon: ICON.cal, href: '/events' },
  { group: 'Pages', label: 'Workshops', icon: ICON.book, href: '/workshops' },
  { group: 'Pages', label: 'Services', icon: ICON.book, href: '/services' },
  { group: 'Pages', label: 'Consulting', icon: ICON.chart, href: '/consulting' },
  { group: 'Pages', label: 'Mentorship', icon: ICON.user, href: '/mentorship' },
  { group: 'Pages', label: 'Impact', icon: ICON.chart, href: '/impact' },
  { group: 'Pages', label: 'About', icon: ICON.user, href: '/about' },
  { group: 'Pages', label: 'Blog', icon: ICON.pen, href: '/blog' },
  { group: 'Pages', label: 'Projects', icon: ICON.book, href: '/projects' },
  { group: 'Actions', label: 'Invite me to speak', icon: ICON.mic, href: '/invite', keyHint: 'CTA' },
  { group: 'Actions', label: 'Toggle theme', icon: ICON.sun, action: 'toggle-theme' },
  { group: 'Elsewhere', label: 'GitHub', icon: ICON.gh, href: 'https://github.com/farisaziz12', external: true },
  { group: 'Elsewhere', label: 'LinkedIn', icon: ICON.user, href: 'https://linkedin.com/in/farisaziz12', external: true },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMANDS;
    return COMMANDS.filter(
      (c) => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q)
    );
  }, [query]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    }
    document.addEventListener('keydown', onKey);
    function onOpen() { setOpen(true); }
    document.addEventListener('cmdk:open', onOpen as EventListener);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('cmdk:open', onOpen as EventListener);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIdx(0);
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  function run(cmd: Cmd) {
    setOpen(false);
    if ('action' in cmd && cmd.action === 'toggle-theme') {
      const root = document.documentElement;
      const next = root.classList.contains('dark') ? 'light' : 'dark';
      root.classList.toggle('dark', next === 'dark');
      root.setAttribute('data-theme', next);
      try {
        localStorage.setItem('theme', next);
        localStorage.setItem('faziz-theme', next);
      } catch (_) {}
      return;
    }
    if ('href' in cmd) {
      if (cmd.external) window.open(cmd.href, '_blank', 'noopener');
      else window.location.href = cmd.href;
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const c = filtered[selectedIdx];
      if (c) run(c);
    }
  }

  let lastGroup = '';

  return (
    <div className={`cmdk ${open ? 'open' : ''}`} onClick={(e) => {
      if (e.target === e.currentTarget) setOpen(false);
    }}>
      <div className="cmdk__box" role="dialog" aria-label="Command palette">
        <input
          ref={inputRef}
          className="cmdk__input"
          placeholder="Jump to a page or action…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          spellCheck={false}
        />
        <div className="cmdk__list">
          {filtered.length === 0 ? (
            <div className="cmdk__empty">No matches</div>
          ) : (
            filtered.map((c, i) => {
              const showGroup = c.group !== lastGroup;
              lastGroup = c.group;
              return (
                <div key={`${c.group}-${c.label}`}>
                  {showGroup && <div className="cmdk__group">{c.group}</div>}
                  <div
                    className="cmdk__item"
                    aria-selected={i === selectedIdx}
                    onMouseMove={() => i !== selectedIdx && setSelectedIdx(i)}
                    onClick={() => run(c)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} dangerouslySetInnerHTML={{ __html: c.icon }} />
                    <span>{c.label}</span>
                    {'keyHint' in c && c.keyHint && <span className="k">{c.keyHint}</span>}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
