import { useState } from 'react';

export interface SocialPost {
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

interface SocialPostCardProps {
  post: SocialPost;
  imageUrl?: string;
  index?: number;
}

export function SocialPostCard({
  post,
  imageUrl,
  index = 0,
}: SocialPostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isTwitter = post.platform === 'twitter';
  const showExpandButton = post.content.length > 150;

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div
      className="animate-fadeIn"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div
        className={`
          p-4 rounded-2xl transition-all duration-200 hover:-translate-y-1
          ${isTwitter
            ? 'bg-black text-white hover:shadow-xl hover:shadow-black/20'
            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:shadow-blue-500/10'
          }
        `}
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
              ${isTwitter ? 'bg-slate-800 text-white' : 'bg-[#0a66c2] text-white'}
            `}>
              {post.author?.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className={`font-semibold text-sm truncate ${isTwitter ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                {post.author}
              </p>
              {isTwitter && post.authorHandle && (
                <span className="text-slate-500 text-xs">@{post.authorHandle}</span>
              )}
            </div>
            {post.authorRole && (
              <p className={`text-xs truncate ${isTwitter ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>
                {post.authorRole}
              </p>
            )}
            {!post.authorRole && !isTwitter && post.authorHandle && (
              <p className="text-xs truncate text-slate-500 dark:text-slate-400">
                @{post.authorHandle}
              </p>
            )}
            {post.postDate && (
              <p className={`text-xs ${isTwitter ? 'text-slate-500' : 'text-slate-400 dark:text-slate-500'}`}>
                {new Date(post.postDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            )}
          </div>
          <div className={isTwitter ? 'text-white' : 'text-[#0a66c2]'}>
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
          text-sm leading-relaxed mb-3 whitespace-pre-line
          ${isTwitter ? 'text-slate-200' : 'text-slate-600 dark:text-slate-300'}
          ${isExpanded ? '' : 'line-clamp-4'}
        `}>
          {post.content}
        </p>

        {/* Footer */}
        <div className={`flex items-center justify-between pt-3 border-t ${isTwitter ? 'border-slate-700/50' : 'border-slate-200 dark:border-slate-700'}`}>
          {showExpandButton ? (
            <button
              type="button"
              onClick={toggleExpand}
              className={`
                text-xs font-medium cursor-pointer select-none
                ${isTwitter ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}
              `}
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
            className={`flex items-center gap-1 text-xs font-medium ${isTwitter ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
          >
            Read on {isTwitter ? 'X' : 'LinkedIn'}
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
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

export default SocialPostCard;
