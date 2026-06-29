import { cn } from '@/lib/cn';

export interface TabItem<T extends string> {
  id: T;
  label: string;
}

interface TabsProps<T extends string> {
  items: ReadonlyArray<TabItem<T>>;
  active: T;
  onChange: (id: T) => void;
  className?: string;
}

/**
 * Underlined segmented tabs. The active marker is a single sliding hairline —
 * the only "accent" being contrast and weight, never color.
 */
export function Tabs<T extends string>({ items, active, onChange, className }: TabsProps<T>) {
  return (
    <div role="tablist" className={cn('flex border-b border-border', className)}>
      {items.map((item) => {
        const selected = item.id === active;
        return (
          <button
            key={item.id}
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(item.id)}
            className={cn(
              'relative flex-1 px-4 py-3.5 text-base font-display font-semibold transition-colors duration-200',
              'hover:bg-surface-hover',
              selected ? 'text-fg' : 'text-muted',
            )}
          >
            {item.label}
            <span
              className={cn(
                'absolute inset-x-0 -bottom-px mx-auto h-0.5 w-12 rounded-full transition-all duration-300 ease-plume',
                selected ? 'bg-invert opacity-100' : 'opacity-0',
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
