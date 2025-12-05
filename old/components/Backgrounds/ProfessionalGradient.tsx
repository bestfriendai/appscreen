import React from 'react';

/**
 * ProfessionalGradient Background
 * Premium multi-stop gradients with subtle color transitions
 * Inspired by high-quality App Store screenshot templates
 */

interface ProfessionalGradientProps {
  colors: string[];
  style?: 'soft' | 'bold' | 'duotone' | 'aurora' | 'sunset' | 'minimal';
  direction?: 'diagonal' | 'vertical' | 'horizontal' | 'radial';
  themeMode?: 'light' | 'dark';
}

export const ProfessionalGradient: React.FC<ProfessionalGradientProps> = ({
  colors = ['#667eea', '#764ba2', '#f093fb'],
  style = 'soft',
  direction = 'diagonal',
  themeMode = 'dark'
}) => {
  const c1 = colors[0] || '#667eea';
  const c2 = colors[1] || '#764ba2';
  const c3 = colors[2] || colors[1] || '#f093fb';
  const c4 = colors[3] || colors[0];

  // Get gradient direction CSS
  const getGradientDirection = () => {
    switch (direction) {
      case 'vertical': return '180deg';
      case 'horizontal': return '90deg';
      case 'radial': return 'radial';
      default: return '135deg';
    }
  };

  // Soft style - gentle multi-stop gradients with blur
  if (style === 'soft') {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Base gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: direction === 'radial'
              ? `radial-gradient(ellipse at 30% 20%, ${c1}80 0%, ${c2}60 40%, ${c3}40 70%, ${c4}30 100%)`
              : `linear-gradient(${getGradientDirection()}, ${c1} 0%, ${c2} 35%, ${c3} 70%, ${c4} 100%)`
          }}
        />

        {/* Soft overlay orbs for depth */}
        <div
          className="absolute top-[-20%] left-[-10%] w-[60%] aspect-square rounded-full blur-[120px]"
          style={{ backgroundColor: c1, opacity: 0.4 }}
        />
        <div
          className="absolute bottom-[-15%] right-[-5%] w-[50%] aspect-square rounded-full blur-[100px]"
          style={{ backgroundColor: c3, opacity: 0.35 }}
        />
        <div
          className="absolute top-[40%] right-[20%] w-[30%] aspect-square rounded-full blur-[80px]"
          style={{ backgroundColor: c2, opacity: 0.25 }}
        />

        {/* Subtle noise for texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
          }}
        />
      </div>
    );
  }

  // Bold style - vivid color blocks
  if (style === 'bold') {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Strong gradient base */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(${getGradientDirection()}, ${c1} 0%, ${c2} 50%, ${c3} 100%)`
          }}
        />

        {/* Hard-edged color accent */}
        <div
          className="absolute bottom-0 left-0 w-full h-[40%]"
          style={{
            background: `linear-gradient(0deg, ${c3}90 0%, transparent 100%)`
          }}
        />

        {/* Decorative shape */}
        <svg
          className="absolute -bottom-20 -right-20"
          width="500"
          height="500"
          viewBox="0 0 500 500"
          style={{ opacity: 0.15 }}
        >
          <circle cx="350" cy="350" r="300" fill="#ffffff" />
        </svg>
      </div>
    );
  }

  // Duotone style - two-color with overlay effects
  if (style === 'duotone') {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary color base */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: c1 }}
        />

        {/* Secondary color overlay with blend */}
        <div
          className="absolute inset-0 mix-blend-multiply"
          style={{
            background: `linear-gradient(${getGradientDirection()}, transparent 0%, ${c2} 100%)`
          }}
        />

        {/* Light overlay for dimension */}
        <div
          className="absolute top-0 left-0 w-full h-[50%]"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)'
          }}
        />

        {/* Soft texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
          }}
        />
      </div>
    );
  }

  // Aurora style - northern lights inspired
  if (style === 'aurora') {
    return (
      <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: '#0a0a12' }}>
        {/* Aurora bands */}
        <div
          className="absolute top-[10%] left-[-20%] w-[140%] h-[40%] blur-[80px] opacity-60"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${c1}80 20%, ${c2}90 50%, ${c3}70 80%, transparent 100%)`,
            transform: 'rotate(-10deg)'
          }}
        />
        <div
          className="absolute top-[30%] left-[-10%] w-[120%] h-[30%] blur-[60px] opacity-40"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${c2}60 30%, ${c3}80 70%, transparent 100%)`,
            transform: 'rotate(-5deg)'
          }}
        />

        {/* Stars effect */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(1px 1px at 100px 50px, rgba(255,255,255,0.6) 1px, transparent 0),
                              radial-gradient(1px 1px at 300px 150px, rgba(255,255,255,0.5) 1px, transparent 0),
                              radial-gradient(1px 1px at 500px 80px, rgba(255,255,255,0.4) 1px, transparent 0),
                              radial-gradient(1px 1px at 700px 200px, rgba(255,255,255,0.6) 1px, transparent 0),
                              radial-gradient(1px 1px at 900px 100px, rgba(255,255,255,0.3) 1px, transparent 0),
                              radial-gradient(1px 1px at 200px 250px, rgba(255,255,255,0.5) 1px, transparent 0),
                              radial-gradient(1px 1px at 600px 300px, rgba(255,255,255,0.4) 1px, transparent 0)`
          }}
        />

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[40%]"
          style={{
            background: 'linear-gradient(0deg, #0a0a12 0%, transparent 100%)'
          }}
        />
      </div>
    );
  }

  // Sunset style - warm gradient inspired by golden hour
  if (style === 'sunset') {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Sky gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, 
              ${c1} 0%, 
              ${c2} 30%, 
              ${c3} 60%, 
              ${c4 || c1} 100%)`
          }}
        />

        {/* Sun glow */}
        <div
          className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[300px] h-[300px] rounded-full blur-[80px]"
          style={{ backgroundColor: c3, opacity: 0.6 }}
        />

        {/* Horizon light */}
        <div
          className="absolute bottom-[30%] left-0 right-0 h-[200px] blur-[60px]"
          style={{ backgroundColor: c2, opacity: 0.4 }}
        />
      </div>
    );
  }

  // Minimal style - very subtle, professional
  if (style === 'minimal') {
    const baseColor = themeMode === 'light' ? '#F5F5F7' : '#0A0A0A';
    return (
      <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: baseColor }}>
        {/* Extremely subtle gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: themeMode === 'light'
              ? `linear-gradient(${getGradientDirection()}, ${c1}08 0%, transparent 50%, ${c2}05 100%)`
              : `linear-gradient(${getGradientDirection()}, ${c1}15 0%, transparent 50%, ${c2}10 100%)`
          }}
        />

        {/* Soft corner accent */}
        <div
          className="absolute -top-[10%] -right-[10%] w-[40%] aspect-square rounded-full blur-[120px]"
          style={{ 
            backgroundColor: c1, 
            opacity: themeMode === 'light' ? 0.1 : 0.15 
          }}
        />
      </div>
    );
  }

  // Default fallback
  return (
    <div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(${getGradientDirection()}, ${c1} 0%, ${c2} 50%, ${c3} 100%)`
      }}
    />
  );
};

export default ProfessionalGradient;
