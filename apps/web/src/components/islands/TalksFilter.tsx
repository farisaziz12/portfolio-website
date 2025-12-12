import type { JSX } from 'react';
import { useState, useMemo, useRef, useEffect } from 'react';

interface Talk {
  _id: string;
  title: string;
  slug: string;
  abstract?: string;
  audience?: string;
  takeaways?: string[];
  topics?: string[];
  duration?: number;
  version?: string;
  isCurrentVersion?: boolean;
  versionCount?: number;
  eventCount: number;
  latestEvent?: {
    date: string;
    conference: string;
    location: string;
  };
}

interface TalksFilterProps {
  talks: Talk[];
}

type ViewMode = 'grid' | 'list';
type SortMode = 'title' | 'popular' | 'recent';

const sortOptions: { value: SortMode; label: string; icon: JSX.Element }[] = [
  {
    value: 'popular',
    label: 'Most delivered',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    value: 'recent',
    label: 'Recently presented',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    value: 'title',
    label: 'Alphabetical',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
      </svg>
    ),
  },
];

export default function TalksFilter({ talks }: TalksFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortMode, setSortMode] = useState<SortMode>('popular');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setSortDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentSort = sortOptions.find((opt) => opt.value === sortMode);

  // Extract all unique topics
  const allTopics = useMemo(() => {
    const topics = new Set<string>();
    talks.forEach((talk) => {
      talk.topics?.forEach((topic) => topics.add(topic));
    });
    return Array.from(topics).sort();
  }, [talks]);

  // Filter and sort talks
  const filteredTalks = useMemo(() => {
    let result = talks;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (talk) =>
          talk.title.toLowerCase().includes(query) ||
          talk.abstract?.toLowerCase().includes(query) ||
          talk.topics?.some((t) => t.toLowerCase().includes(query))
      );
    }

    // Filter by selected topics
    if (selectedTopics.length > 0) {
      result = result.filter((talk) =>
        selectedTopics.some((topic) => talk.topics?.includes(topic))
      );
    }

    // Sort
    switch (sortMode) {
      case 'popular':
        result = [...result].sort((a, b) => b.eventCount - a.eventCount);
        break;
      case 'recent':
        result = [...result].sort((a, b) => {
          const dateA = a.latestEvent?.date ? new Date(a.latestEvent.date).getTime() : 0;
          const dateB = b.latestEvent?.date ? new Date(b.latestEvent.date).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case 'title':
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return result;
  }, [talks, searchQuery, selectedTopics, sortMode]);

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTopics([]);
  };

  const hasActiveFilters = searchQuery || selectedTopics.length > 0;

  return (
    <div>
      {/* Search and Controls Bar */}
      <div className="mb-8 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-faint"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search talks by title, topic, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-surface-raised border border-edge rounded-xl text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-4">
          {/* View Toggle */}
          <div className="flex items-center gap-1 p-1 bg-surface-overlay rounded-lg border border-edge">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-accent text-white'
                  : 'text-ink-muted hover:text-ink'
              }`}
              title="Grid view"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-accent text-white'
                  : 'text-ink-muted hover:text-ink'
              }`}
              title="List view"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative" ref={sortDropdownRef}>
            <button
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-surface-raised border border-edge rounded-lg text-ink text-sm hover:border-edge-strong transition-colors"
            >
              <span className="text-ink-faint">{currentSort?.icon}</span>
              <span>{currentSort?.label}</span>
              <svg
                className={`w-4 h-4 text-ink-faint transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {sortDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-surface-raised border border-edge rounded-xl shadow-lg overflow-hidden z-20">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortMode(option.value);
                      setSortDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${
                      sortMode === option.value
                        ? 'bg-accent-muted text-accent'
                        : 'text-ink-muted hover:bg-surface-overlay hover:text-ink'
                    }`}
                  >
                    <span className={sortMode === option.value ? 'text-accent' : 'text-ink-faint'}>
                      {option.icon}
                    </span>
                    <span>{option.label}</span>
                    {sortMode === option.value && (
                      <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-accent hover:text-accent-hover font-medium"
            >
              Clear filters
            </button>
          )}

          {/* Results Count */}
          <span className="text-sm text-ink-faint ml-auto">
            {filteredTalks.length} {filteredTalks.length === 1 ? 'talk' : 'talks'}
          </span>
        </div>
      </div>

      {/* Topic Filter Chips */}
      {allTopics.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {allTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => toggleTopic(topic)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedTopics.includes(topic)
                    ? 'bg-accent text-white'
                    : 'bg-surface-overlay text-ink-muted border border-edge hover:border-edge-strong hover:text-ink'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Talks Display */}
      {filteredTalks.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredTalks.map((talk) => (
              <TalkCard key={talk._id} talk={talk} />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTalks.map((talk) => (
              <TalkListItem key={talk._id} talk={talk} />
            ))}
          </div>
        )
      ) : (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-ink-muted mb-4">No talks match your filters.</p>
          <button onClick={clearFilters} className="link">
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}

function TalkCard({ talk }: { talk: Talk }) {
  const isPopular = talk.eventCount >= 5;
  const isNew = talk.eventCount === 0;
  const hasVersions = typeof talk.versionCount === 'number' && talk.versionCount > 1;

  return (
    <a
      href={`/talks/${talk.slug}`}
      className="card card-interactive group p-6 flex flex-col h-full"
    >
      {/* Header with badges */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex flex-wrap gap-2">
          {isPopular && (
            <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
              Popular
            </span>
          )}
          {isNew && (
            <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full">
              New
            </span>
          )}
          {hasVersions && (
            <span className="px-2 py-0.5 text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded-full flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {talk.versionCount} versions
            </span>
          )}
          {hasVersions && talk.version && (
            <span className="px-2 py-0.5 text-xs font-mono text-ink-faint bg-surface-overlay rounded">
              {talk.version}
            </span>
          )}
        </div>
        {talk.duration && (
          <span className="flex items-center gap-1 text-xs text-ink-faint whitespace-nowrap">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {talk.duration} min
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-display font-semibold text-lg text-ink mb-3 group-hover:text-accent transition-colors line-clamp-2">
        {talk.title}
      </h3>

      {/* Abstract */}
      {talk.abstract && (
        <p className="text-ink-muted text-sm mb-4 line-clamp-3 flex-grow">{talk.abstract}</p>
      )}

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-edge">
        <div className="flex items-center justify-between">
          {/* Event count */}
          <div className="flex items-center gap-4">
            {talk.eventCount > 0 && (
              <span className="flex items-center gap-1.5 text-sm text-accent">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {talk.eventCount}×
              </span>
            )}
          </div>

          {/* Topics */}
          {talk.topics && talk.topics.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-end">
              {talk.topics.slice(0, 2).map((topic) => (
                <span
                  key={topic}
                  className="px-2 py-0.5 text-xs bg-surface-overlay text-ink-faint rounded"
                >
                  {topic}
                </span>
              ))}
              {talk.topics.length > 2 && (
                <span className="px-2 py-0.5 text-xs text-ink-faint">
                  +{talk.topics.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </a>
  );
}

function TalkListItem({ talk }: { talk: Talk }) {
  const isPopular = talk.eventCount >= 5;

  return (
    <a
      href={`/talks/${talk.slug}`}
      className="flex items-center gap-4 p-4 -mx-4 rounded-xl hover:bg-surface-overlay transition-colors group"
    >
      {/* Event count indicator */}
      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-surface-overlay border border-edge flex flex-col items-center justify-center">
        <span className="text-lg font-display font-bold text-ink">{talk.eventCount}</span>
        <span className="text-[10px] text-ink-faint uppercase tracking-wider">times</span>
      </div>

      {/* Content */}
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-ink group-hover:text-accent transition-colors truncate">
            {talk.title}
          </h3>
          {isPopular && (
            <span className="flex-shrink-0 px-1.5 py-0.5 text-[10px] font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded">
              Popular
            </span>
          )}
        </div>
        {talk.topics && talk.topics.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-ink-muted">
            {talk.topics.slice(0, 3).join(' · ')}
          </div>
        )}
      </div>

      {/* Duration & Arrow */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {talk.duration && (
          <span className="text-sm text-ink-faint hidden sm:block">{talk.duration} min</span>
        )}
        <svg
          className="w-5 h-5 text-ink-faint group-hover:text-accent group-hover:translate-x-1 transition-all"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  );
}
