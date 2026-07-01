import { PostCard } from '@/components/post/PostCard';
import { PostComposer } from '@/components/post/PostComposer';
import { FeedEmptyState } from '@/components/feed/FeedEmptyState';
import { useFeed } from '@/hooks/useFeed';
import { useI18n } from '@/hooks/useI18n';

export function Feed() {
  const { posts } = useFeed();
  const { t } = useI18n();

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
          <p className="py-10 text-center text-sm text-faint">{t('feed.end')}</p>
        </div>
      )}
    </section>
  );
}
