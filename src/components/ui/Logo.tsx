import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';

interface LogoProps {
  /** 'mark' = glyph only; 'full' = glyph + wordmark. */
  variant?: 'mark' | 'full';
  size?: number;
  className?: string;
}

export function Logo({ variant = 'full', size = 26, className }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2 text-fg', className)}>
      <span className="grid place-items-center rounded-full bg-invert text-invert-fg" style={{ height: size + 12, width: size + 12 }}>
        <Icon name="plume" size={size} filled />
      </span>
      {variant === 'full' ? (
        <span className="font-display text-xl font-bold tracking-tight">Plume</span>
      ) : null}
    </span>
  );
}
