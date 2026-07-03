import { useState, useMemo } from 'react';

interface SocialPost {
  _id: string;
  platform: 'twitter' | 'linkedin';
  author: string;
  authorRole?: string;
  authorHandle?: string;
  authorImage?: string;
  content: string;
  url: string;
  postDate?: string;
}

interface Testimonial {
  _id: string;
  type?: 'linkedin' | 'mentorcruise' | 'workshop' | 'talk' | 'other';
  author: string;
  role?: string;
  company?: string;
  quote: string;
  context?: string;
  rating?: number;
  source?: string;
  date?: string;
  image?: string;
}

interface AppreciationFilterProps {
  socialPosts: SocialPost[];
  testimonials: Testimonial[];
  socialPostImages: Record<string, string>;
  testimonialImages: Record<string, string>;
}

type MainTab = 'social' | 'testimonials';
type PlatformFilter = 'all' | 'twitter' | 'linkedin';
type TestimonialFilter = 'all' | 'linkedin' | 'mentorcruise' | 'workshop' | 'talk';

const contextLabels: Record<string, string> = {
  worked_together: 'Worked together',
  managed: 'Managed directly',
  reported: 'Reported to Faris',
  mentored: 'Mentored by Faris',
  workshop_attendee: 'Workshop attendee',
  conference_attendee: 'Conference attendee',
  speaking: 'Speaking engagement',
  consulting: 'Consulting client',
  collaboration: 'Collaboration',
};

const typeLabels: Record<string, string> = {
  linkedin: 'LinkedIn',
  workshop: 'Workshop',
  talk: 'Conference',
  mentorcruise: 'MentorCruise',
  other: 'Review',
};

function getContextLabel(context: string): string {
  return contextLabels[context] || context;
}

function getTypeLabel(type: string): string {
  return typeLabels[type] || 'Review';
}

export default function AppreciationFilter({
  socialPosts,
  testimonials,
  socialPostImages,
  testimonialImages,
}: AppreciationFilterProps) {
  const [activeTab, setActiveTab] = useState<MainTab>('social');
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>('all');
  const [testimonialFilter, setTestimonialFilter] = useState<TestimonialFilter>('all');
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  // Calculate stats
  const stats = useMemo(() => ({
    posts: socialPosts.length,
    testimonials: testimonials.length,
    linkedinRecs: testimonials.filter(t => t.type === 'linkedin').length,
    mentorcruiseRecs: testimonials.filter(t => t.type === 'mentorcruise').length,
    workshopRecs: testimonials.filter(t => t.type === 'workshop').length,
    talkRecs: testimonials.filter(t => t.type === 'talk').length,
  }), [socialPosts, testimonials]);

  // Filter social posts
  const filteredPosts = useMemo(() => {
    if (platformFilter === 'all') return socialPosts;
    return socialPosts.filter(post => post.platform === platformFilter);
  }, [socialPosts, platformFilter]);

  // Filter testimonials
  const filteredTestimonials = useMemo(() => {
    if (testimonialFilter === 'all') return testimonials;
    return testimonials.filter(t => t.type === testimonialFilter);
  }, [testimonials, testimonialFilter]);

  const toggleExpand = (postId: string) => {
    setExpandedPostId(prev => prev === postId ? null : postId);
  };

  return (
    <div className="appreciation-container">
      {/* Modern Segmented Tabs */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex p-1.5 bg-surface-2 rounded-2xl gap-1">
          <button
            onClick={() => setActiveTab('social')}
            className={`
              relative flex items-center gap-3 px-6 py-3.5 rounded-xl font-medium text-sm transition-all duration-200
              ${activeTab === 'social'
                ? 'bg-surface-3 text-ink shadow-lg shadow-black/20'
                : 'text-ink-muted hover:text-ink'
              }
            `}
          >
            <span className={`
              flex items-center justify-center w-8 h-8 rounded-lg transition-colors
              ${activeTab === 'social'
                ? 'bg-accent text-white'
                : 'bg-surface-3 text-ink-muted'
              }
            `}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="hidden sm:inline">Social Mentions</span>
            <span className="sm:hidden">Social</span>
            <span className={`
              px-2 py-0.5 text-xs font-semibold rounded-full transition-colors
              ${activeTab === 'social'
                ? 'bg-accent/10 text-accent'
                : 'bg-surface-3 text-ink-muted'
              }
            `}>
              {stats.posts}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('testimonials')}
            className={`
              relative flex items-center gap-3 px-6 py-3.5 rounded-xl font-medium text-sm transition-all duration-200
              ${activeTab === 'testimonials'
                ? 'bg-surface-3 text-ink shadow-lg shadow-black/20'
                : 'text-ink-muted hover:text-ink'
              }
            `}
          >
            <span className={`
              flex items-center justify-center w-8 h-8 rounded-lg transition-colors
              ${activeTab === 'testimonials'
                ? 'bg-accent text-white'
                : 'bg-surface-3 text-ink-muted'
              }
            `}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
              </svg>
            </span>
            <span>Testimonials</span>
            <span className={`
              px-2 py-0.5 text-xs font-semibold rounded-full transition-colors
              ${activeTab === 'testimonials'
                ? 'bg-accent/10 text-accent'
                : 'bg-surface-3 text-ink-muted'
              }
            `}>
              {stats.testimonials}
            </span>
          </button>
        </div>
      </div>

      {/* Social Mentions Panel */}
      {activeTab === 'social' && (
        <div className="animate-fadeIn">
          {/* Platform Filter - Pill Style */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setPlatformFilter('all')}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${platformFilter === 'all'
                  ? 'bg-ink text-bg shadow-lg'
                  : 'bg-surface-2 text-ink-muted border border-edge hover:border-edge-strong'
                }
              `}
            >
              All platforms
            </button>
            <button
              onClick={() => setPlatformFilter('twitter')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${platformFilter === 'twitter'
                  ? 'bg-black text-white shadow-lg'
                  : 'bg-surface-2 text-ink-muted border border-edge hover:border-edge-strong'
                }
              `}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              X / Twitter
            </button>
            <button
              onClick={() => setPlatformFilter('linkedin')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${platformFilter === 'linkedin'
                  ? 'bg-[#0a66c2] text-white shadow-lg shadow-[#0a66c2]/25'
                  : 'bg-surface-2 text-ink-muted border border-edge hover:border-edge-strong'
                }
              `}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </button>
          </div>

          {/* Results count */}
          <p className="text-center text-sm text-ink-muted mb-6">
            Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
          </p>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {filteredPosts.map((post, index) => (
              <PostCard
                key={post._id}
                post={post}
                imageUrl={socialPostImages[post._id]}
                index={index}
                isExpanded={expandedPostId === post._id}
                onToggleExpand={() => toggleExpand(post._id)}
              />
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-ink-muted">No posts match the current filter.</p>
              <button
                onClick={() => setPlatformFilter('all')}
                className="mt-4 text-accent hover:underline text-sm font-medium"
              >
                Show all posts
              </button>
            </div>
          )}
        </div>
      )}

      {/* Testimonials Panel */}
      {activeTab === 'testimonials' && (
        <div className="animate-fadeIn">
          {/* Testimonial Type Filter - Modern chips */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setTestimonialFilter('all')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${testimonialFilter === 'all'
                  ? 'bg-ink text-bg shadow-lg'
                  : 'bg-surface-2 text-ink-muted border border-edge hover:border-edge-strong'
                }
              `}
            >
              All
              <span className={`
                text-xs px-1.5 py-0.5 rounded-full
                ${testimonialFilter === 'all'
                  ? 'bg-bg/20 text-bg/90'
                  : 'bg-surface-3 text-ink-muted'
                }
              `}>
                {stats.testimonials}
              </span>
            </button>

            {stats.linkedinRecs > 0 && (
              <button
                onClick={() => setTestimonialFilter('linkedin')}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${testimonialFilter === 'linkedin'
                    ? 'bg-[#0a66c2] text-white shadow-lg shadow-[#0a66c2]/25'
                    : 'bg-surface-2 text-ink-muted border border-edge hover:border-edge-strong'
                  }
                `}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
                <span className={`
                  text-xs px-1.5 py-0.5 rounded-full
                  ${testimonialFilter === 'linkedin'
                    ? 'bg-white/20 text-white/90'
                    : 'bg-surface-3 text-ink-muted'
                  }
                `}>
                  {stats.linkedinRecs}
                </span>
              </button>
            )}

            {stats.mentorcruiseRecs > 0 && (
              <button
                onClick={() => setTestimonialFilter('mentorcruise')}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${testimonialFilter === 'mentorcruise'
                    ? 'bg-accent text-white shadow-lg shadow-accent/25'
                    : 'bg-surface-2 text-ink-muted border border-edge hover:border-edge-strong'
                  }
                `}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                MentorCruise
                <span className={`
                  text-xs px-1.5 py-0.5 rounded-full
                  ${testimonialFilter === 'mentorcruise'
                    ? 'bg-white/20 text-white/90'
                    : 'bg-surface-3 text-ink-muted'
                  }
                `}>
                  {stats.mentorcruiseRecs}
                </span>
              </button>
            )}

            {stats.workshopRecs > 0 && (
              <button
                onClick={() => setTestimonialFilter('workshop')}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${testimonialFilter === 'workshop'
                    ? 'bg-signal-deep text-white shadow-lg shadow-signal/25'
                    : 'bg-surface-2 text-ink-muted border border-edge hover:border-edge-strong'
                  }
                `}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Workshop
                <span className={`
                  text-xs px-1.5 py-0.5 rounded-full
                  ${testimonialFilter === 'workshop'
                    ? 'bg-white/20 text-white/90'
                    : 'bg-surface-3 text-ink-muted'
                  }
                `}>
                  {stats.workshopRecs}
                </span>
              </button>
            )}

            {stats.talkRecs > 0 && (
              <button
                onClick={() => setTestimonialFilter('talk')}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${testimonialFilter === 'talk'
                    ? 'bg-accent-bright text-white shadow-lg shadow-accent-bright/25'
                    : 'bg-surface-2 text-ink-muted border border-edge hover:border-edge-strong'
                  }
                `}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Conference
                <span className={`
                  text-xs px-1.5 py-0.5 rounded-full
                  ${testimonialFilter === 'talk'
                    ? 'bg-white/20 text-white/90'
                    : 'bg-surface-3 text-ink-muted'
                  }
                `}>
                  {stats.talkRecs}
                </span>
              </button>
            )}
          </div>

          {/* Results count */}
          <p className="text-center text-sm text-ink-muted mb-6">
            Showing {filteredTestimonials.length} {filteredTestimonials.length === 1 ? 'testimonial' : 'testimonials'}
          </p>

          {/* Testimonials Grid */}
          <div className="grid gap-4 max-w-4xl mx-auto">
            {filteredTestimonials.map((testimonial, index) => (
              testimonial.type === 'linkedin' ? (
                <LinkedInRec
                  key={testimonial._id}
                  testimonial={testimonial}
                  imageUrl={testimonialImages[testimonial._id]}
                  index={index}
                />
              ) : (
                <TestimonialCard
                  key={testimonial._id}
                  testimonial={testimonial}
                  imageUrl={testimonialImages[testimonial._id]}
                  index={index}
                />
              )
            ))}
          </div>

          {filteredTestimonials.length === 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-ink-muted">No testimonials match the current filter.</p>
              <button
                onClick={() => setTestimonialFilter('all')}
                className="mt-4 text-accent hover:underline text-sm font-medium"
              >
                Show all testimonials
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

function LinkedInRec({ testimonial, imageUrl, index }: { testimonial: Testimonial; imageUrl?: string; index: number }) {
  return (
    <div
      className="bg-surface-2 rounded-2xl p-6 border border-edge hover:shadow-lg hover:shadow-accent/5 transition-all duration-200 animate-fadeIn"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start gap-4 mb-4">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={testimonial.author}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-edge"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-[#0a66c2] text-white flex items-center justify-center text-lg font-semibold">
            {testimonial.author?.charAt(0)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-ink">{testimonial.author}</p>
          {testimonial.role && (
            <p className="text-sm text-ink-muted">
              {testimonial.role}{testimonial.company && ` at ${testimonial.company}`}
            </p>
          )}
          {testimonial.date && (
            <p className="text-xs text-ink-faint mt-1">
              {new Date(testimonial.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          )}
        </div>
        <svg className="w-6 h-6 text-[#0a66c2] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </div>

      {testimonial.context && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-surface-3 rounded-lg text-sm text-ink-muted">
          <svg className="w-4 h-4 text-ink-faint" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 8a3 3 0 100-6 3 3 0 000 6zM2 14s-1 0-1-1 1-4 7-4 7 3 7 4-1 1-1 1H2z"/>
          </svg>
          <span>{testimonial.author} {getContextLabel(testimonial.context).toLowerCase()} with Faris</span>
        </div>
      )}

      <blockquote className="text-ink leading-relaxed mb-4 whitespace-pre-line">
        "{testimonial.quote}"
      </blockquote>

      {testimonial.source && (
        <a
          href={testimonial.source}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#0a66c2] hover:underline"
        >
          See on LinkedIn
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
          </svg>
        </a>
      )}
    </div>
  );
}

function PostCard({
  post,
  imageUrl,
  index,
  isExpanded,
  onToggleExpand,
}: {
  post: SocialPost;
  imageUrl?: string;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  const isTwitter = post.platform === 'twitter';
  const showExpandButton = post.content.length > 150;

  return (
    <div
      className="animate-fadeIn min-w-0 h-full"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div
        className="p-4 rounded-2xl transition-all duration-200 hover:-translate-y-1 overflow-hidden h-full flex flex-col bg-surface-2 border border-edge hover:shadow-xl hover:shadow-black/20"
      >
        {/* Header - clickable to open post */}
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-3 mb-3"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={post.author}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
              ${isTwitter ? 'bg-ink text-bg' : 'bg-[#0a66c2] text-white'}
            `}>
              {post.author?.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className="font-semibold text-sm truncate text-ink">
                {post.author}
              </p>
              {isTwitter && post.authorHandle && (
                <span className="text-ink-faint text-xs">@{post.authorHandle}</span>
              )}
            </div>
            {post.authorRole && (
              <p className="text-xs truncate text-ink-muted">
                {post.authorRole}
              </p>
            )}
            {!post.authorRole && !isTwitter && post.authorHandle && (
              <p className="text-xs truncate text-ink-muted">
                @{post.authorHandle}
              </p>
            )}
          </div>
          <div className={isTwitter ? 'text-ink' : 'text-[#0a66c2]'}>
            {isTwitter ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            )}
          </div>
        </a>

        {/* Content */}
        <p className={`
          text-sm leading-relaxed mb-3 whitespace-pre-line flex-grow text-ink-muted
          ${isExpanded ? '' : 'line-clamp-4'}
        `}>
          {post.content}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t mt-auto border-edge">
          {showExpandButton ? (
            <button
              type="button"
              onClick={onToggleExpand}
              className="text-xs font-medium cursor-pointer select-none text-accent hover:text-accent-bright"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          ) : (
            <span />
          )}
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-bright"
          >
            View on {isTwitter ? 'X' : 'LinkedIn'}
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({ testimonial, imageUrl, index }: { testimonial: Testimonial; imageUrl?: string; index: number }) {
  const type = testimonial.type || 'other';

  const typeStyles: Record<string, { bg: string; text: string; gradient: string }> = {
    mentorcruise: { bg: 'bg-accent/10', text: 'text-accent', gradient: 'from-accent to-accent-deep' },
    workshop: { bg: 'bg-signal/10', text: 'text-signal', gradient: 'from-signal to-signal-deep' },
    talk: { bg: 'bg-accent-bright/10', text: 'text-accent-bright', gradient: 'from-accent-bright to-accent' },
    other: { bg: 'bg-surface-3', text: 'text-ink-muted', gradient: 'from-ink-faint to-edge-strong' },
  };

  const style = typeStyles[type] || typeStyles.other;

  return (
    <div
      className="bg-surface-2 rounded-2xl p-6 border border-edge hover:shadow-lg transition-all duration-200 animate-fadeIn"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
          {type === 'mentorcruise' && (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          )}
          {type === 'workshop' && (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {type === 'talk' && (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {getTypeLabel(type)}
        </span>

        {type === 'mentorcruise' && testimonial.rating && (
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 ${star <= testimonial.rating! ? 'text-accent' : 'text-edge-strong'}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            ))}
          </div>
        )}
      </div>

      <blockquote className="text-ink leading-relaxed mb-5 whitespace-pre-line">
        "{testimonial.quote}"
      </blockquote>

      <div className="flex items-center gap-3 pt-4 border-t border-edge">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={testimonial.author}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${style.gradient} text-white flex items-center justify-center text-sm font-semibold`}>
            {testimonial.author?.charAt(0)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-ink text-sm">{testimonial.author}</p>
          {(testimonial.role || testimonial.company) && (
            <p className="text-xs text-ink-muted">
              {testimonial.role}{testimonial.company && ` · ${testimonial.company}`}
            </p>
          )}
        </div>
        {testimonial.source && (
          <a
            href={testimonial.source}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-faint hover:text-ink-muted transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
