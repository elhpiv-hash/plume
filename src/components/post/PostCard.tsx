import { useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { PostActions } from '@/components/post/PostActions';
import { PostComposer } from '@/components/post/PostComposer';
import { RichText } from '@/components/post/RichText';
import { SignalBadge } from '@/components/post/SignalBadge';
import { SignalFeathers } from '@/components/post/SignalFeathers';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';
import { usePosts } from '@/hooks/usePosts';
import { useI18n } from '@/hooks/useI18n';
import { formatTimeShort } from '@/lib/formatTime';
import { cn } from '@/lib/cn';
import type { PostView } from '@/types';

interface PostCardProps {
  post: PostView;
  /** Disables the entry animation when rendering static lists (e.g. profile). */
  animate?: boolean;
}

export function PostCard({ post, animate = true }: PostCardProps) {
  const { currentUser } = useAuth();
  const { navigate } = useNavigation();
  const { toggleLike, toggleRepost, raiseSignal, signalAvailable } = usePosts();
  const { t } = useI18n();
  const [replyOpen, setReplyOpen] = useState(false);

  const isAuthor = currentUser?.id === post.authorId;
  const goToAuthor = () => navigate({ name: 'profile', username: post.author.username });

  return (
    <article
      className={cn(
        'relative px-4 py-3.5 transition-colors duration-200',
        post.isSignalToday
          ? 'signal-aura overflow-hidden rounded-lg my-1.5 bg-signal/[0.025]'
          : 'border-b border-border hover:bg-surface-hover/60',
        animate && 'animate-post-enter',
      )}
    >
      {post.isSignalToday ? <SignalFeathers /> : null}

      {post.isSignalToday ? (
        <div className="relative mb-2 pl-[3.25rem]">
          <SignalBadge />
        </div>
      ) : null}

      <div className="relative flex gap-3">
        <button type="button" onClick={goToAuthor} className="self-start no-tap" aria-label={t('post.authorProfile', { name: post.author.name })}>
          <Avatar user={post.author} size="md" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-sm">
            <button
              type="button"
              onClick={goToAuthor}
              className="font-display font-semibold text-fg hover:underline underline-offset-2 truncate"
            >
              {post.author.name}
            </button>
            <span className="text-muted truncate">@{post.author.username}</span>
            <span className="text-faint">·</span>
            <time className="text-muted shrink-0" dateTime={new Date(post.createdAt).toISOString()}>
              {formatTimeShort(post.createdAt)}
            </time>
          </div>

          <p className="mt-0.5 whitespace-pre-wrap break-words text-[0.95rem] leading-relaxed text-fg">
            <RichText text={post.text} />
          </p>

          <PostActions
            post={post}
            onReply={() => setReplyOpen(true)}
            onRepost={() => toggleRepost(post)}
            onLike={() => toggleLike(post)}
            signal={
              isAuthor
                ? {
                    canRaise: !post.isSignalToday,
                    available: signalAvailable,
                    onRaise: () => raiseSignal(post),
                  }
                : undefined
            }
          />
        </div>
      </div>

      <Modal open={replyOpen} onClose={() => setReplyOpen(false)} title={t('post.reply.title')}>
        <div className="mb-4 rounded-md border border-border bg-surface p-3">
          <div className="flex items-center gap-1.5 text-sm">
            <span className="font-display font-semibold">{post.author.name}</span>
            <span className="text-muted">@{post.author.username}</span>
          </div>
          <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-sm text-muted">{post.text}</p>
        </div>
        <PostComposer
          parentId={post.id}
          autoFocus
          compact
          onPublished={() => setReplyOpen(false)}
        />
      </Modal>
    </article>
  );
}
