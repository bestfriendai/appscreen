import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = forwardRef<
  ElementRef<typeof CollapsiblePrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger> & {
    showChevron?: boolean;
  }
>(({ className, children, showChevron = true, ...props }, ref) => (
  <CollapsiblePrimitive.Trigger
    ref={ref}
    className={cn(
      'flex w-full items-center justify-between py-2 text-sm font-medium transition-all',
      'hover:text-text-primary',
      '[&[data-state=open]>svg]:rotate-180',
      className
    )}
    {...props}
  >
    {children}
    {showChevron && (
      <ChevronDown className="h-4 w-4 shrink-0 text-text-secondary transition-transform duration-200" />
    )}
  </CollapsiblePrimitive.Trigger>
));
CollapsibleTrigger.displayName = CollapsiblePrimitive.Trigger.displayName;

const CollapsibleContent = forwardRef<
  ElementRef<typeof CollapsiblePrimitive.Content>,
  ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <CollapsiblePrimitive.Content
    ref={ref}
    className={cn(
      'overflow-hidden transition-all',
      'data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down',
      className
    )}
    {...props}
  >
    {children}
  </CollapsiblePrimitive.Content>
));
CollapsibleContent.displayName = CollapsiblePrimitive.Content.displayName;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
