import * as React from 'react';
import { getCountryFlag } from '../../lib/flags';

/**
 * One event row — the shared listing style for /events (inside EventsFilter)
 * and /speaking's "Next up" strip (server-rendered, no hydration needed).
 * Extracted from EventsFilter so both pages stay visually identical.
 */

export interface EventRowData {
  slug: string;
  title: string;
  conference?: string;
  date: string;
  type?: string;
  featured?: boolean;
  location?: { city?: string; country?: string; isOnline?: boolean };
  links?: { videoUrl?: string };
}

export function EventRow({ event, index }: { event: EventRowData; index: number }) {
  const date = new Date(event.date);

  return (
    <a
      href={`/events/${event.slug}`}
      className="event-row"
      style={{ '--event-index': index } as React.CSSProperties}
    >
      {/* Hover Glow */}
      <div className="event-row__glow" />

      {/* Date */}
      <div className="event-row__date">
        <div className="event-row__month">
          {date.toLocaleDateString('en-US', { month: 'short' })}
        </div>
        <div className="event-row__day">{date.getDate()}</div>
      </div>

      {/* Content */}
      <div className="event-row__content">
        <div className="event-row__badges">
          {event.type && (
            <span className={`event-row__type event-row__type--${event.type}`}>
              {event.type}
            </span>
          )}
          {event.featured && (
            <span className="event-row__badge event-row__badge--featured">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Featured
            </span>
          )}
          {event.links?.videoUrl && (
            <span className="event-row__badge event-row__badge--video">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              Video
            </span>
          )}
        </div>
        <h3 className="event-row__title">{event.title}</h3>
        {event.conference && <p className="event-row__conference">{event.conference}</p>}
      </div>

      {/* Location */}
      <div className="event-row__location">
        <span className="event-row__flag">{event.location?.isOnline ? '🌐' : getCountryFlag(event.location?.country)}</span>
        <span className="event-row__city">{event.location?.isOnline ? 'Online' : event.location?.city || 'Online'}</span>
      </div>

      {/* Arrow */}
      <div className="event-row__arrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <style>{`
        .event-row {
          position: relative;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          margin: 0 -1rem;
          border-radius: 1rem;
          text-decoration: none;
          transition: all 0.3s ease;
          animation: event-row-enter 0.4s ease calc(var(--event-index) * 0.05s) both;
        }

        @keyframes event-row-enter {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .event-row:hover { background: rgb(var(--surface-overlay)); }

        .event-row__glow {
          position: absolute;
          inset: 0;
          border-radius: 1rem;
          background: radial-gradient(
            circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            rgb(var(--accent) / 0.1),
            transparent 50%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .event-row:hover .event-row__glow { opacity: 1; }

        .event-row__date {
          flex-shrink: 0;
          width: 3.5rem;
          text-align: center;
        }

        .event-row__month {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: rgb(var(--ink-faint));
        }

        .event-row__day {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 700;
          color: rgb(var(--ink));
          line-height: 1;
        }

        .event-row__content { flex: 1; min-width: 0; }

        .event-row__badges {
          display: flex;
          flex-wrap: wrap;
          gap: 0.375rem;
          margin-bottom: 0.375rem;
        }

        .event-row__type {
          padding: 0.125rem 0.5rem;
          font-size: 0.625rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-radius: 0.25rem;
          background: rgb(var(--accent) / 0.1);
          color: rgb(var(--accent-bright));
        }

        /* Semantic type tones from the design system: teal for hands-on,
           amber for community — everything else stays on the accent. */
        .event-row__type--workshop {
          background: rgb(var(--signal) / 0.1);
          color: rgb(var(--signal));
        }

        .event-row__type--meetup {
          background: rgb(var(--warn) / 0.1);
          color: rgb(var(--warn));
        }

        .event-row__badge {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.125rem 0.5rem;
          font-size: 0.625rem;
          font-weight: 600;
          border-radius: 0.25rem;
        }

        .event-row__badge--featured {
          background: rgb(var(--warn) / 0.1);
          color: rgb(var(--warn));
        }

        .event-row__badge--video {
          background: rgb(var(--accent) / 0.1);
          color: rgb(var(--accent-bright));
        }

        .event-row__title {
          font-weight: 600;
          color: rgb(var(--ink));
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 0.2s ease;
        }

        .event-row:hover .event-row__title { color: rgb(var(--accent-bright)); }

        .event-row__conference {
          font-size: 0.875rem;
          color: rgb(var(--ink-muted));
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .event-row__location {
          display: none;
          flex-shrink: 0;
          align-items: center;
          gap: 0.5rem;
        }

        @media (min-width: 640px) {
          .event-row__location { display: flex; }
        }

        .event-row__flag { font-size: 1.25rem; }

        .event-row__city {
          font-size: 0.875rem;
          color: rgb(var(--ink-muted));
        }

        .event-row__arrow {
          flex-shrink: 0;
          width: 1.5rem;
          height: 1.5rem;
          color: rgb(var(--ink-faint));
          transition: all 0.2s ease;
        }

        .event-row:hover .event-row__arrow {
          color: rgb(var(--accent-bright));
          transform: translateX(4px);
        }
      `}</style>
    </a>
  );
}

export default EventRow;
