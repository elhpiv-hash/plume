import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';

interface SignalBadgeProps {
  /** 'pin' = compact marker in feed/cards; 'today' = profile pinned label. */
  variant?: 'pin' | 'today';
  className?: string;
}

/** The premium marker for a Signal of the day — champagne feather + label. */
export function SignalBadge({ variant = 'pin', className }: SignalBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-signal/40 bg-signal/[0.07]',
        'px-2.5 py-1 text-xs font-display font-semibold tracking-wide text-signal',
        className,
      )}
    >
      <Icon name="feather" size={13} filled className="animate-signal-pulse" />
      {variant === 'today' ? 'Сигнал дня · сегодня' : 'Сигнал дня'}
    </span>
  );
}
