import { PostCard } from '@/components/post/PostCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuth } from '@/hooks/useAuth';
import { useData } from '@/hooks/useData';
import { useI18n } from '@/hooks/useI18n';
import type { PostView } from '@/types';

interface HashtagScreenProps {
  tag: string;
}

/**
 * A light tag view built entirely on existing data via `postsByHashtag`. Not a
 * search — just every feather that carries this one tag, newest first.
 */
export function HashtagScreen({ tag }: HashtagScreenProps) {
  const data = useData();
  const { currentUser } = useAuth();
  const { t } = useI18n();

  const posts: PostView[] = data.postsByHashtag(tag, currentUser?.id ?? null);

  return (
    <div className="animate-fade-in">
      <header className="border-b border-border px-4 pb-4 pt-5">
        <h1 className="font-display text-2xl font-bold tracking-tight">#{tag}</h1>
        <p className="mt-0.5 text-sm text-muted">{t('hashtag.subtitle')}</p>
      </header>

      {posts.length > 0 ? (
        <div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} animate={false} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="feather"
          title={t('hashtag.empty.title')}
          description={t('hashtag.empty.desc', { tag })}
        />
      )}
    </div>
  );
}
