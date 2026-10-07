import { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';

export default function ThemeToggle() {
  // Dark is the site default; only an explicit stored "light" preference overrides it.
  // Must stay in sync with the inline bootstrap script in BaseLayout.astro.
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let savedTheme: string | null = null;
    try { savedTheme = localStorage.getItem('theme'); } catch { /* storage blocked */ }
    setTheme(savedTheme === 'light' ? 'light' : 'dark');

    // Stay in sync when something else (e.g. the command palette) flips the theme.
    const onThemeChange = (e: Event) => {
      const next = (e as CustomEvent<{ theme?: string }>).detail?.theme;
      if (next === 'light' || next === 'dark') setTheme(next);
    };
    window.addEventListener('themechange', onThemeChange);
    return () => window.removeEventListener('themechange', onThemeChange);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
      localStorage.setItem('faziz-theme', theme);
    } catch { /* quota / private mode */ }
    // Keep other toggles (header + footer) in sync.
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }, [theme, mounted]);

  const btnRef = useRef<HTMLButtonElement>(null);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> } };

    if (!doc.startViewTransition || reduce) {
      setTheme(next);
      return;
    }

    // Circular reveal expanding from the toggle button. Scoped with a root
    // class so it never interferes with Astro's page-navigation transitions.
    const rect = btnRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth - 40;
    const y = rect ? rect.top + rect.height / 2 : 40;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    document.documentElement.classList.add('theme-vt');
    const transition = doc.startViewTransition(() => {
      flushSync(() => setTheme(next));
    });
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`] },
          { duration: 450, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' }
        );
      })
      .catch(() => {});
    transition.finished.finally(() => {
      document.documentElement.classList.remove('theme-vt');
    });
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <button type="button" className="theme-toggle" aria-label="Toggle theme">
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4" strokeWidth={2} />
        </svg>
      </button>
    );
  }

  return (
    <button
      type="button"
      ref={btnRef}
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <svg
          width="18"
          height="18"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ) : (
        <svg
          width="18"
          height="18"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )}
    </button>
  );
}
