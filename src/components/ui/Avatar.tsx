import { useMemo } from 'react';
import { cn } from '@/lib/cn';
import type { User } from '@/types';

type Size = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  user: Pick<User, 'name' | 'username' | 'avatarUrl'>;
  size?: Size;
  className?: string;
}

const SIZES: Record<Size, string> = {
  sm: 'h-9 w-9 text-sm',
  md: 'h-11 w-11 text-base',
  lg: 'h-14 w-14 text-lg',
  xl: 'h-24 w-24 text-3xl',
};

/** Four monochrome graphite tones — distinction without breaking the palette. */
const TONES = [
  'linear-gradient(145deg, #2a2c31, #16181d)',
  'linear-gradient(145deg, #33302c, #1c1a18)',
  'linear-gradient(145deg, #2b2f33, #181b1f)',
  'linear-gradient(145deg, #303033, #1a1a1d)',
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '·';
  const first = parts[0]?.[0] ?? '';
  const second = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';
  return (first + second).toUpperCase();
}

function hashTone(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return TONES[h % TONES.length] ?? TONES[0]!;
}

/**
 * A deterministic monogram avatar. No images, no color accents — a graphite
 * gradient keyed off the handle keeps people distinguishable while staying
 * inside the monochrome system.
 */
export function Avatar({ user, size = 'md', className }: AvatarProps) {
  const tone = useMemo(() => hashTone(user.username), [user.username]);

  // Photo avatar (Profile 2.0). Falls back to the monogram below when absent.
  if (user.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.name}
        className={cn(
          'inline-block shrink-0 rounded-full object-cover ring-1 ring-inset ring-white/10',
          SIZES[size],
          className,
        )}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      style={{ backgroundImage: tone }}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full',
        'font-display font-semibold text-[#e8e9ec] ring-1 ring-inset ring-white/10',
        'shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]',
        SIZES[size],
        className,
      )}
    >
      {initials(user.name)}
    </span>
  );
}
