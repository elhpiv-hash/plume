import { PostCard } from '@/components/post/PostCard';
import { PostComposer } from '@/components/post/PostComposer';
import { FeedEmptyState } from '@/components/feed/FeedEmptyState';
import { useFeed } from '@/hooks/useFeed';

export function Feed() {
  const { posts } = useFeed();

  return (
    <section>
      <div className="border-b border-border">
        <PostComposer />
      </div>

      {posts.length === 0 ? (
        <FeedEmptyState />
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          <p className="py-10 text-center text-sm text-faint">Ты долетел до конца ленты.</p>
        </div>
      )}
    </section>
  );
}
