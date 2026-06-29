import type { ReactNode } from 'react';
import { Icon, type IconName } from '@/components/ui/Icon';

interface EmptyStateProps {
  icon?: IconName;
  title: string;
  description: string;
  action?: ReactNode;
}

/**
 * The empty state is a first-class screen here, not an afterthought — Plume
 * starts from zero, so these moments carry the brand voice and invite action.
 */
export function EmptyState({ icon = 'feather', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-8 py-16 text-center animate-fade-in">
      <div className="relative mb-5">
        <span className="absolute inset-0 -z-10 rounded-full bg-signal/10 blur-2xl" />
        <span className="grid h-16 w-16 place-items-center rounded-full border border-border bg-surface text-fg">
          <Icon name={icon} size={28} />
        </span>
      </div>
      <h3 className="font-display text-xl font-semibold tracking-tight text-balance">{title}</h3>
      <p className="mt-2 max-w-xs text-base leading-relaxed text-muted text-balance">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
