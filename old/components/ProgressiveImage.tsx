import React, { useState, useEffect, memo } from 'react';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * Progressive image loading with blur-up effect
 */
const ProgressiveImageComponent: React.FC<ProgressiveImageProps> = ({ src, alt, className = '' }) => {
  const [loaded, setLoaded] = useState(false);
  const [thumbSrc, setThumbSrc] = useState<string>('');

  useEffect(() => {
    // Reset loaded state for new src and generate tiny blur placeholder
    setLoaded(false);

    let isMounted = true;

    const canvas = document.createElement('canvas');
    canvas.width = 20;
    canvas.height = 43;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      if (!isMounted) return;
      ctx?.drawImage(img, 0, 0, 20, 43);
      setThumbSrc(canvas.toDataURL());
    };
    img.src = src;

    return () => {
      isMounted = false;
    };
  }, [src]);

  return (
    <div className={`relative ${className}`}>
      {/* Blur placeholder */}
      {thumbSrc && !loaded && (
        <img
          src={thumbSrc}
          className="absolute inset-0 w-full h-full object-cover blur-xl scale-110"
          aria-hidden="true"
          alt=""
        />
      )}

      {/* Full image */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        loading="eager"
        decoding="sync"
        style={{
          imageRendering: '-webkit-optimize-contrast',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};

// Memoize to prevent re-renders when src hasn't changed
export default memo(ProgressiveImageComponent, (prev, next) => {
  return prev.src === next.src && prev.alt === next.alt && prev.className === next.className;
});
