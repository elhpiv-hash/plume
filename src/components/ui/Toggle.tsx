import { cn } from '@/lib/cn';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  id?: string;
}

/** A monochrome switch — the knob inverts against the track when active. */
export function Toggle({ checked, onChange, label, id }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full',
        'transition-colors duration-300 ease-plume focus-visible:shadow-focus',
        checked ? 'bg-invert' : 'bg-surface border border-border-strong',
      )}
    >
      <span
        className={cn(
          'inline-block h-5 w-5 rounded-full transition-transform duration-300 ease-plume',
          checked ? 'translate-x-6 bg-invert-fg' : 'translate-x-1 bg-fg/70',
        )}
      />
    </button>
  );
}
