import React from 'react';

export const AbstractShapes: React.FC<{
  primaryColor?: string;
  secondaryColor?: string;
}> = ({ primaryColor = '#0f172a', secondaryColor = '#334155' }) => {
  return (
    <div className="absolute inset-0 bg-slate-100 overflow-hidden">
      {/* Background with slight gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200" />

      {/* Floating Geometric Shape 1 (Circle) */}
      <div
        className="absolute w-64 h-64 rounded-full border border-slate-300 backdrop-blur-sm"
        style={{
          top: '10%',
          right: '15%',
          background: `linear-gradient(135deg, ${primaryColor}10, ${primaryColor}05)`,
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        }}
      />

      {/* Floating Geometric Shape 2 (Square) */}
      <div
        className="absolute w-48 h-48 rounded-3xl border border-slate-300 backdrop-blur-sm rotate-12"
        style={{
          bottom: '20%',
          left: '10%',
          background: `linear-gradient(135deg, ${secondaryColor}10, ${secondaryColor}05)`,
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        }}
      />

      {/* Floating Geometric Shape 3 (Pill) */}
      <div
        className="absolute w-32 h-64 rounded-full border border-slate-300 backdrop-blur-sm -rotate-45"
        style={{
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(-45deg)',
          background: 'rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
        }}
      />

       {/* Accent Lines */}
       <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
        <path
          d="M0,100 C150,200 350,0 500,100"
          stroke={primaryColor}
          strokeWidth="2"
          fill="none"
          transform="scale(2)"
        />
         <circle cx="80%" cy="20%" r="5" fill={secondaryColor} />
         <circle cx="20%" cy="80%" r="8" fill={primaryColor} />
      </svg>
    </div>
  );
};
