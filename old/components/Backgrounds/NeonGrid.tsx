import React from 'react';

export const NeonGrid: React.FC<{
  primaryColor?: string;
  secondaryColor?: string;
}> = ({ primaryColor = '#3b82f6', secondaryColor = '#8b5cf6' }) => {
  return (
    <div className="absolute inset-0 bg-slate-900 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800" />

      {/* Grid lines - Perspective Effect */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(${primaryColor} 1px, transparent 1px),
            linear-gradient(90deg, ${secondaryColor} 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(2)',
          transformOrigin: 'top center',
          maskImage: 'linear-gradient(to bottom, transparent 20%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 20%, black 100%)'
        }}
      />

      {/* Horizon glow */}
      <div
        className="absolute top-1/3 left-0 right-0 h-32 blur-3xl opacity-40"
        style={{
          background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-[1px] animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              backgroundColor: i % 2 === 0 ? primaryColor : secondaryColor,
              opacity: Math.random() * 0.5 + 0.2,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};
