import { Icon } from '@/components/ui/Icon';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/cn';
import type { ToastTone } from '@/context/ToastContext';

const TONE_STYLES: Record<ToastTone, string> = {
  neutral: 'border-border-strong text-fg',
  signal: 'border-signal/50 text-fg',
  danger: 'border-danger/50 text-fg',
};

const TONE_ICON: Record<ToastTone, 'check' | 'feather' | 'close'> = {
  neutral: 'check',
  signal: 'feather',
  danger: 'close',
};

/** Bottom-centered transient messages in the brand voice. */
export function Toaster() {
  const { toasts, dismiss } = useToast();
  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 sm:bottom-8">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          onClick={() => dismiss(toast.id)}
          className={cn(
            'pointer-events-auto flex max-w-sm items-center gap-2.5 rounded-full border bg-elevated/95 backdrop-blur',
            'px-4 py-2.5 text-sm shadow-lift animate-toast-in',
            TONE_STYLES[toast.tone],
          )}
        >
          <Icon
            name={TONE_ICON[toast.tone]}
            size={16}
            filled={toast.tone === 'signal'}
            className={toast.tone === 'signal' ? 'text-signal' : toast.tone === 'danger' ? 'text-danger' : 'text-fg'}
          />
          <span className="text-left">{toast.message}</span>
        </button>
      ))}
    </div>
  );
}
