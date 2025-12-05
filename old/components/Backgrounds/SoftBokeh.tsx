import React from 'react';

export const SoftBokeh: React.FC<{
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}> = ({
  primaryColor = '#60a5fa',
  secondaryColor = '#c084fc',
  accentColor = '#f472b6'
}) => {
  return (
    <div className="absolute inset-0 bg-white overflow-hidden">
      {/* Base Light Background */}
      <div className="absolute inset-0 bg-slate-50 opacity-50" />

      {/* Large Orb 1 */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-30 mix-blend-multiply animate-pulse"
        style={{
          top: '-10%',
          left: '-10%',
          backgroundColor: primaryColor,
          animationDuration: '7s'
        }}
      />

      {/* Large Orb 2 */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-30 mix-blend-multiply animate-pulse"
        style={{
          bottom: '-10%',
          right: '-5%',
          backgroundColor: secondaryColor,
          animationDuration: '10s',
          animationDelay: '1s'
        }}
      />

      {/* Medium Orb 3 */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full blur-3xl opacity-25 mix-blend-multiply"
        style={{
          top: '40%',
          left: '30%',
          backgroundColor: accentColor,
        }}
      />

      {/* Noise Texture Overlay for grain effect */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};
