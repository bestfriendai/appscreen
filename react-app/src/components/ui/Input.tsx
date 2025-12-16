import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs text-text-secondary font-medium">{label}</label>
        )}
        <input
          type={type}
          className={cn(
            'flex h-9 w-full rounded-lg border border-border bg-bg-tertiary px-3 py-2 text-sm',
            'text-text-primary placeholder:text-text-secondary',
            'focus:border-accent focus:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-colors',
            error && 'border-[#ff453a]',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <span className="text-xs text-[#ff453a]">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
