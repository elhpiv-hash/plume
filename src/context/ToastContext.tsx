import {
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createId } from '@/lib/id';

export type ToastTone = 'neutral' | 'signal' | 'danger';

export interface Toast {
  id: string;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  toasts: Toast[];
  notify: (message: string, tone?: ToastTone) => void;
  dismiss: (id: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_TTL = 3600;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const notify = useCallback(
    (message: string, tone: ToastTone = 'neutral') => {
      const id = createId('tst');
      setToasts((prev) => [...prev.slice(-2), { id, message, tone }]);
      const timer = setTimeout(() => dismiss(id), TOAST_TTL);
      timers.current.set(id, timer);
    },
    [dismiss],
  );

  const value = useMemo<ToastContextValue>(
    () => ({ toasts, notify, dismiss }),
    [toasts, notify, dismiss],
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}
