import { SocialPostCard, type SocialPost } from './SocialPostCard';

interface Testimonial {
  _id: string;
  quote: string;
  author: string;
  role?: string;
  company?: string;
  image?: string;
}

interface SocialWallIslandProps {
  posts: SocialPost[];
  testimonials: Testimonial[];
  socialPostImages: Record<string, string>;
  testimonialImages: Record<string, string>;
}

// Interleave posts and testimonials for variety
function interleaveItems(
  posts: SocialPost[],
  testimonials: Testimonial[]
): Array<{ type: 'post' | 'testimonial'; data: SocialPost | Testimonial }> {
  const allItems: Array<{ type: 'post' | 'testimonial'; data: SocialPost | Testimonial }> = [];
  const maxItems = Math.max(posts.length, testimonials.length);

  for (let i = 0; i < maxItems; i++) {
    if (posts[i]) allItems.push({ type: 'post', data: posts[i] });
    if (testimonials[i]) allItems.push({ type: 'testimonial', data: testimonials[i] });
  }

  return allItems;
}

export default function SocialWallIsland({
  posts,
  testimonials,
  socialPostImages,
  testimonialImages,
}: SocialWallIslandProps) {
  const allItems = interleaveItems(posts, testimonials);

  return (
    <div className="social-bento max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {allItems.slice(0, 9).map((item, index) => {
        if (item.type === 'post') {
          const post = item.data as SocialPost;
          return (
            <SocialPostCard
              key={post._id}
              post={post}
              imageUrl={socialPostImages[post._id]}
              index={index}
            />
          );
        } else {
          const testimonial = item.data as Testimonial;
          return (
            <TestimonialCard
              key={testimonial._id}
              testimonial={testimonial}
              imageUrl={testimonialImages[testimonial._id]}
              index={index}
            />
          );
        }
      })}
    </div>
  );
}

function TestimonialCard({
  testimonial,
  imageUrl,
  index,
}: {
  testimonial: Testimonial;
  imageUrl?: string;
  index: number;
}) {
  return (
    <div
      className="animate-fadeIn h-full bg-surface-2 rounded-2xl border border-edge p-6 hover:border-accent/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/10 transition-all duration-200 flex flex-col"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Quote icon */}
      <div className="w-8 h-8 text-accent opacity-30 mb-3">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
        </svg>
      </div>

      {/* Quote */}
      <p className="text-ink text-sm leading-relaxed mb-4 line-clamp-4 flex-grow">
        "{testimonial.quote}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-edge mt-auto">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={testimonial.author}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-deep flex items-center justify-center">
            <span className="font-bold text-white text-sm">{testimonial.author?.charAt(0)}</span>
          </div>
        )}
        <div className="min-w-0">
          <p className="font-semibold text-ink text-sm">{testimonial.author}</p>
          {(testimonial.role || testimonial.company) && (
            <p className="text-xs text-ink-muted truncate">
              {testimonial.role}{testimonial.company && ` at ${testimonial.company}`}
            </p>
          )}
        </div>
      </div>

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
