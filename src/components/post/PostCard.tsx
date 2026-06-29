import { useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { PostActions } from '@/components/post/PostActions';
import { PostComposer } from '@/components/post/PostComposer';
import { SignalBadge } from '@/components/post/SignalBadge';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';
import { usePosts } from '@/hooks/usePosts';
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
  const [replyOpen, setReplyOpen] = useState(false);

  const isAuthor = currentUser?.id === post.authorId;
  const goToAuthor = () => navigate({ name: 'profile', username: post.author.username });

  return (
    <article
      className={cn(
        'relative px-4 py-3.5 transition-colors duration-200',
        post.isSignalToday
          ? 'signal-aura rounded-lg my-1.5 bg-signal/[0.025]'
          : 'border-b border-border hover:bg-surface-hover/60',
        animate && 'animate-post-enter',
      )}
    >
      {post.isSignalToday ? (
        <div className="mb-2 pl-[3.25rem]">
          <SignalBadge />
        </div>
      ) : null}

      <div className="flex gap-3">
        <button type="button" onClick={goToAuthor} className="self-start no-tap" aria-label={`Профиль ${post.author.name}`}>
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
            {post.text}
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

      <Modal open={replyOpen} onClose={() => setReplyOpen(false)} title="Ответ">
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
