import { useCallback, useMemo } from 'react';
import { useData } from '@/hooks/useData';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useI18n } from '@/hooks/useI18n';
import type { CreatePostInput, Post, PostView } from '@/types';

interface PostActions {
  /** Whether today's single Signal is still available to the current user. */
  signalAvailable: boolean;
  publish: (text: string, parentId?: string | null) => Post | null;
  toggleLike: (post: PostView) => void;
  toggleRepost: (post: PostView) => void;
  /** Crown a post as the Signal of the day; enforces the 1/day limit. */
  raiseSignal: (post: PostView) => void;
}

/**
 * All viewer-scoped post mutations in one place, with brand-voice feedback.
 * Components stay declarative — they never touch ids or the data client directly.
 */
export function usePosts(): PostActions {
  const data = useData();
  const { currentUser } = useAuth();
  const { notify } = useToast();
  const { t } = useI18n();

  const signalAvailable = currentUser ? !data.signalUsedToday(currentUser.id) : false;

  const publish = useCallback(
    (text: string, parentId: string | null = null): Post | null => {
      if (!currentUser) return null;
      const input: CreatePostInput = { authorId: currentUser.id, text, parentId };
      return data.createPost(input);
    },
    [currentUser, data],
  );

  const toggleLike = useCallback(
    (post: PostView) => {
      if (!currentUser) return;
      data.toggleLike(post.id, currentUser.id);
    },
    [currentUser, data],
  );

  const toggleRepost = useCallback(
    (post: PostView) => {
      if (!currentUser) return;
      data.toggleRepost(post.id, currentUser.id);
      notify(post.repostedByMe ? t('toast.repost.removed') : t('toast.repost.done'));
    },
    [currentUser, data, notify, t],
  );

  const raiseSignal = useCallback(
    (post: PostView) => {
      if (!currentUser) return;
      const result = data.setSignal(post.id, currentUser.id);
      if (!result.ok) {
        notify(result.error, 'danger');
        return;
      }
      notify(t('toast.signal.raised'), 'signal');
    },
    [currentUser, data, notify, t],
  );

  return useMemo(
    () => ({ signalAvailable, publish, toggleLike, toggleRepost, raiseSignal }),
    [signalAvailable, publish, toggleLike, toggleRepost, raiseSignal],
  );
}
