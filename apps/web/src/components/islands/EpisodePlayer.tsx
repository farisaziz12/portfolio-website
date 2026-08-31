import * as React from 'react';
import { useState } from 'react';

/**
 * Click-to-load podcast/episode player with jumpable chapters.
 *
 * Nothing heavy loads until the visitor asks for it: the facade is a cover
 * image + play button; the platform iframe (YouTube / Spotify / Apple
 * Podcasts) is injected on first interaction.
 *
 * Chapter seeking is platform-dependent:
 *  - YouTube: reload the embed with ?start=N — true in-place jumping.
 *  - Spotify / Apple / anything else: chapters deep-link to the platform at
 *    the timestamp in a new tab (embeds don't expose reliable seek APIs).
 */

export interface EpisodeChapter {
  timestamp: string; // "mm:ss" or "hh:mm:ss"
  title: string;
  note?: string;
}

interface EpisodePlayerProps {
  url: string;
  title: string;
  /** Pre-resolved cover image URL (server-side urlFor). */
  coverUrl?: string;
  chapters?: EpisodeChapter[];
}

export function tsToSeconds(ts: string): number {
  const parts = ts.split(':').map((p) => parseInt(p, 10));
  if (parts.some(Number.isNaN)) return 0;
  return parts.reduce((acc, p) => acc * 60 + p, 0);
}

type Platform = 'youtube' | 'spotify' | 'apple' | 'other';

function detect(url: string): { platform: Platform; embedUrl: string | null } {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com') || u.hostname === 'youtu.be') {
      const id = u.hostname === 'youtu.be' ? u.pathname.slice(1) : u.searchParams.get('v');
      return id
        ? { platform: 'youtube', embedUrl: `https://www.youtube-nocookie.com/embed/${id}` }
        : { platform: 'other', embedUrl: null };
    }
    if (u.hostname.includes('spotify.com')) {
      const m = u.pathname.match(/\/(episode|show)\/([A-Za-z0-9]+)/);
      return m
        ? { platform: 'spotify', embedUrl: `https://open.spotify.com/embed/${m[1]}/${m[2]}` }
        : { platform: 'other', embedUrl: null };
    }
    if (u.hostname.includes('podcasts.apple.com')) {
      return { platform: 'apple', embedUrl: `https://embed.podcasts.apple.com${u.pathname}${u.search}` };
    }
  } catch {}
  return { platform: 'other', embedUrl: null };
}

/** Platform link at a timestamp (used when the embed can't seek in place). */
function timedLink(url: string, platform: Platform, seconds: number): string {
  if (platform === 'spotify') {
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}t=${seconds}`;
  }
  if (platform === 'youtube') {
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}t=${seconds}s`;
  }
  return url;
}

export function EpisodePlayer({ url, title, coverUrl, chapters = [] }: EpisodePlayerProps) {
  const { platform, embedUrl } = detect(url);
  const [playing, setPlaying] = useState(false);
  const [startAt, setStartAt] = useState(0);
  // Bump to force iframe remount when jumping to a chapter.
  const [loadKey, setLoadKey] = useState(0);

  const canSeekInPlace = platform === 'youtube';

  const play = (seconds = 0) => {
    setStartAt(seconds);
    setLoadKey((k) => k + 1);
    setPlaying(true);
  };

  const iframeSrc = () => {
    if (!embedUrl) return '';
    if (platform === 'youtube') return `${embedUrl}?autoplay=1&start=${startAt}`;
    if (platform === 'spotify') return `${embedUrl}?utm_source=faziz-dev`;
    return embedUrl;
  };

  return (
    <div className="ep-player">
      <div className={`ep-player__stage ep-player__stage--${platform}`}>
        {playing && embedUrl ? (
          <iframe
            key={loadKey}
            src={iframeSrc()}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; clipboard-write"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <button type="button" className="ep-player__facade" onClick={() => play(0)} aria-label={`Play: ${title}`}>
            {coverUrl ? (
              <img src={coverUrl} alt="" loading="lazy" />
            ) : (
              <span className="ep-player__facade-bg" aria-hidden="true" />
            )}
            <span className="ep-player__play" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.53.85l10.2-6.5a1 1 0 0 0 0-1.7L9.53 4.65A1 1 0 0 0 8 5.5z" /></svg>
            </span>
            {!embedUrl && <span className="ep-player__external-note">Opens on the original platform</span>}
          </button>
        )}
      </div>

      {chapters.length > 0 && (
        <ol className="ep-chapters" aria-label="Episode chapters">
          {chapters.map((c) => {
            const secs = tsToSeconds(c.timestamp);
            const inner = (
              <>
                <span className="ep-chapters__ts">{c.timestamp}</span>
                <span className="ep-chapters__body">
                  <b>{c.title}</b>
                  {c.note && <span>{c.note}</span>}
                </span>
              </>
            );
            return (
              <li key={`${c.timestamp}-${c.title}`}>
                {canSeekInPlace ? (
                  <button type="button" className="ep-chapters__item" onClick={() => play(secs)}>
                    {inner}
                  </button>
                ) : (
                  <a
                    className="ep-chapters__item"
                    href={timedLink(url, platform, secs)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {inner}
                    <svg className="ep-chapters__ext" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </a>
                )}
              </li>
            );
          })}
        </ol>
      )}

      <style>{`
        .ep-player__stage {
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid rgb(var(--edge));
          background: rgb(var(--surface-2));
          aspect-ratio: 16 / 9;
        }

        /* Spotify's episode embed is a short card, not a video frame. */
        .ep-player__stage--spotify { aspect-ratio: auto; min-height: 152px; }
        .ep-player__stage--spotify iframe { height: 152px; }
        .ep-player__stage--apple { aspect-ratio: auto; min-height: 175px; }
        .ep-player__stage--apple iframe { height: 175px; }

        .ep-player__stage iframe {
          width: 100%;
          height: 100%;
          border: 0;
          display: block;
        }

        .ep-player__facade {
          position: relative;
          display: block;
          width: 100%;
          height: 100%;
          min-height: 152px;
          padding: 0;
          border: 0;
          cursor: pointer;
          background: rgb(var(--surface-3));
        }

        .ep-player__facade img,
        .ep-player__facade-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.75;
          transition: opacity 0.25s ease, transform 0.4s ease;
        }

        .ep-player__facade-bg {
          background:
            radial-gradient(circle at 30% 30%, rgb(var(--accent) / 0.25), transparent 60%),
            rgb(var(--surface-3));
        }

        .ep-player__facade:hover img { opacity: 0.9; transform: scale(1.02); }

        .ep-player__play {
          position: absolute;
          inset: 0;
          margin: auto;
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: rgb(var(--accent));
          color: #fff;
          box-shadow: 0 8px 30px -6px rgb(var(--accent) / 0.6);
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ep-player__facade:hover .ep-player__play { transform: scale(1.08); }
        .ep-player__play svg { width: 26px; height: 26px; margin-left: 3px; }

        .ep-player__external-note {
          position: absolute;
          bottom: 0.7rem;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 0.75rem;
          font-family: var(--font-mono, 'IBM Plex Mono', ui-monospace, monospace);
          color: rgb(var(--ink-muted));
        }

        .ep-chapters {
          list-style: none;
          margin: 1rem 0 0;
          padding: 0;
          display: grid;
          gap: 0.35rem;
        }

        .ep-chapters__item {
          width: 100%;
          display: flex;
          align-items: baseline;
          gap: 0.9rem;
          padding: 0.55rem 0.8rem;
          border: 1px solid transparent;
          border-radius: 10px;
          background: none;
          text-align: left;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.15s ease, border-color 0.15s ease;
        }

        .ep-chapters__item:hover {
          background: rgb(var(--surface-2));
          border-color: rgb(var(--edge));
        }

        .ep-chapters__ts {
          flex-shrink: 0;
          font-family: var(--font-mono, 'IBM Plex Mono', ui-monospace, monospace);
          font-size: 0.78rem;
          color: rgb(var(--accent-bright));
          min-width: 3.2rem;
        }

        .ep-chapters__body {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          min-width: 0;
        }

        .ep-chapters__body b {
          font-size: 0.92rem;
          font-weight: 600;
          color: rgb(var(--ink));
        }

        .ep-chapters__body span {
          font-size: 0.82rem;
          color: rgb(var(--ink-muted));
        }

        .ep-chapters__ext {
          width: 14px;
          height: 14px;
          margin-left: auto;
          flex-shrink: 0;
          align-self: center;
          color: rgb(var(--ink-faint));
        }
      `}</style>
    </div>
  );
}

export default EpisodePlayer;
