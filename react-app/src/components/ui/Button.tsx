import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
          'disabled:pointer-events-none disabled:opacity-50',
          // Variants
          {
            'bg-bg-tertiary text-text-primary hover:bg-[#252528] border border-border':
              variant === 'default',
            'bg-accent text-white hover:bg-accent-hover': variant === 'primary',
            'bg-bg-secondary text-text-primary hover:bg-bg-tertiary border border-border':
              variant === 'secondary',
            'bg-transparent text-text-secondary hover:bg-bg-tertiary hover:text-text-primary':
              variant === 'ghost',
            'bg-[#ff453a] text-white hover:bg-[#ff6961]': variant === 'danger',
          },
          // Sizes
          {
            'h-8 px-3 text-xs rounded-md': size === 'sm',
            'h-9 px-4 text-sm rounded-lg': size === 'md',
            'h-10 px-6 text-base rounded-lg': size === 'lg',
            'h-9 w-9 rounded-lg': size === 'icon',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
