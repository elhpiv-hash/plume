import { useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { PostCard } from '@/components/post/PostCard';
import { useAuth } from '@/hooks/useAuth';
import { useData } from '@/hooks/useData';
import { useNavigation } from '@/hooks/useNavigation';
import { useI18n } from '@/hooks/useI18n';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import type { User } from '@/types';

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="px-4 pb-1 pt-5 text-xs font-semibold uppercase tracking-wider text-faint">
      {children}
    </h2>
  );
}

/** A person result — tap opens the profile; the button reuses the follow logic. */
function PersonRow({ user }: { user: User }) {
  const { currentUser } = useAuth();
  const data = useData();
  const { navigate } = useNavigation();
  const { t } = useI18n();
  const isOwn = currentUser?.id === user.id;
  const isFollowing = currentUser ? data.isFollowing(currentUser.id, user.id) : false;

  return (
    <div className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-hover">
      <button
        type="button"
        onClick={() => navigate({ name: 'profile', username: user.username })}
        className="flex min-w-0 flex-1 items-center gap-3 text-left no-tap"
      >
        <Avatar user={user} size="md" />
        <span className="min-w-0">
          <span className="block truncate font-display font-semibold text-fg">{user.name}</span>
          <span className="block truncate text-sm text-muted">@{user.username}</span>
        </span>
      </button>
      {!isOwn && currentUser ? (
        <Button
          variant={isFollowing ? 'secondary' : 'primary'}
          size="sm"
          onClick={() => data.setFollow(currentUser.id, user.id, !isFollowing)}
        >
          {isFollowing ? t('profile.following') : t('profile.follow')}
        </Button>
      ) : null}
    </div>
  );
}

export function SearchScreen() {
  const data = useData();
  const { currentUser } = useAuth();
  const { navigate } = useNavigation();
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  // Debounced so results don't recompute on every keystroke; the field is
  // always driven by `query`, so typing never stalls or loses focus.
  const debounced = useDebouncedValue(query.trim(), 200);
  const hasQuery = debounced.length > 0;

  const people = hasQuery ? data.suggestUsers(debounced, 8) : [];
  const tags = hasQuery ? data.hashtagsMatching(debounced, 10) : [];
  const posts = hasQuery ? data.postsMatching(debounced, currentUser?.id ?? null, 20) : [];
  const nothing = hasQuery && people.length === 0 && tags.length === 0 && posts.length === 0;

  return (
    <div className="animate-fade-in">
      <div className="sticky top-14 z-20 border-b border-border bg-bg/80 px-4 py-3 backdrop-blur-lg">
        <Input
          label={t('search.label')}
          leading={<Icon name="search" size={18} />}
          value={query}
          autoFocus
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search.placeholder')}
        />
      </div>

      {!hasQuery ? (
        <EmptyState icon="search" title={t('search.prompt.title')} description={t('search.prompt.desc')} />
      ) : nothing ? (
        <EmptyState icon="search" title={t('search.empty.title')} description={t('search.empty.desc')} />
      ) : (
        <div className="pb-4">
          {people.length > 0 ? (
            <section>
              <SectionTitle>{t('search.section.people')}</SectionTitle>
              {people.map((u) => (
                <PersonRow key={u.id} user={u} />
              ))}
            </section>
          ) : null}

          {tags.length > 0 ? (
            <section>
              <SectionTitle>{t('search.section.tags')}</SectionTitle>
              {tags.map((h) => (
                <button
                  key={h.tag}
                  type="button"
                  onClick={() => navigate({ name: 'hashtag', tag: h.tag })}
                  className="flex min-h-[44px] w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-surface-hover"
                >
                  <span className="font-display font-semibold text-fg">#{h.tag}</span>
                  <span className="text-sm tabular-nums text-muted">{h.count}</span>
                </button>
              ))}
            </section>
          ) : null}

          {posts.length > 0 ? (
            <section>
              <SectionTitle>{t('search.section.posts')}</SectionTitle>
              {posts.map((p) => (
                <PostCard key={p.id} post={p} animate={false} />
              ))}
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}
