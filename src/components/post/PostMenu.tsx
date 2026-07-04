import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { useI18n } from '@/hooks/useI18n';
import { cn } from '@/lib/cn';

interface PostMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * Compact "…" overflow menu shown on one's own feather: edit / delete. Closes on
 * Escape or an outside click; every click here stops propagation so it never
 * triggers the card's open-thread behaviour.
 */
export function PostMenu({ onEdit, onDelete }: PostMenuProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocPointer = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const choose = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  return (
    <div ref={ref} className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        aria-label={t('post.menu')}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface-hover hover:text-fg"
      >
        <Icon name="more" size={18} />
      </button>
      {open ? (
        <div
          role="menu"
          className={cn(
            'absolute right-0 top-full z-30 mt-1 w-44 overflow-hidden rounded-md border border-border',
            'bg-elevated py-1 shadow-lift animate-scale-in',
          )}
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => choose(onEdit)}
            className="flex min-h-[44px] w-full items-center px-4 text-left text-sm text-fg transition-colors hover:bg-surface-hover"
          >
            {t('post.edit.action')}
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => choose(onDelete)}
            className="flex min-h-[44px] w-full items-center px-4 text-left text-sm text-danger transition-colors hover:bg-surface-hover"
          >
            {t('post.delete.action')}
          </button>
        </div>
      ) : null}
    </div>
  );
}
