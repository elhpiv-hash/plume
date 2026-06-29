import type { ReactNode } from 'react';

export type IconName =
  | 'plume'
  | 'feather'
  | 'home'
  | 'user'
  | 'settings'
  | 'heart'
  | 'reply'
  | 'repost'
  | 'sparkle'
  | 'close'
  | 'back'
  | 'apple'
  | 'phone'
  | 'check'
  | 'plus'
  | 'logout'
  | 'lock'
  | 'at'
  | 'shield'
  | 'bell'
  | 'pin'
  | 'link'
  | 'briefcase'
  | 'cap'
  | 'cake'
  | 'camera'
  | 'image';

interface IconProps {
  name: IconName;
  size?: number;
  filled?: boolean;
  strokeWidth?: number;
  className?: string;
}

/**
 * Hand-drawn icon set — no third-party glyphs. Each entry decides its own
 * fill/stroke so a few (heart, feather, signal mark) can render solid when
 * "active". Everything is on a 24×24 grid with round joins for a soft, premium
 * line quality.
 */
const PATHS: Record<IconName, (filled: boolean) => ReactNode> = {
  // Brand mark: a "P" whose counter opens into a feather flick.
  plume: (filled) => (
    <>
      <path
        d="M8.4 20.5V4.8h4.3a4.3 4.3 0 1 1 0 8.6H8.4"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      />
      <path
        d="M8.6 12.9c3.2-.3 5.6-2.1 6.8-5.1"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        opacity={filled ? 1 : 0.7}
      />
    </>
  ),
  feather: (filled) => (
    <>
      <path
        d="M5.4 18.6C5.4 11.2 10.9 5.7 18.4 5.7c0 7.4-5.4 12.9-12.8 12.9z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={1.6}
      />
      <path d="M8 16 16.6 7.4" fill="none" stroke="currentColor" strokeWidth={1.4} opacity={filled ? 0.55 : 1} />
      <path d="M5.4 18.6 3.3 20.7" fill="none" stroke="currentColor" strokeWidth={1.6} />
    </>
  ),
  home: () => (
    <path
      d="M3.5 10 12 3.5l8.5 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-6v6H4.5a1 1 0 0 1-1-1z"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
    />
  ),
  user: () => (
    <>
      <circle cx="12" cy="8.5" r="3.8" fill="none" stroke="currentColor" strokeWidth={1.7} />
      <path d="M4.5 20c0-3.6 3.4-6 7.5-6s7.5 2.4 7.5 6" fill="none" stroke="currentColor" strokeWidth={1.7} />
    </>
  ),
  settings: () => (
    <>
      <path d="M4 8h6M16 8h4M4 16h4M14 16h6" fill="none" stroke="currentColor" strokeWidth={1.7} />
      <circle cx="13" cy="8" r="2.3" fill="none" stroke="currentColor" strokeWidth={1.7} />
      <circle cx="10" cy="16" r="2.3" fill="none" stroke="currentColor" strokeWidth={1.7} />
    </>
  ),
  heart: (filled) => (
    <path
      d="M12 20.3 4.2 12.9C1.9 10.6 2.4 6.7 5.6 5.7c2-.6 3.8.3 5 1.9 1.2-1.6 3-2.5 5-1.9 3.2 1 3.7 4.9 1.4 7.2z"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.7}
    />
  ),
  reply: () => (
    <path
      d="M21 11.4c0 4-3.9 7.2-8.6 7.2-1.1 0-2.1-.2-3.1-.5L4 19.5l1-3.7c-1.2-1.2-2-2.7-2-4.4C3 7.4 6.9 4.2 11.6 4.2S21 7.4 21 11.4z"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
    />
  ),
  repost: () => (
    <>
      <path d="M4 11V9.5a4 4 0 0 1 4-4h8.5" fill="none" stroke="currentColor" strokeWidth={1.7} />
      <path d="M14 3 17 6l-3 3" fill="none" stroke="currentColor" strokeWidth={1.7} />
      <path d="M20 13v1.5a4 4 0 0 1-4 4H7.5" fill="none" stroke="currentColor" strokeWidth={1.7} />
      <path d="M10 21 7 18l3-3" fill="none" stroke="currentColor" strokeWidth={1.7} />
    </>
  ),
  sparkle: (filled) => (
    <path
      d="M12 3c.5 3.8 2.2 5.5 6 6-3.8.5-5.5 2.2-6 6-.5-3.8-2.2-5.5-6-6 3.8-.5 5.5-2.2 6-6z"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.5}
    />
  ),
  close: () => (
    <path d="M6 6 18 18M18 6 6 18" fill="none" stroke="currentColor" strokeWidth={1.8} />
  ),
  back: () => (
    <path d="M15 5 8 12l7 7" fill="none" stroke="currentColor" strokeWidth={1.8} />
  ),
  apple: () => (
    <path
      d="M16.7 12.3c0-2 1.6-2.9 1.7-3-0.9-1.4-2.4-1.5-2.9-1.5-1.2-0.1-2.4 0.7-3 0.7-0.6 0-1.6-0.7-2.6-0.7-1.3 0-2.6 0.8-3.3 2-1.4 2.4-0.4 6 1 8 0.7 1 1.4 2 2.4 2 1 0 1.3-0.6 2.5-0.6 1.2 0 1.5 0.6 2.5 0.6 1 0 1.7-0.9 2.3-1.9 0.4-0.7 0.6-1 0.9-1.8-2-0.8-2.4-3.5-2.4-3.5zM14.3 5.9c0.6-0.7 0.9-1.6 0.8-2.6-0.8 0-1.8 0.6-2.4 1.3-0.5 0.6-1 1.5-0.8 2.5 0.9 0.1 1.8-0.5 2.4-1.2z"
      fill="currentColor"
      stroke="none"
    />
  ),
  phone: () => (
    <>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.6" fill="none" stroke="currentColor" strokeWidth={1.7} />
      <path d="M10.5 18.5h3" fill="none" stroke="currentColor" strokeWidth={1.7} />
    </>
  ),
  check: () => (
    <path d="M5 12.5 10 17.5 19 7" fill="none" stroke="currentColor" strokeWidth={2} />
  ),
  plus: () => (
    <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth={1.9} />
  ),
  logout: () => (
    <>
      <path d="M14 4.5H6a1.5 1.5 0 0 0-1.5 1.5v12A1.5 1.5 0 0 0 6 19.5h8" fill="none" stroke="currentColor" strokeWidth={1.7} />
      <path d="M16 8.5 19.5 12 16 15.5M9.5 12h10" fill="none" stroke="currentColor" strokeWidth={1.7} />
    </>
  ),
  lock: () => (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth={1.7} />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke="currentColor" strokeWidth={1.7} />
    </>
  ),
  at: () => (
    <>
      <circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" strokeWidth={1.6} />
      <path d="M15.6 8.4v5a2.4 2.4 0 0 0 4.4 1.3A9 9 0 1 0 16 19.6" fill="none" stroke="currentColor" strokeWidth={1.6} />
    </>
  ),
  shield: () => (
    <path d="M12 3.5 5 6v5c0 4.4 3 7.8 7 9.5 4-1.7 7-5.1 7-9.5V6z" fill="none" stroke="currentColor" strokeWidth={1.7} />
  ),
  bell: () => (
    <>
      <path d="M6 17.5c1-1 1.5-2.3 1.5-3.8V11a4.5 4.5 0 0 1 9 0v2.7c0 1.5.5 2.8 1.5 3.8z" fill="none" stroke="currentColor" strokeWidth={1.7} />
      <path d="M10.5 20.5a1.7 1.7 0 0 0 3 0" fill="none" stroke="currentColor" strokeWidth={1.7} />
    </>
  ),
  pin: () => (
    <>
      <path d="M12 21c4-4.3 6-7.6 6-10.5a6 6 0 1 0-12 0c0 2.9 2 6.2 6 10.5z" fill="none" stroke="currentColor" strokeWidth={1.7} />
      <circle cx="12" cy="10.5" r="2.3" fill="none" stroke="currentColor" strokeWidth={1.7} />
    </>
  ),
  link: () => (
    <>
      <path d="M10.5 13.5 13.5 10.5" fill="none" stroke="currentColor" strokeWidth={1.7} />
      <path d="M10.8 7.6l1.3-1.3a3.6 3.6 0 0 1 5.1 5.1l-1.3 1.3" fill="none" stroke="currentColor" strokeWidth={1.7} />
      <path d="M13.2 16.4l-1.3 1.3a3.6 3.6 0 0 1-5.1-5.1l1.3-1.3" fill="none" stroke="currentColor" strokeWidth={1.7} />
    </>
  ),
  briefcase: () => (
    <>
      <rect x="3.5" y="7.5" width="17" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth={1.7} />
      <path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5" fill="none" stroke="currentColor" strokeWidth={1.7} />
      <path d="M3.5 12.5h17" fill="none" stroke="currentColor" strokeWidth={1.7} />
    </>
  ),
  cap: () => (
    <>
      <path d="M12 5 22 9.5 12 14 2 9.5z" fill="none" stroke="currentColor" strokeWidth={1.7} />
      <path d="M6 11.3V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.7" fill="none" stroke="currentColor" strokeWidth={1.7} />
    </>
  ),
  cake: () => (
    <>
      <path d="M4 20v-7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v7z" fill="none" stroke="currentColor" strokeWidth={1.7} />
      <path d="M4 15c1.2 1 2.5 1 4 0s2.8-1 4 0 2.8 1 4 0" fill="none" stroke="currentColor" strokeWidth={1.7} />
      <path d="M8.5 10V7.5M12 10V7.5M15.5 10V7.5" fill="none" stroke="currentColor" strokeWidth={1.7} />
    </>
  ),
  camera: () => (
    <>
      <rect x="3.5" y="7" width="17" height="13" rx="2.5" fill="none" stroke="currentColor" strokeWidth={1.7} />
      <path d="M9 7l1-2h4l1 2" fill="none" stroke="currentColor" strokeWidth={1.7} />
      <circle cx="12" cy="13.5" r="3.4" fill="none" stroke="currentColor" strokeWidth={1.7} />
    </>
  ),
  image: () => (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" fill="none" stroke="currentColor" strokeWidth={1.7} />
      <circle cx="8.5" cy="9.5" r="1.5" fill="none" stroke="currentColor" strokeWidth={1.7} />
      <path d="M4 17l4.5-4.5 3 3L15 11l5 5" fill="none" stroke="currentColor" strokeWidth={1.7} />
    </>
  ),
};

export function Icon({ name, size = 22, filled = false, strokeWidth, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={strokeWidth ? { strokeWidth } : undefined}
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name](filled)}
    </svg>
  );
}
