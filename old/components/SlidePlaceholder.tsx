import React from 'react';

interface SlidePlaceholderProps {
  index: number;
}

export default function SlidePlaceholder({ index }: SlidePlaceholderProps) {
  return (
    <div className="relative aspect-[1290/2796] rounded-2xl border border-white/10 bg-surfaceHighlight overflow-hidden group shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#202020_1px,transparent_1px),linear-gradient(to_bottom,#202020_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.2] pointer-events-none"></div>

      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent animate-pulse" />
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      {/* Content skeleton */}
      <div className="absolute inset-0 p-8 flex flex-col">
        {/* Title skeleton */}
        <div className="mt-16 space-y-3">
          <div className="h-12 bg-white/10 rounded-lg w-3/4 animate-pulse" />
          <div className="h-12 bg-white/10 rounded-lg w-2/3 animate-pulse" style={{ animationDelay: '150ms' }} />
        </div>
        
        {/* Subtitle skeleton */}
        <div className="mt-6 space-y-2">
          <div className="h-6 bg-white/5 rounded w-5/6 animate-pulse" style={{ animationDelay: '300ms' }} />
          <div className="h-6 bg-white/5 rounded w-4/6 animate-pulse" style={{ animationDelay: '450ms' }} />
        </div>
        
        {/* Device placeholder */}
        <div className="mt-auto mb-12 mx-auto">
          <div className="w-64 h-[550px] bg-white/5 rounded-[40px] border border-white/10 animate-pulse" style={{ animationDelay: '600ms' }}>
            <div className="w-full h-full p-2">
              <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent rounded-[32px]" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Loading indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(0,209,255,0.8)]" />
        <span className="text-xs font-bold text-primary/80 uppercase tracking-wider font-mono">Generating...</span>
      </div>
      
      {/* Slide number */}
      <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
        <span className="text-xs font-bold text-white/60">Slide {index + 1}</span>
      </div>
    </div>
  );
}
