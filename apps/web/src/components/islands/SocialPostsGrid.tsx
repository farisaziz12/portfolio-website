import { SocialPostCard, type SocialPost } from './SocialPostCard';

interface SocialPostsGridProps {
  posts: SocialPost[];
  imageUrls: Record<string, string>;
  maxPosts?: number;
}

export default function SocialPostsGrid({
  posts,
  imageUrls,
  maxPosts = 4,
}: SocialPostsGridProps) {
  const displayPosts = posts.slice(0, maxPosts);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {displayPosts.map((post, index) => (
        <SocialPostCard
          key={post._id}
          post={post}
          imageUrl={imageUrls[post._id]}
          index={index}
        />
      ))}
    </div>
  );
}
