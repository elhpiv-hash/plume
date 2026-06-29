import { useData } from '@/hooks/useData';
import { useAuth } from '@/hooks/useAuth';
import type { PostView } from '@/types';

/**
 * The global timeline from the current viewer's perspective. Returns posts
 * already hydrated with like/repost/signal state relative to the signed-in user.
 */
export function useFeed(): { posts: PostView[] } {
  const data = useData();
  const { currentUser } = useAuth();
  const posts = data.feed(currentUser?.id ?? null);
  return { posts };
}
