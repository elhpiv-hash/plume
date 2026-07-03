import { PostCard } from '@/components/post/PostCard';
import { PostComposer } from '@/components/post/PostComposer';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useData } from '@/hooks/useData';
import { useNavigation } from '@/hooks/useNavigation';
import { useI18n } from '@/hooks/useI18n';
import type { ID } from '@/types';

interface ThreadScreenProps {
  postId: ID;
}

/**
 * A feather opened into its conversation: the focus feather (larger), a reply
 * composer, then the replies — oldest first, like a talk. Tapping any reply
 * opens its own thread through the same 'post' route, so nesting is recursive.
 * A pure view over parentId/selectReplies — the store is untouched.
 */
export function ThreadScreen({ postId }: ThreadScreenProps) {
  const data = useData();
  const { currentUser } = useAuth();
  const { back } = useNavigation();
  const { t } = useI18n();
  const viewerId = currentUser?.id ?? null;

  const post = data.getPost(postId, viewerId);

  // Soft state when a feather can't be found (e.g. never existed) — never a crash.
  if (!post) {
    return (
      <EmptyState
        icon="feather"
        title={t('thread.notFound.title')}
        description={t('thread.notFound.desc')}
        action={
          <Button variant="secondary" onClick={back}>
            {t('nav.back')}
          </Button>
        }
      />
    );
  }

  const replies = data.replies(postId, viewerId);

  return (
    <div className="animate-fade-in">
      <PostCard post={post} variant="focus" animate={false} />

      <div className="border-b border-border">
        <PostComposer parentId={post.id} />
      </div>

      {replies.length > 0 ? (
        <div>
          {replies.map((reply) => (
            <PostCard key={reply.id} post={reply} animate={false} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="reply"
          title={t('thread.empty.title')}
          description={t('thread.empty.desc')}
        />
      )}
    </div>
  );
}
