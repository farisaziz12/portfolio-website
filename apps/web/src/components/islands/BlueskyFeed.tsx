import * as React from 'react';
import { useEffect, useState } from 'react';

/**
 * Live Bluesky feed strip — fetches the author feed from the public AT
 * Protocol API in the browser (no auth, CORS-enabled) and renders a
 * horizontally scrollable row of post cards. Fails silently: if the API is
 * unreachable or returns nothing, the component renders nothing at all, so
 * the surrounding section never shows a broken state.
 */

interface BskyAuthor {
  handle: string;
  displayName?: string;
  avatar?: string;
}

interface BskyPost {
  uri: string;
  author: BskyAuthor;
  record: { text?: string; createdAt?: string };
  likeCount?: number;
  replyCount?: number;
  repostCount?: number;
}

function postUrl(post: BskyPost): string {
  const rkey = post.uri.split('/').pop() || '';
  return `https://bsky.app/profile/${post.author.handle}/post/${rkey}`;
}

function timeAgo(iso?: string): string {
  if (!iso) return '';
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 3600) return `${Math.max(1, Math.floor(s / 60))}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 86400 * 30) return `${Math.floor(s / 86400)}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const Butterfly = () => (
  <svg viewBox="0 0 600 530" fill="currentColor" aria-hidden="true">
    <path d="M135.72 44.03C202.216 93.951 273.74 195.17 300 249.49c26.262-54.316 97.782-155.54 164.28-205.46C512.26 8.009 590-19.862 590 68.825c0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.38-3.69-10.832-3.708-7.896-.017-2.936-1.193.516-3.707 7.896-13.714 40.255-67.233 197.36-189.63 71.766-64.444-66.128-34.605-132.26 82.697-152.22-67.108 11.421-142.55-7.45-163.25-81.433C20.15 217.613 9.997 86.535 9.997 68.825c0-88.687 77.742-60.816 125.72-24.795z" />
  </svg>
);

export function BlueskyFeed({ actor = 'farisaziz.com', limit = 12 }: { actor?: string; limit?: number }) {
  const [posts, setPosts] = useState<BskyPost[]>([]);
  // Avatar URLs that failed to load (stale CDN blob after a profile-picture
  // change, blocked request, …) — render the blank placeholder instead of
  // the browser's broken-image glyph.
  const [badAvatars, setBadAvatars] = useState<Set<string>>(() => new Set());
  const rootRef = React.useRef<HTMLDivElement>(null);

  // The wrapping section ships with `hidden` so a failed fetch never leaves
  // an orphaned heading — it only appears once real posts exist.
  useEffect(() => {
    if (posts.length) rootRef.current?.closest('[data-bsky-section]')?.removeAttribute('hidden');
  }, [posts]);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(
      `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${encodeURIComponent(actor)}&filter=posts_no_replies&limit=${limit}`,
      { signal: ctrl.signal }
    )
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`${r.status}`))))
      .then((data) => {
        const seen = new Set<string>();
        const items: BskyPost[] = [];
        for (const item of data?.feed || []) {
          const post = item?.post as BskyPost | undefined;
          if (!post?.uri || seen.has(post.uri) || !post.record?.text) continue;
          seen.add(post.uri);
          items.push(post);
        }
        setPosts(items);
      })
      .catch(() => {}); // offline / blocked → render nothing
    return () => ctrl.abort();
  }, [actor, limit]);

  if (!posts.length) return null;

  return (
    <div ref={rootRef} className="bsky-strip" aria-label="Latest Bluesky posts">
      {posts.map((post) => (
        <a key={post.uri} href={postUrl(post)} target="_blank" rel="noopener noreferrer" className="bsky-card">
          <div className="bsky-card__head">
            {post.author.avatar && !badAvatars.has(post.author.avatar) ? (
              <img
                className="bsky-card__avatar"
                src={post.author.avatar}
                alt=""
                loading="lazy"
                width="40"
                height="40"
                referrerPolicy="no-referrer"
                onError={() => {
                  const url = post.author.avatar!;
                  setBadAvatars((prev) => {
                    const next = new Set(prev);
                    next.add(url);
                    return next;
                  });
                }}
              />
            ) : (
              <span className="bsky-card__avatar bsky-card__avatar--blank" aria-hidden="true">
                {(post.author.displayName || post.author.handle).slice(0, 1).toUpperCase()}
              </span>
            )}
            <div className="bsky-card__who">
              <b>{post.author.displayName || post.author.handle}</b>
              <span>@{post.author.handle}</span>
            </div>
            <span className="bsky-card__logo"><Butterfly /></span>
          </div>
          <p className="bsky-card__text">{post.record.text}</p>
          <div className="bsky-card__meta">
            <span className="bsky-card__stat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7.5-4.7-9.7-9A5.4 5.4 0 0 1 12 6.6 5.4 5.4 0 0 1 21.7 12c-2.2 4.3-9.7 9-9.7 9z" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {post.likeCount ?? 0}
            </span>
            <span className="bsky-card__stat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a8 8 0 0 1-8 8H4l3-3a8 8 0 1 1 14-5z" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {post.replyCount ?? 0}
            </span>
            <span className="bsky-card__stat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 2l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {post.repostCount ?? 0}
            </span>
            <span className="bsky-card__time">{timeAgo(post.record.createdAt)}</span>
          </div>
        </a>
      ))}

      <style>{`
        .bsky-strip {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          padding: 0.25rem 0.25rem 1rem;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          scrollbar-color: rgb(var(--edge-strong)) transparent;
          mask-image: linear-gradient(to right, transparent, black 2rem, black calc(100% - 2rem), transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 2rem, black calc(100% - 2rem), transparent);
        }

        .bsky-card {
          scroll-snap-align: start;
          flex: 0 0 auto;
          width: min(340px, 82vw);
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
          padding: 1.1rem 1.2rem;
          border-radius: 16px;
          background: rgb(var(--surface-2));
          border: 1px solid rgb(var(--edge));
          text-decoration: none;
          transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.22s;
        }

        .bsky-card:hover {
          transform: translateY(-3px);
          border-color: rgb(var(--edge-strong));
        }

        .bsky-card__head {
          display: flex;
          align-items: center;
          gap: 0.7rem;
        }

        .bsky-card__avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }

        .bsky-card__avatar--blank {
          background: rgb(var(--surface-3));
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display, 'Space Grotesk', system-ui, sans-serif);
          font-weight: 600;
          font-size: 1rem;
          color: rgb(var(--ink-muted));
        }

        .bsky-card__who {
          min-width: 0;
          display: flex;
          flex-direction: column;
          line-height: 1.25;
        }

        .bsky-card__who b {
          font-size: 0.92rem;
          color: rgb(var(--ink));
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .bsky-card__who span {
          font-size: 0.8rem;
          color: rgb(var(--ink-faint));
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .bsky-card__logo {
          margin-left: auto;
          width: 20px;
          height: 20px;
          color: rgb(var(--ink-muted));
          flex-shrink: 0;
        }

        .bsky-card__logo svg { width: 100%; height: 100%; }

        .bsky-card:hover .bsky-card__logo { color: rgb(var(--accent-bright)); }

        .bsky-card__text {
          font-size: 0.92rem;
          line-height: 1.55;
          color: rgb(var(--ink-muted));
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
          white-space: pre-line;
        }

        .bsky-card__meta {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 1rem;
          color: rgb(var(--ink-faint));
          font-size: 0.8rem;
        }

        .bsky-card__stat {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }

        .bsky-card__stat svg { width: 15px; height: 15px; }

        .bsky-card__time { margin-left: auto; }
      `}</style>
    </div>
  );
}

export default BlueskyFeed;
