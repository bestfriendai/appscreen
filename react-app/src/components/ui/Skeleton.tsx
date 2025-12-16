import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-bg-tertiary',
        className
      )}
    />
  );
}

export function ScreenshotListSkeleton() {
  return (
    <div className="space-y-2 p-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-2 rounded-lg">
          <Skeleton className="w-12 h-20 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-2 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CanvasSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-bg-secondary rounded-xl">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Skeleton className="w-48 h-96 rounded-2xl" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
        <span className="text-sm text-text-secondary">Loading preview...</span>
      </div>
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="aspect-[4/3] rounded-xl border border-border overflow-hidden">
      <div className="h-full bg-bg-secondary p-4">
        <div className="h-full flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="w-8 h-14 rounded-md" />
              ))}
            </div>
          </div>
          <div className="pt-3 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-3">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function SidebarPanelSkeleton() {
  return (
    <div className="p-4 space-y-4">
      <Skeleton className="h-5 w-24" />
      <div className="space-y-3">
        <Skeleton className="h-9 w-full rounded-lg" />
        <Skeleton className="h-9 w-full rounded-lg" />
        <Skeleton className="h-9 w-full rounded-lg" />
      </div>
      <Skeleton className="h-5 w-20 mt-6" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    </div>
  );
}

export function TextInputSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  );
}
