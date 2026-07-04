import { useState } from 'react';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileTabs, type ProfileTab } from '@/components/profile/ProfileTabs';
import { PostCard } from '@/components/post/PostCard';
import { PostComposer } from '@/components/post/PostComposer';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useData } from '@/hooks/useData';
import { useNavigation } from '@/hooks/useNavigation';
import { useI18n } from '@/hooks/useI18n';
import type { PostView } from '@/types';

interface ProfileScreenProps {
  username: string;
}

export function ProfileScreen({ username }: ProfileScreenProps) {
  const data = useData();
  const { currentUser } = useAuth();
  const { navigate } = useNavigation();
  const { t } = useI18n();
  const [tab, setTab] = useState<ProfileTab>('posts');

  const user = data.getUserByUsername(username);

  if (!user) {
    return (
      <EmptyState
        icon="user"
        title={t('profile.notFound.title')}
        description={t('profile.notFound.desc', { username })}
        action={<Button variant="secondary" onClick={() => navigate({ name: 'feed' })}>{t('profile.notFound.cta')}</Button>}
      />
    );
  }

  const viewerId = currentUser?.id ?? null;
  const isOwn = currentUser?.id === user.id;
  // "Saved" is private: fall back to Posts if a stale tab lands on someone else.
  const activeTab: ProfileTab = tab === 'saved' && !isOwn ? 'posts' : tab;
  const posts: PostView[] =
    activeTab === 'saved'
      ? data.bookmarkedPosts(user.id, viewerId)
      : activeTab === 'replies'
        ? data.userReplies(user.id, viewerId)
        : data.userPosts(user.id, viewerId);

  return (
    <div>
      <ProfileHeader user={user} />
      <ProfileTabs active={activeTab} onChange={setTab} showSaved={isOwn} />

      {posts.length > 0 ? (
        <div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} animate={false} />
          ))}
        </div>
      ) : activeTab === 'posts' && isOwn ? (
        <div>
          <EmptyState
            icon="feather"
            title={t('profile.empty.own.title')}
            description={t('profile.empty.own.desc')}
          />
          <div className="mx-4 mb-6 rounded-lg border border-border bg-surface">
            <PostComposer />
          </div>
        </div>
      ) : activeTab === 'posts' ? (
        <EmptyState
          icon="feather"
          title={t('profile.empty.other.title')}
          description={t('profile.empty.other.desc', { name: user.name })}
        />
      ) : activeTab === 'replies' ? (
        <EmptyState
          icon="reply"
          title={t('profile.replies.empty.title')}
          description={isOwn ? t('profile.replies.empty.own') : t('profile.replies.empty.other', { name: user.name })}
        />
      ) : (
        <EmptyState
          icon="bookmark"
          title={t('profile.saved.empty.title')}
          description={t('profile.saved.empty.desc')}
        />
      )}
    </div>
  );
}
