import { Icon, type IconName } from '@/components/ui/Icon';
import { useI18n } from '@/hooks/useI18n';
import { cn } from '@/lib/cn';
import type { PostView } from '@/types';

interface PostActionsProps {
  post: PostView;
  onReply: () => void;
  onRepost: () => void;
  onLike: () => void;
  /** Author-only Signal control. Hidden entirely for non-authors. */
  signal?: {
    canRaise: boolean;
    available: boolean;
    onRaise: () => void;
  };
}

interface ActionButtonProps {
  icon: IconName;
  count?: number;
  label: string;
  active?: boolean;
  filled?: boolean;
  tone?: 'default' | 'signal';
  disabled?: boolean;
  onClick: () => void;
}

function ActionButton({
  icon,
  count,
  label,
  active = false,
  filled = false,
  tone = 'default',
  disabled = false,
  onClick,
}: ActionButtonProps) {
  const accent = tone === 'signal' ? 'text-signal' : 'text-fg';
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        'group/action inline-flex items-center gap-1.5 -ml-1.5 rounded-full px-1.5 py-1',
        'text-sm transition-colors duration-200 disabled:opacity-40 disabled:pointer-events-none',
        active ? accent : 'text-muted hover:text-fg',
      )}
    >
      <span
        className={cn(
          'grid h-7 w-7 place-items-center rounded-full transition-colors duration-200',
          tone === 'signal' ? 'group-hover/action:bg-signal/10' : 'group-hover/action:bg-surface-hover',
        )}
      >
        <Icon name={icon} size={18} filled={filled} />
      </span>
      {typeof count === 'number' ? (
        <span className="tabular-nums min-w-[1ch]">{count > 0 ? count : ''}</span>
      ) : null}
    </button>
  );
}

export function PostActions({ post, onReply, onRepost, onLike, signal }: PostActionsProps) {
  const { t } = useI18n();
  return (
    <div className="mt-2 flex items-center justify-between pr-2 max-w-md">
      <ActionButton icon="reply" label={t('action.reply')} count={post.replyCount} onClick={onReply} />
      <ActionButton
        icon="repost"
        label={t('action.repost')}
        count={post.repostCount}
        active={post.repostedByMe}
        onClick={onRepost}
      />
      <ActionButton
        icon="heart"
        label={t('action.like')}
        count={post.likeCount}
        active={post.likedByMe}
        filled={post.likedByMe}
        onClick={onLike}
      />
      {signal?.canRaise ? (
        <ActionButton
          icon="feather"
          label={signal.available ? t('signal.raise') : t('signal.chosen')}
          tone="signal"
          active={!signal.available}
          disabled={!signal.available}
          onClick={signal.onRaise}
        />
      ) : null}
    </div>
  );
}
