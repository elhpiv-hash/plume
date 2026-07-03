import { useState } from 'react';
import { PostCard } from '@/components/post/PostCard';
import { PostComposer } from '@/components/post/PostComposer';
import { FeedEmptyState } from '@/components/feed/FeedEmptyState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Tabs, type TabItem } from '@/components/ui/Tabs';
import { useFeed } from '@/hooks/useFeed';
import { useData } from '@/hooks/useData';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';
import { useI18n } from '@/hooks/useI18n';

type FeedTab = 'foryou' | 'following';

export function Feed() {
  // "For you" stays the plain chronology (selectFeed); a ranked feed will live
  // alongside it in the Mind phase. "Following" is the follows-scoped timeline.
  const { posts: forYouPosts } = useFeed();
  const data = useData();
  const { currentUser } = useAuth();
  const { navigate } = useNavigation();
  const { t } = useI18n();
  const [tab, setTab] = useState<FeedTab>('foryou');

  const tabs: ReadonlyArray<TabItem<FeedTab>> = [
    { id: 'foryou', label: t('feed.tab.forYou') },
    { id: 'following', label: t('feed.tab.following') },
  ];

  const posts = tab === 'following' ? data.followingFeed(currentUser?.id ?? null) : forYouPosts;

  return (
    <section>
      <div className="sticky top-14 z-20 bg-bg/80 backdrop-blur-lg">
        <Tabs items={tabs} active={tab} onChange={setTab} />
      </div>

      <div className="border-b border-border">
        <PostComposer />
      </div>

      {posts.length === 0 ? (
        tab === 'following' ? (
          <EmptyState
            icon="user"
            title={t('feed.following.empty.title')}
            description={t('feed.following.empty.desc')}
            action={
              <Button variant="secondary" onClick={() => navigate({ name: 'search' })}>
                {t('feed.following.empty.cta')}
              </Button>
            }
          />
        ) : (
          <FeedEmptyState />
        )
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
