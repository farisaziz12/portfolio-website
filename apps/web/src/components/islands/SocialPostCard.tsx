import { useState } from 'react';
import { platformChrome, PlatformIcon, type SocialPlatform } from './socialPlatform';

export interface SocialPost {
  _id: string;
  platform: SocialPlatform;
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
  const chrome = platformChrome(post.platform);
  const showExpandButton = post.content.length > 150;

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div
      className="animate-fadeIn h-full"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div
        className={`p-4 rounded-2xl transition-all duration-200 hover:-translate-y-1 overflow-hidden h-full flex flex-col ${chrome.card}`}
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
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${chrome.avatarFallback}`}>
              {post.author?.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className={`font-semibold text-sm truncate ${chrome.primaryText}`}>
                {post.author}
              </p>
              {chrome.inlineHandle && post.authorHandle && (
                <span className={`text-xs ${chrome.secondaryText}`}>@{post.authorHandle}</span>
              )}
            </div>
            {post.authorRole && (
              <p className={`text-xs truncate ${chrome.secondaryText}`}>
                {post.authorRole}
              </p>
            )}
            {!post.authorRole && !chrome.inlineHandle && post.authorHandle && (
              <p className={`text-xs truncate ${chrome.secondaryText}`}>
                @{post.authorHandle}
              </p>
            )}
            {post.postDate && (
              <p className={`text-xs ${chrome.secondaryText}`}>
                {new Date(post.postDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            )}
          </div>
          <div className={chrome.icon}>
            <PlatformIcon platform={post.platform} />
          </div>
        </a>

        {/* Content */}
        <p className={`
          text-sm leading-relaxed mb-3 whitespace-pre-line flex-grow ${chrome.bodyText}
          ${isExpanded ? '' : 'line-clamp-4'}
        `}>
          {post.content}
        </p>

        {/* Footer */}
        <div className={`flex items-center justify-between pt-3 border-t mt-auto ${chrome.divider}`}>
          {showExpandButton ? (
            <button
              type="button"
              onClick={toggleExpand}
              className={`text-xs font-medium cursor-pointer select-none ${chrome.link}`}
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
            className={`flex items-center gap-1 text-xs font-medium ${chrome.link}`}
          >
            Read on {chrome.name}
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
