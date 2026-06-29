import { useLayoutEffect, useRef, useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { usePosts } from '@/hooks/usePosts';
import { POST_MAX, validatePostText } from '@/lib/validators';
import { cn } from '@/lib/cn';
import type { ID } from '@/types';

interface PostComposerProps {
  parentId?: ID | null;
  placeholder?: string;
  autoFocus?: boolean;
  onPublished?: () => void;
  /** Compact = reply context (no large padding, tighter type). */
  compact?: boolean;
}

/** Circular character meter — fills as the draft approaches the limit. */
function CharMeter({ value }: { value: number }) {
  const ratio = Math.min(value / POST_MAX, 1);
  const remaining = POST_MAX - value;
  const radius = 9;
  const circ = 2 * Math.PI * radius;
  const danger = remaining < 0;
  const warn = remaining <= 20;
  return (
    <span className="inline-flex items-center gap-1.5">
      {remaining <= 20 ? (
        <span className={cn('text-xs tabular-nums', danger ? 'text-danger' : 'text-muted')}>
          {remaining}
        </span>
      ) : null}
      <svg width="24" height="24" viewBox="0 0 24 24" className="-rotate-90">
        <circle cx="12" cy="12" r={radius} fill="none" stroke="var(--border-strong)" strokeWidth="2" />
        <circle
          cx="12"
          cy="12"
          r={radius}
          fill="none"
          stroke={danger ? 'var(--danger)' : warn ? 'var(--signal)' : 'var(--text)'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - Math.min(ratio, 1))}
          className="transition-[stroke-dashoffset] duration-200"
        />
      </svg>
    </span>
  );
}

export function PostComposer({
  parentId = null,
  placeholder,
  autoFocus = false,
  onPublished,
  compact = false,
}: PostComposerProps) {
  const { currentUser } = useAuth();
  const { publish } = usePosts();
  const [text, setText] = useState('');
  const [touched, setTouched] = useState(false);
  const areaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow the textarea to fit its content.
  useLayoutEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [text]);

  if (!currentUser) return null;

  const error = validatePostText(text);
  const canPublish = error === null;

  const submit = () => {
    setTouched(true);
    if (!canPublish) return;
    publish(text, parentId);
    setText('');
    setTouched(false);
    onPublished?.();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd/Ctrl+Enter to publish — a small power-user nicety.
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  };

  const defaultPlaceholder = parentId ? 'Ответь пером…' : 'Что в воздухе?';

  return (
    <div className={cn('flex gap-3', compact ? 'py-2' : 'p-4')}>
      <Avatar user={currentUser} size={compact ? 'sm' : 'md'} />
      <div className="flex-1">
        <textarea
          ref={areaRef}
          value={text}
          autoFocus={autoFocus}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          rows={1}
          placeholder={placeholder ?? defaultPlaceholder}
          className={cn(
            'w-full resize-none bg-transparent outline-none placeholder:text-faint',
            'text-fg leading-relaxed',
            compact ? 'text-base min-h-[2.5rem]' : 'text-lg min-h-[3rem]',
          )}
        />
        {touched && error ? (
          <p className="text-sm text-danger animate-fade-in">{error}</p>
        ) : null}
        <div className="mt-2 flex items-center justify-between border-t border-border pt-3">
          <span className="text-xs text-faint">
            {parentId ? 'Ответ виден в профиле' : '⌘↵ чтобы опубликовать'}
          </span>
          <div className="flex items-center gap-3">
            {text.length > 0 ? <CharMeter value={text.length} /> : null}
            <Button size="sm" onClick={submit} disabled={!canPublish}>
              {parentId ? 'Ответить' : 'Опубликовать'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
