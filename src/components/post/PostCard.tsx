import { useState, type MouseEvent } from 'react';
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
  /** 'focus' = the thread's anchor feather: larger, and not itself clickable. */
  variant?: 'default' | 'focus';
}

export function PostCard({ post, animate = true, variant = 'default' }: PostCardProps) {
  const { currentUser } = useAuth();
  const { navigate } = useNavigation();
  const { toggleLike, toggleRepost, raiseSignal, signalAvailable } = usePosts();
  const { t } = useI18n();
  const [replyOpen, setReplyOpen] = useState(false);

  const isFocus = variant === 'focus';
  const isAuthor = currentUser?.id === post.authorId;
  const goToAuthor = (e: MouseEvent) => {
    e.stopPropagation();
    navigate({ name: 'profile', username: post.author.username });
  };
  // A click on the card body (not an author/entity/action/link) opens the thread.
  const openThread = () => navigate({ name: 'post', postId: post.id });

  return (
    <article
      onClick={isFocus ? undefined : openThread}
      className={cn(
        'relative px-4 transition-colors duration-200',
        isFocus ? 'py-4' : 'py-3.5 cursor-pointer',
        post.isSignalToday
          ? 'signal-aura overflow-hidden rounded-lg my-1.5 bg-signal/[0.025]'
          : cn('border-b border-border', !isFocus && 'hover:bg-surface-hover/60'),
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
          <Avatar user={post.author} size={isFocus ? 'lg' : 'md'} />
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
            {/* The timestamp is the feather's permalink — keyboard-accessible route to the thread. */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openThread();
              }}
              className="shrink-0 text-muted hover:underline underline-offset-2 no-tap"
            >
              <time dateTime={new Date(post.createdAt).toISOString()}>
                {formatTimeShort(post.createdAt)}
              </time>
            </button>
          </div>

          <p
            className={cn(
              'mt-0.5 whitespace-pre-wrap break-words leading-relaxed text-fg',
              isFocus ? 'text-lg' : 'text-[0.95rem]',
            )}
          >
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
