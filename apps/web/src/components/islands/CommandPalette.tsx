import { useEffect, useMemo, useRef, useState } from 'react';
import { navigate } from 'astro:transitions/client';
import { track } from '../../lib/analytics';

type Cmd =
  | { group: string; label: string; icon: string; href: string; external?: boolean; keyHint?: string }
  | { group: string; label: string; icon: string; action: 'toggle-theme'; keyHint?: string }
  | { group: string; label: string; icon: string; action: 'copy'; text: string; keyHint?: string };

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
  img: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.5"/><path d="m3 17 5-5 4 4 3-3 6 6"/>',
  heart: '<path d="M12 20.5S3.5 15 3.5 8.9A4.6 4.6 0 0 1 8 4.3c1.7 0 3.2 1 4 2.4a4.6 4.6 0 0 1 4-2.4 4.6 4.6 0 0 1 4.5 4.6C20.5 15 12 20.5 12 20.5z"/>',
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
  { group: 'Pages', label: 'Media & press kit', icon: ICON.img, href: '/media' },
  { group: 'Pages', label: 'Photo gallery', icon: ICON.img, href: '/gallery' },
  { group: 'Pages', label: 'Appreciation', icon: ICON.heart, href: '/appreciation' },
  { group: 'Actions', label: 'Work with me', icon: ICON.mail, href: '/contact', keyHint: 'CTA' },
  { group: 'Actions', label: 'Invite me to speak', icon: ICON.mic, href: '/invite' },
  {
    group: 'Actions',
    label: 'Copy short bio',
    icon: ICON.pen,
    action: 'copy',
    text: 'Faris Aziz is a Staff Software Engineer and conference speaker based in Geneva. He helps teams ship resilient frontend systems and payment integrations, speaks internationally on React, Next.js, and engineering leadership, and organizes ZurichJS.',
    keyHint: 'for organizers',
  },
  { group: 'Actions', label: 'Message me', icon: ICON.mail, href: '/contact#message' },
  { group: 'Actions', label: 'Toggle theme', icon: ICON.sun, action: 'toggle-theme' },
  { group: 'Elsewhere', label: 'GitHub', icon: ICON.gh, href: 'https://github.com/farisaziz12', external: true },
  { group: 'Elsewhere', label: 'LinkedIn', icon: ICON.user, href: 'https://linkedin.com/in/farisaziz12', external: true },
];

const RECENT_KEY = 'cmdk-recent';

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const [recentLabel, setRecentLabel] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    try { setRecentLabel(localStorage.getItem(RECENT_KEY)); } catch (_) {}
    track('command_palette_opened', { path: window.location.pathname });
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Pin the last-used command to the top so the palette learns one habit.
      const recent = recentLabel ? COMMANDS.find((c) => c.label === recentLabel) : undefined;
      if (recent) {
        return [{ ...recent, group: 'Recent' }, ...COMMANDS.filter((c) => c.label !== recentLabel)];
      }
      return COMMANDS;
    }
    return COMMANDS.filter(
      (c) => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q)
    );
  }, [query, recentLabel]);

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
    try { localStorage.setItem(RECENT_KEY, cmd.label); } catch (_) {}
    track('command_palette_action', {
      command: cmd.label,
      group: cmd.group,
      href: 'href' in cmd ? cmd.href : undefined,
    });
    if ('action' in cmd && cmd.action === 'copy') {
      try {
        navigator.clipboard?.writeText(cmd.text);
      } catch (_) {}
      // Flash "Copied" on the item before closing — copy without feedback feels broken.
      setCopiedLabel(cmd.label);
      window.setTimeout(() => {
        setOpen(false);
        setCopiedLabel(null);
      }, 900);
      return;
    }
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
      window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
      return;
    }
    if ('href' in cmd) {
      if (cmd.external) window.open(cmd.href, '_blank', 'noopener');
      else navigate(cmd.href);
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
                    style={{ '--cmdk-delay': `${Math.min(i, 10) * 15}ms` } as React.CSSProperties}
                    aria-selected={i === selectedIdx}
                    onMouseMove={() => i !== selectedIdx && setSelectedIdx(i)}
                    onClick={() => run(c)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} dangerouslySetInnerHTML={{ __html: copiedLabel === c.label ? '<path d="M5 12l5 5 9-11" stroke-linecap="round" stroke-linejoin="round"/>' : c.icon }} />
                    <span>{copiedLabel === c.label ? 'Copied to clipboard' : c.label}</span>
                    {'keyHint' in c && c.keyHint && copiedLabel !== c.label && <span className="k">{c.keyHint}</span>}
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
