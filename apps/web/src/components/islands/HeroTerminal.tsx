import { useEffect, useRef, useState } from 'react';
import { navigate } from 'astro:transitions/client';
import { track } from '../../lib/analytics';

/**
 * The hero terminal, made real. Renders exactly like the old static
 * `$ whoami` decoration until someone clicks into it — then it's a working
 * prompt with commands, tab-completion, history, and a couple of easter eggs.
 */

interface Line {
  kind: 'cmd' | 'out' | 'cmt' | 'err';
  text: string;
}

const HERO_LINES: Line[] = [
  { kind: 'cmd', text: 'whoami' },
  { kind: 'out', text: 'Staff Engineer & Speaker' },
  { kind: 'cmt', text: "# this terminal works, try 'help'" },
];

const NOTFOUND_LINES: Line[] = [
  { kind: 'cmd', text: 'open .' },
  { kind: 'err', text: 'command not found: 404' },
  { kind: 'cmt', text: "# try 'ls', 'talks', or 'book'; this prompt works" },
];

const ROUTES: Record<string, { path: string; note: string }> = {
  talks: { path: '/talks', note: 'opening the talk catalogue…' },
  schedule: { path: '/events', note: 'pulling up the schedule…' },
  events: { path: '/events', note: 'pulling up the schedule…' },
  book: { path: '/invite', note: 'opening the booking form…' },
  invite: { path: '/invite', note: 'opening the booking form…' },
  workshops: { path: '/workshops', note: 'loading workshops…' },
  presskit: { path: '/press-kit', note: 'grabbing bios & headshots…' },
  consulting: { path: '/consulting', note: 'loading consulting…' },
  mentorship: { path: '/mentorship', note: 'loading mentorship…' },
  contact: { path: '/contact', note: 'opening all the doors…' },
  blog: { path: '/blog', note: 'loading the blog…' },
  about: { path: '/about', note: 'loading the bio…' },
};

const COMMAND_NAMES = [
  'help',
  'whoami',
  'hire',
  'ls',
  'clear',
  'theme',
  ...Object.keys(ROUTES),
];

function setTheme(next: 'light' | 'dark') {
  const root = document.documentElement;
  root.classList.toggle('dark', next === 'dark');
  root.setAttribute('data-theme', next);
  try {
    localStorage.setItem('theme', next);
    localStorage.setItem('faziz-theme', next);
  } catch (_) {}
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
}

interface Props {
  name?: string;
  mode?: 'hero' | 'notfound';
}

export default function HeroTerminal({ name = 'faris.sh', mode = 'hero' }: Props) {
  const [lines, setLines] = useState<Line[]>(mode === 'notfound' ? NOTFOUND_LINES : HERO_LINES);

  useEffect(() => {
    // On the 404 page, show the path the visitor actually asked for.
    if (mode !== 'notfound') return;
    const path = window.location.pathname;
    if (!path || path === '/') return;
    setLines([
      { kind: 'cmd', text: `open ${path}` },
      { kind: 'err', text: `command not found: ${path}` },
      { kind: 'cmt', text: "# try 'ls', 'talks', or 'book'; this prompt works" },
    ]);
  }, [mode]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [active, setActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Keep the latest lines in view as output grows.
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  function print(...next: Line[]) {
    setLines((prev) => [...prev, ...next].slice(-14));
  }

  function execute(raw: string) {
    const cmdLine = raw.trim();
    if (!cmdLine) return;
    setHistory((h) => [...h, cmdLine]);
    setHistIdx(-1);
    print({ kind: 'cmd', text: cmdLine });

    const [cmd, ...args] = cmdLine.toLowerCase().split(/\s+/);
    track('terminal_command', {
      command: cmd.slice(0, 24),
      known: COMMAND_NAMES.includes(cmd) || ['sudo', 'konami', 'coffee', 'exit', 'hire-me', 'hiring'].includes(cmd),
      mode,
    });

    if (cmd === 'clear') {
      setLines([]);
      return;
    }
    if (cmd === 'help') {
      print(
        { kind: 'out', text: 'talks · schedule · book · workshops · consulting · mentorship · contact · blog · about' },
        { kind: 'out', text: 'hire · theme [dark|light] · whoami · ls · clear' },
        { kind: 'cmt', text: '# and maybe one or two undocumented ones' }
      );
      return;
    }
    if (cmd === 'whoami') {
      print(
        { kind: 'out', text: 'Faris Aziz · Staff Software Engineer & Conference Speaker, Geneva.' },
        { kind: 'out', text: 'Cofounder of ZurichJS · JSNation OSS Award winner.' },
        { kind: 'out', text: "React, Next.js & payments. Try 'talks' or 'book'." }
      );
      return;
    }
    if (cmd === 'ls') {
      print({ kind: 'out', text: [...Object.keys(ROUTES).filter((k) => !['events', 'invite'].includes(k)), 'hire'].join('  ') });
      return;
    }
    if (cmd === 'theme') {
      const arg = args[0];
      const isDark = document.documentElement.classList.contains('dark');
      const next = arg === 'dark' || arg === 'light' ? (arg as 'dark' | 'light') : isDark ? 'light' : 'dark';
      setTheme(next);
      print({ kind: 'out', text: `theme set to ${next}` });
      return;
    }
    if (cmd === 'hire' || cmd === 'hire-me' || cmd === 'hiring') {
      print(
        { kind: 'out', text: 'open to: tech lead · staff/senior frontend · full-stack (frontend-leaning)' },
        { kind: 'out', text: 'payments · product engineering · founding engineer' },
        { kind: 'out', text: "run 'contact': the hire door opens a short form straight to my inbox." }
      );
      return;
    }
    if (cmd === 'sudo') {
      if (args.join(' ').includes('hire')) {
        print({ kind: 'out', text: 'permission granted. redirecting…' });
        window.setTimeout(() => navigate('/contact?topic=role#message'), 650);
      } else {
        print({ kind: 'err', text: 'nice try. faris is not in the sudoers file.' });
      }
      return;
    }
    if (cmd === 'konami') {
      print(
        { kind: 'out', text: '↑ ↑ ↓ ↓ ← → ← → B A' },
        { kind: 'out', text: '30 extra lives granted. spend them on conference CFPs.' }
      );
      return;
    }
    if (cmd === 'coffee') {
      print({ kind: 'out', text: 'c[_] brewing… ok, ready. now go invite me to your event.' });
      return;
    }
    if (cmd === 'exit') {
      print({ kind: 'cmt', text: "# there is no escape. only 'book'." });
      return;
    }
    const route = ROUTES[cmd];
    if (route) {
      print({ kind: 'out', text: route.note });
      window.setTimeout(() => navigate(route.path), 500);
      return;
    }
    print({ kind: 'err', text: `command not found: ${cmd}. try 'help'` });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      execute(input);
      setInput('');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const partial = input.trim().toLowerCase();
      if (!partial) return;
      const matches = COMMAND_NAMES.filter((c) => c.startsWith(partial));
      if (matches.length === 1) setInput(matches[0]);
      else if (matches.length > 1) print({ kind: 'cmt', text: `# ${matches.join('  ')}` });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!history.length) return;
      const idx = histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(idx);
      setInput(history[idx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx === -1) return;
      const idx = histIdx + 1;
      if (idx >= history.length) {
        setHistIdx(-1);
        setInput('');
      } else {
        setHistIdx(idx);
        setInput(history[idx]);
      }
    }
  }

  return (
    <div
      className={`ds-terminal hero-terminal ${active ? 'hero-terminal--active' : ''}`}
      onClick={() => {
        setActive(true);
        inputRef.current?.focus();
      }}
    >
      <div className="ds-terminal__bar">
        <span className="ds-terminal__dots"><i></i><i></i><i></i></span>
        <span className="ds-terminal__name">{name}</span>
      </div>
      <div className="ds-terminal__body hero-terminal__body" ref={bodyRef}>
        {lines.map((line, i) =>
          line.kind === 'cmd' ? (
            <div key={i}>
              <span className="pr">$</span> <span className="cmd">{line.text}</span>
            </div>
          ) : (
            <div key={i} className={line.kind === 'err' ? 'out hero-terminal__err' : line.kind}>
              {line.text}
            </div>
          )
        )}
        <div className="hero-terminal__inputrow">
          <span className="pr">$</span>
          <input
            ref={inputRef}
            className="hero-terminal__input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => setActive(true)}
            aria-label="Interactive site terminal: type 'help' for commands"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="go"
          />
        </div>
      </div>
    </div>
  );
}
