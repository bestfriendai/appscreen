import React from 'react';

/**
 * OrganicShapes Background
 * Creates professional App Store style backgrounds with flowing organic shapes
 * Inspired by high-quality template designs like the food app examples
 */

interface OrganicShapesProps {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  variant?: 'flowing' | 'circles' | 'waves' | 'blobs' | 'minimal';
  themeMode?: 'light' | 'dark';
}

export const OrganicShapes: React.FC<OrganicShapesProps> = ({
  primaryColor = '#4A7C59',
  secondaryColor = '#8FBC8F',
  accentColor = '#2F4F2F',
  variant = 'flowing',
  themeMode = 'dark'
}) => {
  const bgBase = themeMode === 'light' ? '#F5F5F7' : '#0A0A0A';

  // Flowing variant - like the food app example with curved organic shapes
  if (variant === 'flowing') {
    return (
      <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: bgBase }}>
        {/* Base gradient layer */}
        <div 
          className="absolute inset-0"
          style={{
            background: themeMode === 'light' 
              ? `linear-gradient(135deg, ${primaryColor}15 0%, ${bgBase} 50%, ${secondaryColor}10 100%)`
              : `linear-gradient(135deg, ${primaryColor}30 0%, ${bgBase} 50%, ${secondaryColor}20 100%)`
          }}
        />

        {/* Large flowing shape - top left */}
        <svg
          className="absolute -top-20 -left-20"
          width="800"
          height="1000"
          viewBox="0 0 800 1000"
          fill="none"
          style={{ opacity: themeMode === 'light' ? 0.6 : 0.4 }}
        >
          <path
            d="M-100,200 C100,100 200,300 150,500 C100,700 300,900 100,1000 L-100,1000 Z"
            fill={primaryColor}
          />
          <path
            d="M-50,250 C150,150 250,350 200,550 C150,750 350,950 150,1050 L-50,1050 Z"
            fill={secondaryColor}
            opacity="0.5"
          />
        </svg>

        {/* Flowing shape - bottom right */}
        <svg
          className="absolute -bottom-20 -right-20"
          width="600"
          height="800"
          viewBox="0 0 600 800"
          fill="none"
          style={{ opacity: themeMode === 'light' ? 0.5 : 0.3 }}
        >
          <path
            d="M700,100 C500,200 600,400 650,600 C700,800 500,700 700,900 L800,900 L800,0 Z"
            fill={secondaryColor}
          />
        </svg>

        {/* Decorative circles */}
        <div
          className="absolute top-[15%] left-[10%] w-32 h-32 rounded-full"
          style={{ 
            backgroundColor: accentColor,
            opacity: themeMode === 'light' ? 0.2 : 0.15
          }}
        />
        <div
          className="absolute bottom-[25%] right-[15%] w-20 h-20 rounded-full"
          style={{ 
            backgroundColor: primaryColor,
            opacity: themeMode === 'light' ? 0.25 : 0.2
          }}
        />

        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.03,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
      </div>
    );
  }

  // Circles variant - large overlapping circles
  if (variant === 'circles') {
    return (
      <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: bgBase }}>
        {/* Large circle top-left */}
        <div
          className="absolute -top-[20%] -left-[15%] w-[60%] aspect-square rounded-full"
          style={{
            background: `radial-gradient(circle, ${primaryColor}40 0%, ${primaryColor}00 70%)`,
          }}
        />

        {/* Medium circle bottom-right */}
        <div
          className="absolute -bottom-[10%] -right-[10%] w-[50%] aspect-square rounded-full"
          style={{
            background: `radial-gradient(circle, ${secondaryColor}35 0%, ${secondaryColor}00 70%)`,
          }}
        />

        {/* Small accent circle */}
        <div
          className="absolute top-[40%] right-[20%] w-[25%] aspect-square rounded-full"
          style={{
            background: `radial-gradient(circle, ${accentColor}25 0%, ${accentColor}00 60%)`,
          }}
        />

        {/* Solid decorative circles */}
        <div
          className="absolute top-[8%] left-[5%] w-16 h-16 rounded-full"
          style={{ backgroundColor: primaryColor, opacity: 0.3 }}
        />
        <div
          className="absolute bottom-[15%] left-[8%] w-8 h-8 rounded-full"
          style={{ backgroundColor: secondaryColor, opacity: 0.4 }}
        />

        {/* Noise overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
          }}
        />
      </div>
    );
  }

  // Waves variant - horizontal flowing waves
  if (variant === 'waves') {
    return (
      <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: bgBase }}>
        {/* Wave 1 - Bottom */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          height="400"
          viewBox="0 0 1290 400"
          preserveAspectRatio="none"
          style={{ opacity: 0.4 }}
        >
          <path
            d="M0,100 C300,200 600,0 900,100 C1100,180 1200,80 1290,150 L1290,400 L0,400 Z"
            fill={primaryColor}
          />
        </svg>

        {/* Wave 2 - Middle */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          height="350"
          viewBox="0 0 1290 350"
          preserveAspectRatio="none"
          style={{ opacity: 0.3 }}
        >
          <path
            d="M0,150 C400,50 500,200 800,100 C1000,30 1100,150 1290,80 L1290,350 L0,350 Z"
            fill={secondaryColor}
          />
        </svg>

        {/* Top decorative wave */}
        <svg
          className="absolute top-0 left-0 w-full"
          height="300"
          viewBox="0 0 1290 300"
          preserveAspectRatio="none"
          style={{ opacity: 0.25 }}
        >
          <path
            d="M0,200 C200,100 400,250 700,150 C900,80 1100,200 1290,120 L1290,0 L0,0 Z"
            fill={primaryColor}
          />
        </svg>

        {/* Decorative elements */}
        <div
          className="absolute top-[10%] right-[10%] w-24 h-24 rounded-full"
          style={{ backgroundColor: accentColor, opacity: 0.2 }}
        />
      </div>
    );
  }

  // Blobs variant - organic blob shapes
  if (variant === 'blobs') {
    return (
      <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: bgBase }}>
        {/* Blob 1 - Top Left */}
        <svg
          className="absolute -top-20 -left-32"
          width="600"
          height="600"
          viewBox="0 0 600 600"
          style={{ opacity: 0.35 }}
        >
          <path
            d="M300,50 C450,80 550,200 520,350 C490,500 350,550 200,500 C50,450 20,300 80,180 C140,60 200,30 300,50"
            fill={primaryColor}
          />
        </svg>

        {/* Blob 2 - Bottom Right */}
        <svg
          className="absolute -bottom-32 -right-32"
          width="500"
          height="500"
          viewBox="0 0 500 500"
          style={{ opacity: 0.3 }}
        >
          <path
            d="M250,30 C400,50 470,150 450,280 C430,410 320,480 180,450 C40,420 10,280 50,150 C90,20 150,10 250,30"
            fill={secondaryColor}
          />
        </svg>

        {/* Blob 3 - Center accent */}
        <svg
          className="absolute top-[30%] right-[20%]"
          width="300"
          height="300"
          viewBox="0 0 300 300"
          style={{ opacity: 0.2 }}
        >
          <path
            d="M150,20 C220,30 270,100 260,180 C250,260 180,290 100,260 C20,230 0,150 40,80 C80,10 120,10 150,20"
            fill={accentColor}
          />
        </svg>

        {/* Small circles */}
        <div
          className="absolute top-[15%] left-[60%] w-12 h-12 rounded-full"
          style={{ backgroundColor: primaryColor, opacity: 0.25 }}
        />
        <div
          className="absolute bottom-[30%] left-[15%] w-8 h-8 rounded-full"
          style={{ backgroundColor: secondaryColor, opacity: 0.3 }}
        />
      </div>
    );
  }

  // Minimal variant - very subtle, clean
  if (variant === 'minimal') {
    return (
      <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: bgBase }}>
        {/* Very subtle gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(160deg, ${primaryColor}08 0%, transparent 40%, ${secondaryColor}05 100%)`
          }}
        />

        {/* Single decorative circle */}
        <div
          className="absolute -top-[10%] -right-[5%] w-[40%] aspect-square rounded-full"
          style={{
            background: `radial-gradient(circle, ${primaryColor}12 0%, transparent 70%)`
          }}
        />

        {/* Bottom accent */}
        <div
          className="absolute -bottom-[5%] -left-[5%] w-[30%] aspect-square rounded-full"
          style={{
            background: `radial-gradient(circle, ${secondaryColor}10 0%, transparent 60%)`
          }}
        />
      </div>
    );
  }

  return null;
};

export default OrganicShapes;
