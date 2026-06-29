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
import type { PostView } from '@/types';

interface ProfileScreenProps {
  username: string;
}

export function ProfileScreen({ username }: ProfileScreenProps) {
  const data = useData();
  const { currentUser } = useAuth();
  const { navigate } = useNavigation();
  const [tab, setTab] = useState<ProfileTab>('posts');

  const user = data.getUserByUsername(username);

  if (!user) {
    return (
      <EmptyState
        icon="user"
        title="Аккаунт не найден"
        description={`@${username} пока не существует в Plume.`}
        action={<Button variant="secondary" onClick={() => navigate({ name: 'feed' })}>В ленту</Button>}
      />
    );
  }

  const viewerId = currentUser?.id ?? null;
  const isOwn = currentUser?.id === user.id;
  const posts: PostView[] = tab === 'posts'
    ? data.userPosts(user.id, viewerId)
    : data.userReplies(user.id, viewerId);

  return (
    <div>
      <ProfileHeader user={user} />
      <ProfileTabs active={tab} onChange={setTab} />

      {posts.length > 0 ? (
        <div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} animate={false} />
          ))}
        </div>
      ) : tab === 'posts' && isOwn ? (
        <div>
          <EmptyState
            icon="feather"
            title="Профиль ждёт первого пера"
            description="Здесь будут жить твои посты. Начни прямо сейчас — это займёт секунду."
          />
          <div className="mx-4 mb-6 rounded-lg border border-border bg-surface">
            <PostComposer />
          </div>
        </div>
      ) : tab === 'posts' ? (
        <EmptyState
          icon="feather"
          title="Здесь пока пусто"
          description={`${user.name} ещё не написал(а) ни одного пера.`}
        />
      ) : (
        <EmptyState
          icon="reply"
          title="Ответов нет"
          description={isOwn ? 'Ответишь кому-нибудь — появятся здесь.' : `${user.name} пока никому не отвечал(а).`}
        />
      )}
    </div>
  );
}
