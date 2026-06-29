import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /** Validation error in the product voice; flips the field to its error state. */
  error?: string | null;
  hint?: string;
  /** Static adornment rendered inside the field, e.g. a leading "@". */
  leading?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, leading, className, id, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const describedBy = error ? `${inputId}-err` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-muted">
        {label}
      </label>
      <div
        className={cn(
          'flex items-center gap-2 rounded-md border bg-elevated px-3.5 transition-colors duration-200',
          'focus-within:border-border-strong focus-within:shadow-focus',
          error ? 'border-danger' : 'border-border',
        )}
      >
        {leading ? <span className="text-muted text-base select-none">{leading}</span> : null}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={cn(
            'h-11 w-full bg-transparent text-base text-fg outline-none',
            'placeholder:text-faint',
            className,
          )}
          {...props}
        />
      </div>
      {error ? (
        <p id={`${inputId}-err`} className="text-sm text-danger animate-fade-in">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-sm text-faint">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
