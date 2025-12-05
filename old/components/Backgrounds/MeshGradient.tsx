import React from 'react';

interface MeshGradientProps {
  colors: string[];
  animate?: boolean;
}

export const MeshGradient: React.FC<MeshGradientProps> = ({ colors, animate = true }) => {
  const bg = colors[0] || '#000000';
  const c1 = colors[1] || colors[0];
  const c2 = colors[2] || colors[0];
  const c3 = colors[3] || colors[0];

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: bg }}>
      <div className={`absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-60 mix-blend-saturation blur-[100px] ${animate ? 'animate-pulse' : ''}`}
           style={{ background: `radial-gradient(circle at 50% 50%, ${c1}, transparent 50%)` }}></div>
      <div className={`absolute top-0 right-0 w-[100%] h-[100%] opacity-40 mix-blend-screen blur-[120px]`}
           style={{ background: `radial-gradient(circle at 80% 20%, ${c2}, transparent 60%)` }}></div>
      <div className={`absolute bottom-0 left-0 w-[120%] h-[80%] opacity-50 mix-blend-color-dodge blur-[150px]`}
           style={{ background: `radial-gradient(circle at 20% 80%, ${c3}, transparent 60%)` }}></div>
      <div className="absolute inset-0 bg-white/5 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.4\'/%3E%3C/svg%3E")' }}></div>
    </div>
  );
};
