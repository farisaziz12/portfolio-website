import { useState, useEffect, useCallback } from 'react';

interface Event {
  _id: string;
  title: string;
  slug: string;
  date: string;
  conference?: string;
  location?: {
    city?: string;
    country?: string;
  };
}

interface EventCarouselProps {
  events: Event[];
}

// Country flag mapping (inlined to avoid serialization issues with Astro islands)
const COUNTRY_FLAGS: Record<string, string> = {
  'United Kingdom': '🇬🇧',
  'United States': '🇺🇸',
  'Switzerland': '🇨🇭',
  'Greece': '🇬🇷',
  'Italy': '🇮🇹',
  'Germany': '🇩🇪',
  'Singapore': '🇸🇬',
  'Thailand': '🇹🇭',
  'Portugal': '🇵🇹',
  'Macedonia': '🇲🇰',
  'Czech Republic': '🇨🇿',
  'Online': '🌐',
};

function getCountryFlag(countryName: string): string {
  return COUNTRY_FLAGS[countryName] || '';
}

export default function EventCarousel({ events }: EventCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setDirection('next');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
      setIsAnimating(false);
    }, 150);
  }, [events.length, isAnimating]);

  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    setDirection('prev');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
      setIsAnimating(false);
    }, 150);
  }, [events.length, isAnimating]);

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setDirection(index > currentIndex ? 'next' : 'prev');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsAnimating(false);
    }, 150);
  };

  // Auto-advance every 6 seconds
  useEffect(() => {
    if (isPaused || events.length <= 1) return;

    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, events.length]);

  if (events.length === 0) return null;

  const event = events[currentIndex];
  const eventDate = new Date(event.date);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Event Display */}
      <a
        href={`/events/${event.slug}`}
        className="group block"
      >
        <div
          className={`flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 transition-all duration-300 ease-out ${
            isAnimating
              ? direction === 'next'
                ? 'opacity-0 translate-x-4'
                : 'opacity-0 -translate-x-4'
              : 'opacity-100 translate-x-0'
          }`}
        >
          {/* Date Badge */}
          <div className="flex-shrink-0 bg-accent/10 dark:bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-center min-w-[80px]">
            <div className="text-3xl sm:text-4xl font-display font-bold text-accent dark:text-white">
              {eventDate.getDate()}
            </div>
            <div className="text-xs uppercase text-accent/60 dark:text-white/60 tracking-wider">
              {eventDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </div>
          </div>

          {/* Event Info */}
          <div className="flex-grow min-w-0">
            <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white group-hover:text-accent dark:group-hover:text-indigo-300 transition-colors line-clamp-2 sm:line-clamp-1">
              {event.title}
            </h3>
            {event.conference && (
              <p className="text-slate-600 dark:text-white/60 mt-1 truncate">
                {event.conference}
              </p>
            )}
            {(event.location?.city || event.location?.country) && (
              <div className="flex items-center gap-2 mt-2 text-slate-500 dark:text-white/50 text-sm">
                <span className="text-lg">{getCountryFlag(event.location?.country || '')}</span>
                <span>
                  {[event.location?.city, event.location?.country].filter(Boolean).join(', ')}
                </span>
              </div>
            )}
          </div>

          {/* View Button */}
          <div className="flex-shrink-0 hidden sm:flex items-center gap-2 text-sm text-accent dark:text-indigo-400 group-hover:text-accent/80 dark:group-hover:text-indigo-300 transition-colors">
            <span>View event</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </a>

      {/* Navigation */}
      {events.length > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200 dark:border-white/10">
          {/* Dots */}
          <div className="flex items-center gap-2">
            {events.slice(0, 5).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-accent dark:bg-indigo-400 w-6'
                    : 'bg-slate-300 dark:bg-white/30 hover:bg-slate-400 dark:hover:bg-white/50 w-2'
                }`}
                aria-label={`Go to event ${index + 1}`}
              />
            ))}
            {events.length > 5 && (
              <span className="text-xs text-slate-400 dark:text-white/40 ml-1">+{events.length - 5}</span>
            )}
          </div>

          {/* Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Previous event"
            >
              <svg className="w-4 h-4 text-slate-600 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Next event"
            >
              <svg className="w-4 h-4 text-slate-600 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
