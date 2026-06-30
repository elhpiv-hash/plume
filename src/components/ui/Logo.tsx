import { cn } from '@/lib/cn';

interface LogoProps {
  className?: string;
}

/** Text wordmark only — the "P" brand mark was retired from the chrome. */
export function Logo({ className }: LogoProps) {
  return (
    <span
      className={cn(
        'font-display text-xl font-bold tracking-tight text-fg',
        className,
      )}
    >
      Plume
    </span>
  );
}
