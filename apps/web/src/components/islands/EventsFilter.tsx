import { useState, useMemo, useRef, useEffect } from 'react';

interface Event {
  _id: string;
  title: string;
  slug: string;
  type: string;
  conference: string;
  date: string;
  location?: {
    city?: string;
    country?: string;
    isOnline?: boolean;
  };
  description?: string;
  talk?: {
    _id: string;
    title: string;
    slug: string;
  };
  links?: {
    eventUrl?: string;
    videoUrl?: string;
    slidesUrl?: string;
  };
  featured?: boolean;
}

interface EventsFilterProps {
  events: Event[];
  upcomingOnly?: boolean;
  pastOnly?: boolean;
  showArchiveLink?: boolean;
  splitByTime?: boolean; // Show upcoming first, then past with divider
}

// Country flag helper - inline since functions can't be passed from Astro
const countryToCode: Record<string, string> = {
  'United Kingdom': 'GB',
  'United States': 'US',
  'Switzerland': 'CH',
  'Greece': 'GR',
  'Italy': 'IT',
  'Germany': 'DE',
  'Singapore': 'SG',
  'Thailand': 'TH',
  'Portugal': 'PT',
  'Macedonia': 'MK',
  'Spain': 'ES',
  'France': 'FR',
  'Netherlands': 'NL',
  'Belgium': 'BE',
  'Austria': 'AT',
  'Poland': 'PL',
  'Czech Republic': 'CZ',
  'Sweden': 'SE',
  'Norway': 'NO',
  'Denmark': 'DK',
  'Finland': 'FI',
  'Ireland': 'IE',
  'Australia': 'AU',
  'Canada': 'CA',
  'Japan': 'JP',
  'South Korea': 'KR',
  'India': 'IN',
  'Brazil': 'BR',
  'Mexico': 'MX',
  'Argentina': 'AR',
  'Israel': 'IL',
  'UAE': 'AE',
  'Online': '🌐',
};

function getCountryFlag(countryName?: string): string {
  if (!countryName) return '🌐';

  const code = countryToCode[countryName];
  if (code === '🌐') return code;

  if (code) {
    // Convert country code to flag emoji
    const codePoints = code
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }

  return '🌐';
}

type ViewMode = 'timeline' | 'compact';
type FilterType = 'all' | 'conference' | 'workshop' | 'meetup' | 'podcast' | 'panel' | 'hosting' | 'attending' | 'other';

const ITEMS_PER_PAGE = 10;

export default function EventsFilter({ events, upcomingOnly = false, pastOnly = false, showArchiveLink = false, splitByTime = false }: EventsFilterProps) {
  const now = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Pre-filter and sort events
  const baseEvents = useMemo(() => {
    if (upcomingOnly) {
      const filtered = events.filter((event) => new Date(event.date) >= now);
      // Sort ascending (soonest first) for upcoming events
      return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    if (pastOnly) {
      const filtered = events.filter((event) => new Date(event.date) < now);
      // Sort descending (most recent first) for past events
      return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    if (splitByTime) {
      // Split into upcoming and past, upcoming first (ascending), then past (descending)
      const upcoming = events
        .filter((event) => new Date(event.date) >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const past = events
        .filter((event) => new Date(event.date) < now)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return [...upcoming, ...past];
    }

    // Sort descending (most recent first) for all events
    return [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [events, upcomingOnly, pastOnly, splitByTime, now]);

  // Split filtered events into upcoming and past for rendering with divider
  const { upcomingFiltered, pastFiltered } = useMemo(() => {
    if (!splitByTime) return { upcomingFiltered: [], pastFiltered: [] };
    return {
      upcomingFiltered: baseEvents.filter((event) => new Date(event.date) >= now),
      pastFiltered: baseEvents.filter((event) => new Date(event.date) < now),
    };
  }, [baseEvents, splitByTime, now]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<FilterType>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [showWithVideoOnly, setShowWithVideoOnly] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const yearDropdownRef = useRef<HTMLDivElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target as Node)) {
        setYearDropdownOpen(false);
      }
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setCountryDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Extract unique years, countries, and event types
  const { years, countries, typeCounts } = useMemo(() => {
    const yearsSet = new Set<string>();
    const countriesSet = new Set<string>();
    const typeCountMap: Record<string, number> = {};

    baseEvents.forEach((event) => {
      const year = new Date(event.date).getFullYear().toString();
      yearsSet.add(year);

      if (event.location?.country) {
        countriesSet.add(event.location.country);
      }

      const eventType = event.type || 'other';
      typeCountMap[eventType] = (typeCountMap[eventType] || 0) + 1;
    });

    return {
      years: Array.from(yearsSet).sort((a, b) => parseInt(b) - parseInt(a)),
      countries: Array.from(countriesSet).sort(),
      typeCounts: typeCountMap,
    };
  }, [baseEvents]);

  // Filter events
  const filteredEvents = useMemo(() => {
    let result = baseEvents;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.conference.toLowerCase().includes(query) ||
          event.location?.city?.toLowerCase().includes(query) ||
          event.location?.country?.toLowerCase().includes(query)
      );
    }

    // Filter by type
    if (selectedType !== 'all') {
      if (selectedType === 'other') {
        result = result.filter(
          (e) => !['conference', 'workshop', 'meetup', 'podcast', 'panel', 'hosting', 'attending'].includes(e.type)
        );
      } else {
        result = result.filter((e) => e.type === selectedType);
      }
    }

    // Filter by year
    if (selectedYear !== 'all') {
      result = result.filter(
        (e) => new Date(e.date).getFullYear().toString() === selectedYear
      );
    }

    // Filter by country
    if (selectedCountry !== 'all') {
      result = result.filter((e) => e.location?.country === selectedCountry);
    }

    // Filter by video availability
    if (showWithVideoOnly) {
      result = result.filter((e) => e.links?.videoUrl);
    }

    return result;
  }, [baseEvents, searchQuery, selectedType, selectedYear, selectedCountry, showWithVideoOnly]);

  // Split filtered events for splitByTime mode
  const { filteredUpcoming, filteredPast } = useMemo(() => {
    if (!splitByTime) return { filteredUpcoming: [], filteredPast: [] };
    return {
      filteredUpcoming: filteredEvents.filter((event) => new Date(event.date) >= now),
      filteredPast: filteredEvents.filter((event) => new Date(event.date) < now),
    };
  }, [filteredEvents, splitByTime, now]);

  // Group filtered events by year for timeline view
  const eventsByYear = useMemo(() => {
    const grouped: Record<string, Event[]> = {};
    filteredEvents.forEach((event) => {
      const year = new Date(event.date).getFullYear().toString();
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(event);
    });
    return grouped;
  }, [filteredEvents]);

  // Group by year for splitByTime mode
  const { upcomingByYear, pastByYear } = useMemo(() => {
    if (!splitByTime) return { upcomingByYear: {}, pastByYear: {} };

    const upcomingGrouped: Record<string, Event[]> = {};
    const pastGrouped: Record<string, Event[]> = {};

    filteredUpcoming.forEach((event) => {
      const year = new Date(event.date).getFullYear().toString();
      if (!upcomingGrouped[year]) upcomingGrouped[year] = [];
      upcomingGrouped[year].push(event);
    });

    filteredPast.forEach((event) => {
      const year = new Date(event.date).getFullYear().toString();
      if (!pastGrouped[year]) pastGrouped[year] = [];
      pastGrouped[year].push(event);
    });

    return { upcomingByYear: upcomingGrouped, pastByYear: pastGrouped };
  }, [filteredUpcoming, filteredPast, splitByTime]);

  const sortedUpcomingYears = Object.keys(upcomingByYear).sort((a, b) => parseInt(a) - parseInt(b));
  const sortedPastYears = Object.keys(pastByYear).sort((a, b) => parseInt(b) - parseInt(a));

  // Sort years: ascending for upcoming (2025 first), descending for past/all events (most recent first)
  const sortedYears = Object.keys(eventsByYear).sort((a, b) =>
    upcomingOnly
      ? parseInt(a) - parseInt(b)  // Ascending for upcoming
      : parseInt(b) - parseInt(a)  // Descending for past/all events
  );

  // Pagination for grid view
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredEvents, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedType, selectedYear, selectedCountry, showWithVideoOnly]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedYear('all');
    setSelectedCountry('all');
    setShowWithVideoOnly(false);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery ||
    selectedType !== 'all' ||
    selectedYear !== 'all' ||
    selectedCountry !== 'all' ||
    showWithVideoOnly;

  const typeLabels: Record<string, string> = {
    conference: 'Conferences',
    workshop: 'Workshops',
    meetup: 'Meetups',
    podcast: 'Podcasts',
    panel: 'Panels',
    hosting: 'Hosting',
    attending: 'Attending',
    other: 'Other',
  };

  return (
    <div className="events-filter">
      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Input with enhanced styling */}
        <div className={`search-wrapper ${isSearchFocused ? 'search-wrapper--focused' : ''}`}>
          <div className="search-icon">
            <svg
              className="w-5 h-5"
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
          </div>
          <input
            type="text"
            placeholder="Search events, conferences, or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="search-clear"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* View Toggle with animation */}
          <div className="view-toggle">
            <button
              onClick={() => setViewMode('timeline')}
              className={`view-toggle__btn ${viewMode === 'timeline' ? 'view-toggle__btn--active' : ''}`}
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Timeline
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`view-toggle__btn ${viewMode === 'compact' ? 'view-toggle__btn--active' : ''}`}
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Grid
            </button>
          </div>

          {/* Year Filter - hide for upcoming only view */}
          {!upcomingOnly && (
            <div className="relative" ref={yearDropdownRef}>
              <button
                onClick={() => {
                  setYearDropdownOpen(!yearDropdownOpen);
                  setCountryDropdownOpen(false);
                }}
                className="filter-dropdown-btn"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{selectedYear === 'all' ? 'All years' : selectedYear}</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${yearDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {yearDropdownOpen && (
                <div className="filter-dropdown">
                  <button
                    onClick={() => {
                      setSelectedYear('all');
                      setYearDropdownOpen(false);
                    }}
                    className={`filter-dropdown__item ${selectedYear === 'all' ? 'filter-dropdown__item--active' : ''}`}
                  >
                    All years
                    {selectedYear === 'all' && <CheckIcon />}
                  </button>
                  {years.map((year) => (
                    <button
                      key={year}
                      onClick={() => {
                        setSelectedYear(year);
                        setYearDropdownOpen(false);
                      }}
                      className={`filter-dropdown__item ${selectedYear === year ? 'filter-dropdown__item--active' : ''}`}
                    >
                      {year}
                      {selectedYear === year && <CheckIcon />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Country Filter */}
          <div className="relative" ref={countryDropdownRef}>
            <button
              onClick={() => {
                setCountryDropdownOpen(!countryDropdownOpen);
                setYearDropdownOpen(false);
              }}
              className="filter-dropdown-btn"
            >
              <span className="text-base">{selectedCountry === 'all' ? '🌍' : getCountryFlag(selectedCountry)}</span>
              <span>{selectedCountry === 'all' ? 'All countries' : selectedCountry}</span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${countryDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {countryDropdownOpen && (
              <div className="filter-dropdown filter-dropdown--wide">
                <button
                  onClick={() => {
                    setSelectedCountry('all');
                    setCountryDropdownOpen(false);
                  }}
                  className={`filter-dropdown__item ${selectedCountry === 'all' ? 'filter-dropdown__item--active' : ''}`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">🌍</span>
                    All countries
                  </span>
                  {selectedCountry === 'all' && <CheckIcon />}
                </button>
                {countries.map((country) => (
                  <button
                    key={country}
                    onClick={() => {
                      setSelectedCountry(country);
                      setCountryDropdownOpen(false);
                    }}
                    className={`filter-dropdown__item ${selectedCountry === country ? 'filter-dropdown__item--active' : ''}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{getCountryFlag(country)}</span>
                      {country}
                    </span>
                    {selectedCountry === country && <CheckIcon />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Video Only Toggle - hide for upcoming only view since they won't have videos */}
          {!upcomingOnly && (
            <label className="video-toggle">
              <input
                type="checkbox"
                checked={showWithVideoOnly}
                onChange={(e) => setShowWithVideoOnly(e.target.checked)}
                className="video-toggle__input"
              />
              <span className={`video-toggle__track ${showWithVideoOnly ? 'video-toggle__track--active' : ''}`}>
                <span className="video-toggle__thumb" />
              </span>
              <span className="video-toggle__label">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                Has video
              </span>
            </label>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="clear-filters-btn"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear filters
            </button>
          )}

          {/* Results Count */}
          <span className="results-count">
            <span className="results-count__number">{filteredEvents.length}</span>
            {filteredEvents.length === 1 ? 'event' : 'events'}
          </span>
        </div>
      </div>

      {/* Type Filter Chips */}
      <div className="mb-8">
        <div className="type-chips">
          <button
            onClick={() => setSelectedType('all')}
            className={`type-chip ${selectedType === 'all' ? 'type-chip--active' : ''}`}
          >
            <span className="type-chip__label">All</span>
            <span className="type-chip__count">{events.length}</span>
          </button>
          {Object.entries(typeLabels).map(([type, label]) => {
            const count = typeCounts[type] || 0;
            if (count === 0) return null;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type as FilterType)}
                className={`type-chip type-chip--${type} ${selectedType === type ? 'type-chip--active' : ''}`}
              >
                <span className="type-chip__label">{label}</span>
                <span className="type-chip__count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Events Display */}
      {filteredEvents.length > 0 ? (
        viewMode === 'timeline' ? (
          <div className="timeline-view">
            {splitByTime ? (
              <>
                {/* Upcoming Events */}
                {filteredUpcoming.length > 0 && (
                  <>
                    <div className="timeline-section-header">
                      <div className="timeline-section-header__dot timeline-section-header__dot--upcoming"></div>
                      <span className="timeline-section-header__label">Upcoming</span>
                      <span className="timeline-section-header__count">{filteredUpcoming.length}</span>
                    </div>
                    {sortedUpcomingYears.map((year, yearIndex) => (
                      <div key={`upcoming-${year}`} className="timeline-year" style={{ '--year-index': yearIndex } as React.CSSProperties}>
                        <div className="timeline-year__header">
                          <h2 className="timeline-year__title">
                            {year}
                            <span className="timeline-year__count">({upcomingByYear[year].length})</span>
                          </h2>
                          <div className="timeline-year__line" />
                        </div>
                        <div className="timeline-events">
                          {upcomingByYear[year].map((event, eventIndex) => (
                            <EventRow key={event._id} event={event} index={eventIndex} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {/* Divider */}
                {filteredUpcoming.length > 0 && filteredPast.length > 0 && (
                  <div className="timeline-divider">
                    <div className="timeline-divider__line"></div>
                    <span className="timeline-divider__label">Past Events</span>
                    <div className="timeline-divider__line"></div>
                  </div>
                )}

                {/* Past Events */}
                {filteredPast.length > 0 && (
                  <>
                    {filteredUpcoming.length === 0 && (
                      <div className="timeline-section-header">
                        <span className="timeline-section-header__label">Past Events</span>
                        <span className="timeline-section-header__count">{filteredPast.length}</span>
                      </div>
                    )}
                    {sortedPastYears.map((year, yearIndex) => (
                      <div key={`past-${year}`} className="timeline-year" style={{ '--year-index': yearIndex } as React.CSSProperties}>
                        <div className="timeline-year__header">
                          <h2 className="timeline-year__title">
                            {year}
                            <span className="timeline-year__count">({pastByYear[year].length})</span>
                          </h2>
                          <div className="timeline-year__line" />
                        </div>
                        <div className="timeline-events">
                          {pastByYear[year].map((event, eventIndex) => (
                            <EventRow key={event._id} event={event} index={eventIndex} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </>
            ) : (
              sortedYears.map((year, yearIndex) => (
                <div key={year} className="timeline-year" style={{ '--year-index': yearIndex } as React.CSSProperties}>
                  <div className="timeline-year__header">
                    <h2 className="timeline-year__title">
                      {year}
                      <span className="timeline-year__count">({eventsByYear[year].length})</span>
                    </h2>
                    <div className="timeline-year__line" />
                  </div>
                  <div className="timeline-events">
                    {eventsByYear[year].map((event, eventIndex) => (
                      <EventRow key={event._id} event={event} index={eventIndex} />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <>
            <div className="grid-view">
              {paginatedEvents.map((event, index) => (
                <EventCard key={event._id} event={event} index={index} />
              ))}
            </div>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`pagination__btn ${currentPage === 1 ? 'pagination__btn--disabled' : ''}`}
                  aria-label="Previous page"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="pagination__pages">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                    // Show first, last, current, and adjacent pages
                    const showPage = page === 1 ||
                                     page === totalPages ||
                                     Math.abs(page - currentPage) <= 1;
                    const showEllipsis = !showPage &&
                                         (page === 2 || page === totalPages - 1);

                    if (showEllipsis) {
                      return <span key={page} className="pagination__ellipsis">...</span>;
                    }

                    if (!showPage) return null;

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`pagination__page ${currentPage === page ? 'pagination__page--active' : ''}`}
                        aria-label={`Page ${page}`}
                        aria-current={currentPage === page ? 'page' : undefined}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`pagination__btn ${currentPage === totalPages ? 'pagination__btn--disabled' : ''}`}
                  aria-label="Next page"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <span className="pagination__info">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            )}
          </>
        )
      ) : (
        <div className="empty-state">
          <div className="empty-state__icon">🔍</div>
          <p className="empty-state__text">No events match your filters.</p>
          <button onClick={clearFilters} className="empty-state__link">
            Clear all filters
          </button>
        </div>
      )}

      {/* Archive Link */}
      {showArchiveLink && (
        <div className="archive-link-wrapper">
          <a href="/events" className="archive-link group">
            <div className="archive-link__content">
              <h3 className="archive-link__title">Browse All Events</h3>
              <p className="archive-link__desc">View the complete archive of past and upcoming speaking engagements</p>
            </div>
            <div className="archive-link__arrow">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>
        </div>
      )}

      <style>{`
        .events-filter {
          --accent-rgb: 99, 102, 241;
        }

        /* Search Input */
        .search-wrapper {
          position: relative;
          transition: all 0.3s ease;
        }

        .search-wrapper--focused {
          transform: translateY(-2px);
        }

        .search-wrapper--focused .search-input {
          border-color: rgb(var(--accent));
          box-shadow: 0 0 0 3px rgb(var(--accent) / 0.1), 0 10px 40px -10px rgb(var(--accent) / 0.2);
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: rgb(var(--ink-faint));
          transition: color 0.2s ease;
        }

        .search-wrapper--focused .search-icon {
          color: rgb(var(--accent));
        }

        .search-input {
          width: 100%;
          padding: 0.875rem 2.5rem 0.875rem 3rem;
          background: rgb(var(--surface-raised));
          border: 1px solid rgb(var(--edge));
          border-radius: 1rem;
          color: rgb(var(--ink));
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .search-input::placeholder {
          color: rgb(var(--ink-faint));
        }

        .search-input:focus {
          outline: none;
        }

        .search-clear {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          padding: 0.25rem;
          color: rgb(var(--ink-faint));
          border-radius: 0.375rem;
          transition: all 0.2s ease;
        }

        .search-clear:hover {
          color: rgb(var(--ink));
          background: rgb(var(--surface-overlay));
        }

        /* View Toggle */
        .view-toggle {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem;
          background: rgb(var(--surface-overlay));
          border: 1px solid rgb(var(--edge));
          border-radius: 0.75rem;
        }

        .view-toggle__btn {
          display: flex;
          align-items: center;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: rgb(var(--ink-muted));
          border-radius: 0.5rem;
          transition: all 0.2s ease;
        }

        .view-toggle__btn:hover {
          color: rgb(var(--ink));
        }

        .view-toggle__btn--active {
          background: rgb(var(--accent));
          color: white;
          box-shadow: 0 2px 8px rgb(var(--accent) / 0.3);
        }

        /* Filter Dropdown Button */
        .filter-dropdown-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: rgb(var(--surface-raised));
          border: 1px solid rgb(var(--edge));
          border-radius: 0.75rem;
          color: rgb(var(--ink));
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }

        .filter-dropdown-btn:hover {
          border-color: rgb(var(--edge-strong));
          background: rgb(var(--surface-overlay));
        }

        /* Filter Dropdown */
        .filter-dropdown {
          position: absolute;
          top: calc(100% + 0.5rem);
          left: 0;
          width: 10rem;
          max-height: 16rem;
          overflow-y: auto;
          background: rgb(var(--surface-raised));
          border: 1px solid rgb(var(--edge));
          border-radius: 1rem;
          box-shadow: 0 20px 40px -10px rgb(0 0 0 / 0.15);
          z-index: 20;
          animation: dropdown-enter 0.2s ease;
        }

        .filter-dropdown--wide {
          width: 14rem;
        }

        @keyframes dropdown-enter {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .filter-dropdown__item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          color: rgb(var(--ink-muted));
          text-align: left;
          transition: all 0.15s ease;
        }

        .filter-dropdown__item:hover {
          background: rgb(var(--surface-overlay));
          color: rgb(var(--ink));
        }

        .filter-dropdown__item--active {
          background: rgb(var(--accent) / 0.1);
          color: rgb(var(--accent));
        }

        /* Video Toggle */
        .video-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .video-toggle__input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .video-toggle__track {
          position: relative;
          width: 2.5rem;
          height: 1.5rem;
          background: rgb(var(--edge));
          border-radius: 9999px;
          transition: all 0.2s ease;
        }

        .video-toggle__track--active {
          background: rgb(var(--accent));
        }

        .video-toggle__thumb {
          position: absolute;
          top: 0.125rem;
          left: 0.125rem;
          width: 1.25rem;
          height: 1.25rem;
          background: white;
          border-radius: 9999px;
          transition: transform 0.2s ease;
          box-shadow: 0 2px 4px rgb(0 0 0 / 0.1);
        }

        .video-toggle__track--active .video-toggle__thumb {
          transform: translateX(1rem);
        }

        .video-toggle__label {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.875rem;
          color: rgb(var(--ink-muted));
        }

        /* Clear Filters */
        .clear-filters-btn {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: rgb(var(--accent));
          border-radius: 0.5rem;
          transition: all 0.2s ease;
        }

        .clear-filters-btn:hover {
          background: rgb(var(--accent) / 0.1);
        }

        /* Results Count */
        .results-count {
          margin-left: auto;
          font-size: 0.875rem;
          color: rgb(var(--ink-faint));
        }

        .results-count__number {
          font-weight: 600;
          color: rgb(var(--ink-muted));
          margin-right: 0.25rem;
        }

        /* Type Chips */
        .type-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .type-chip {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgb(var(--surface-overlay));
          border: 1px solid rgb(var(--edge));
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
          color: rgb(var(--ink-muted));
          transition: all 0.2s ease;
        }

        .type-chip:hover {
          border-color: rgb(var(--edge-strong));
          color: rgb(var(--ink));
          transform: translateY(-1px);
        }

        .type-chip--active {
          background: rgb(var(--accent));
          border-color: rgb(var(--accent));
          color: white;
          box-shadow: 0 4px 12px rgb(var(--accent) / 0.3);
        }

        .type-chip__count {
          padding: 0.125rem 0.375rem;
          background: rgb(var(--surface) / 0.2);
          border-radius: 9999px;
          font-size: 0.75rem;
        }

        .type-chip--active .type-chip__count {
          background: rgb(255 255 255 / 0.2);
        }

        /* Timeline View */
        .timeline-view {
          position: relative;
        }

        .timeline-year {
          margin-bottom: 3rem;
          animation: timeline-year-enter 0.5s ease calc(var(--year-index) * 0.1s) both;
        }

        @keyframes timeline-year-enter {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .timeline-year__header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          position: sticky;
          top: 5rem;
          z-index: 10;
          padding: 0.5rem 0;
          background: rgb(var(--surface));
        }

        .timeline-year__title {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 700;
          color: rgb(var(--ink));
          white-space: nowrap;
        }

        .timeline-year__count {
          font-size: 1rem;
          font-weight: 400;
          color: rgb(var(--ink-faint));
          margin-left: 0.5rem;
        }

        .timeline-year__line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, rgb(var(--edge)), transparent);
        }

        .timeline-events {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        /* Timeline Section Header */
        .timeline-section-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgb(var(--edge));
        }

        .timeline-section-header__dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgb(var(--ink-faint));
        }

        .timeline-section-header__dot--upcoming {
          background: rgb(16, 185, 129);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .timeline-section-header__label {
          font-family: var(--font-display);
          font-size: 1.125rem;
          font-weight: 600;
          color: rgb(var(--ink));
        }

        .timeline-section-header__count {
          font-size: 0.875rem;
          color: rgb(var(--ink-faint));
        }

        /* Timeline Divider */
        .timeline-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 3rem 0;
        }

        .timeline-divider__line {
          flex: 1;
          height: 1px;
          background: rgb(var(--edge));
        }

        .timeline-divider__label {
          font-size: 0.875rem;
          font-weight: 500;
          color: rgb(var(--ink-muted));
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Grid View */
        .grid-view {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 1rem;
        }

        @media (min-width: 640px) {
          .grid-view {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .grid-view {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        /* Empty State */
        .empty-state {
          padding: 4rem 2rem;
          text-align: center;
          background: rgb(var(--surface-raised));
          border: 1px solid rgb(var(--edge));
          border-radius: 1rem;
        }

        .empty-state__icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .empty-state__text {
          color: rgb(var(--ink-muted));
          margin-bottom: 1rem;
        }

        .empty-state__link {
          color: rgb(var(--accent));
          font-weight: 500;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .empty-state__link:hover {
          text-decoration-thickness: 2px;
        }

        /* Pagination */
        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgb(var(--edge));
        }

        .pagination__btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.75rem;
          background: rgb(var(--surface-raised));
          border: 1px solid rgb(var(--edge));
          color: rgb(var(--ink));
          transition: all 0.2s ease;
        }

        .pagination__btn:hover:not(.pagination__btn--disabled) {
          background: rgb(var(--surface-overlay));
          border-color: rgb(var(--edge-strong));
          transform: translateY(-1px);
        }

        .pagination__btn--disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .pagination__pages {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .pagination__page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 2.5rem;
          height: 2.5rem;
          padding: 0 0.75rem;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: rgb(var(--ink-muted));
          transition: all 0.2s ease;
        }

        .pagination__page:hover:not(.pagination__page--active) {
          background: rgb(var(--surface-overlay));
          color: rgb(var(--ink));
        }

        .pagination__page--active {
          background: rgb(var(--accent));
          color: white;
          box-shadow: 0 4px 12px rgb(var(--accent) / 0.3);
        }

        .pagination__ellipsis {
          padding: 0 0.5rem;
          color: rgb(var(--ink-faint));
        }

        .pagination__info {
          margin-left: 1rem;
          font-size: 0.875rem;
          color: rgb(var(--ink-faint));
        }

        @media (max-width: 640px) {
          .pagination__info {
            display: none;
          }
        }

        /* Archive Link */
        .archive-link-wrapper {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgb(var(--edge));
        }

        .archive-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          padding: 1.5rem 2rem;
          background: rgb(var(--surface-raised));
          border: 1px solid rgb(var(--edge));
          border-radius: 1rem;
          transition: all 0.3s ease;
        }

        .archive-link:hover {
          border-color: rgb(var(--accent) / 0.5);
          box-shadow: 0 10px 40px -10px rgb(var(--accent) / 0.15);
        }

        .archive-link__content {
          flex: 1;
        }

        .archive-link__title {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 600;
          color: rgb(var(--ink));
          margin-bottom: 0.25rem;
          transition: color 0.2s ease;
        }

        .archive-link:hover .archive-link__title {
          color: rgb(var(--accent));
        }

        .archive-link__desc {
          font-size: 0.875rem;
          color: rgb(var(--ink-muted));
        }

        .archive-link__arrow {
          flex-shrink: 0;
          width: 3rem;
          height: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgb(var(--surface-overlay));
          border: 1px solid rgb(var(--edge));
          border-radius: 50%;
          color: rgb(var(--ink-muted));
          transition: all 0.3s ease;
        }

        .archive-link:hover .archive-link__arrow {
          background: rgb(var(--accent));
          border-color: rgb(var(--accent));
          color: white;
        }
      `}</style>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

function EventRow({
  event,
  index,
}: {
  event: Event;
  index: number;
}) {
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
          <span className={`event-row__type event-row__type--${event.type}`}>
            {event.type}
          </span>
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
        <p className="event-row__conference">{event.conference}</p>
      </div>

      {/* Location */}
      <div className="event-row__location">
        <span className="event-row__flag">{getCountryFlag(event.location?.country)}</span>
        <span className="event-row__city">{event.location?.city || 'Online'}</span>
      </div>

      {/* Arrow */}
      <div className="event-row__arrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
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
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .event-row:hover {
          background: rgb(var(--surface-overlay));
        }

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

        .event-row:hover .event-row__glow {
          opacity: 1;
        }

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

        .event-row__content {
          flex: 1;
          min-width: 0;
        }

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
          color: rgb(var(--accent));
        }

        .event-row__type--workshop {
          background: rgb(16 185 129 / 0.1);
          color: rgb(16 185 129);
        }

        .event-row__type--meetup {
          background: rgb(139 92 246 / 0.1);
          color: rgb(139 92 246);
        }

        .event-row__type--podcast {
          background: rgb(244 63 94 / 0.1);
          color: rgb(244 63 94);
        }

        .event-row__type--panel {
          background: rgb(249 115 22 / 0.1);
          color: rgb(249 115 22);
        }

        .event-row__type--hosting {
          background: rgb(6 182 212 / 0.1);
          color: rgb(6 182 212);
        }

        .event-row__type--attending {
          background: rgb(168 85 247 / 0.1);
          color: rgb(168 85 247);
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
          background: rgb(245 158 11 / 0.1);
          color: rgb(245 158 11);
        }

        .event-row__badge--video {
          background: rgb(var(--accent) / 0.1);
          color: rgb(var(--accent));
        }

        .event-row__title {
          font-weight: 600;
          color: rgb(var(--ink));
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 0.2s ease;
        }

        .event-row:hover .event-row__title {
          color: rgb(var(--accent));
        }

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
          .event-row__location {
            display: flex;
          }
        }

        .event-row__flag {
          font-size: 1.25rem;
        }

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
          color: rgb(var(--accent));
          transform: translateX(4px);
        }
      `}</style>
    </a>
  );
}

function EventCard({
  event,
  index,
}: {
  event: Event;
  index: number;
}) {
  const date = new Date(event.date);

  return (
    <a
      href={`/events/${event.slug}`}
      className="event-card"
      style={{ '--card-index': index } as React.CSSProperties}
    >
      {/* Gradient Border */}
      <div className="event-card__border" />

      {/* Content */}
      <div className="event-card__inner">
        {/* Header with badges */}
        <div className="event-card__header">
          <span className={`event-card__type event-card__type--${event.type}`}>
            {event.type}
          </span>
          {event.links?.videoUrl && (
            <span className="event-card__video-badge">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="event-card__title">{event.title}</h3>

        {/* Conference */}
        <p className="event-card__conference">{event.conference}</p>

        {/* Footer */}
        <div className="event-card__footer">
          <div className="event-card__location">
            <span className="event-card__flag">{getCountryFlag(event.location?.country)}</span>
            <span>{event.location?.city || 'Online'}</span>
          </div>
          <div className="event-card__date">
            {date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </div>
        </div>

        {/* Hover Arrow */}
        <div className="event-card__arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <style>{`
        .event-card {
          position: relative;
          display: block;
          text-decoration: none;
          border-radius: 1rem;
          animation: card-enter 0.5s ease calc(var(--card-index) * 0.05s) both;
          transition: transform 0.3s ease;
        }

        @keyframes card-enter {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .event-card:hover {
          transform: translateY(-4px);
        }

        .event-card__border {
          position: absolute;
          inset: 0;
          border-radius: 1rem;
          padding: 1px;
          background: rgb(var(--edge));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          transition: background 0.3s ease;
        }

        .event-card:hover .event-card__border {
          background: linear-gradient(135deg, rgb(var(--accent)), rgb(139 92 246), rgb(236 72 153));
        }

        .event-card__inner {
          position: relative;
          height: 100%;
          padding: 1.25rem;
          background: rgb(var(--surface-raised));
          border-radius: 1rem;
          display: flex;
          flex-direction: column;
          transition: background 0.3s ease;
        }

        .event-card:hover .event-card__inner {
          background: rgb(var(--surface-overlay));
        }

        .event-card__header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .event-card__type {
          padding: 0.25rem 0.625rem;
          font-size: 0.625rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-radius: 0.375rem;
          background: rgb(var(--accent) / 0.1);
          color: rgb(var(--accent));
        }

        .event-card__type--workshop {
          background: rgb(16 185 129 / 0.1);
          color: rgb(16 185 129);
        }

        .event-card__type--meetup {
          background: rgb(139 92 246 / 0.1);
          color: rgb(139 92 246);
        }

        .event-card__type--podcast {
          background: rgb(244 63 94 / 0.1);
          color: rgb(244 63 94);
        }

        .event-card__type--attending {
          background: rgb(168 85 247 / 0.1);
          color: rgb(168 85 247);
        }

        .event-card__video-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.5rem;
          height: 1.5rem;
          background: rgb(var(--accent) / 0.1);
          color: rgb(var(--accent));
          border-radius: 0.375rem;
        }

        .event-card__title {
          font-weight: 600;
          color: rgb(var(--ink));
          margin-bottom: 0.375rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color 0.2s ease;
        }

        .event-card:hover .event-card__title {
          color: rgb(var(--accent));
        }

        .event-card__conference {
          font-size: 0.875rem;
          color: rgb(var(--ink-muted));
          margin-bottom: 1rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .event-card__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          font-size: 0.875rem;
          color: rgb(var(--ink-faint));
        }

        .event-card__location {
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }

        .event-card__flag {
          font-size: 1rem;
        }

        .event-card__arrow {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgb(var(--surface));
          border-radius: 50%;
          color: rgb(var(--ink-faint));
          opacity: 0;
          transform: translate(-8px, 8px);
          transition: all 0.3s ease;
        }

        .event-card:hover .event-card__arrow {
          opacity: 1;
          transform: translate(0, 0);
          color: rgb(var(--accent));
        }

        .event-card__arrow svg {
          width: 1rem;
          height: 1rem;
        }
      `}</style>
    </a>
  );
}
