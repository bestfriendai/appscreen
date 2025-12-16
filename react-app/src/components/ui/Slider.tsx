import * as SliderPrimitive from '@radix-ui/react-slider';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import { cn } from '../../lib/utils';

interface SliderProps extends ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  label?: string;
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
}

const Slider = forwardRef<ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  (
    { className, label, showValue = false, valueFormatter, value, defaultValue, ...props },
    ref
  ) => {
    const currentValue = value?.[0] ?? defaultValue?.[0] ?? 0;
    const displayValue = valueFormatter
      ? valueFormatter(currentValue)
      : currentValue.toString();

    return (
      <div className="flex flex-col gap-2">
        {(label || showValue) && (
          <div className="flex items-center justify-between">
            {label && (
              <label className="text-xs text-text-secondary font-medium">{label}</label>
            )}
            {showValue && (
              <span className="text-xs text-text-secondary tabular-nums">
                {displayValue}
              </span>
            )}
          </div>
        )}
        <SliderPrimitive.Root
          ref={ref}
          className={cn(
            'relative flex w-full touch-none select-none items-center',
            className
          )}
          value={value}
          defaultValue={defaultValue}
          {...props}
        >
          <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-bg-tertiary">
            <SliderPrimitive.Range className="absolute h-full bg-accent" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full bg-accent shadow-md transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing" />
        </SliderPrimitive.Root>
      </div>
    );
  }
);

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
