import { useEffect, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/Icon';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** On mobile the modal rises from the bottom as a sheet. */
  className?: string;
}

/**
 * Accessible overlay dialog. Closes on Escape and backdrop click, locks body
 * scroll while open, and animates in. Bottom-sheet on phones, centered on
 * desktop.
 */
export function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        aria-label="Закрыть"
        onClick={onClose}
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px] animate-fade-in"
      />
      <div
        className={cn(
          'relative w-full bg-elevated shadow-lift border border-border',
          'rounded-t-xl sm:rounded-xl sm:max-w-lg sm:mx-4',
          'animate-sheet-up sm:animate-scale-in',
          className,
        )}
      >
        {title ? (
          <header className="flex items-center justify-between px-5 pt-4 pb-2">
            <h2 className="font-display text-lg font-semibold">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть"
              className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-surface-hover hover:text-fg transition-colors"
            >
              <Icon name="close" size={20} />
            </button>
          </header>
        ) : null}
        <div className="px-5 pb-6 pt-2">{children}</div>
      </div>
    </div>
  );
}
