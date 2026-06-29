import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const BASE =
  'inline-flex items-center justify-center gap-2 font-display font-semibold rounded-full select-none ' +
  'transition-[transform,background-color,color,box-shadow,opacity] duration-200 ease-plume ' +
  'active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none focus-visible:shadow-focus';

const VARIANTS: Record<Variant, string> = {
  // The signature inverted button: high-contrast, monochrome.
  primary: 'bg-invert text-invert-fg hover:bg-invert-hover',
  secondary: 'bg-surface text-fg border border-border-strong hover:bg-surface-hover',
  ghost: 'bg-transparent text-fg hover:bg-surface-hover',
  danger: 'bg-transparent text-danger border border-border-strong hover:bg-surface-hover',
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-base',
  lg: 'h-12 px-6 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', fullWidth = false, className, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(BASE, VARIANTS[variant], SIZES[size], fullWidth && 'w-full', className)}
      {...props}
    />
  );
});
