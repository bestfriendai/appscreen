
import React from 'react';
import { FrameStyle, DeviceColor } from '../types';

interface DeviceFrameProps {
  imageSrc: string;
  style?: FrameStyle;
  deviceColor?: DeviceColor;
  className?: string;
  accentColor?: string;
}

const DeviceFrame: React.FC<DeviceFrameProps> = ({ 
  imageSrc, 
  style = FrameStyle.FRAMELESS,
  deviceColor = DeviceColor.MIDNIGHT,
  className = '',
  accentColor = '#ffffff'
}) => {
  
  // Enhanced screen content with realistic glass reflections and HIGH QUALITY image rendering
  const ScreenContent = () => (
    <div className="relative w-full h-full bg-black">
      <img
        src={imageSrc}
        alt="App Screenshot"
        className="w-full h-full object-cover select-none"
        style={{
          imageRendering: 'auto',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
        loading="eager"
        decoding="sync"
      />

      {/* Premium glass physics for realistic screen */}
      {/* 1. Subtle top-left highlight */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent pointer-events-none z-20"></div>

      {/* 2. Soft reflection band at top */}
      <div className="absolute top-0 left-0 right-0 h-[15%] bg-gradient-to-b from-white/6 to-transparent pointer-events-none z-20"></div>

      {/* 3. Very subtle vignette for depth */}
      <div className="absolute inset-0 pointer-events-none z-20"
           style={{ boxShadow: 'inset 0 0 100px rgba(0,0,0,0.15)' }}></div>
    </div>
  );

  // 1. FRAMELESS (Pure Screen - Clean modern look like template examples)
  if (style === FrameStyle.FRAMELESS) {
    return (
      <div className={`relative w-full h-full rounded-[48px] ${className}`}
           style={{
             boxShadow: '0 25px 80px -20px rgba(0,0,0,0.4), 0 15px 40px -15px rgba(0,0,0,0.3)'
           }}>
        {/* Clean screen with subtle notch */}
        <div className="w-full h-full rounded-[48px] overflow-hidden relative z-10 bg-black">
           <img
             src={imageSrc}
             alt="App Screenshot"
             className="w-full h-full object-cover select-none"
             style={{
               imageRendering: 'auto',
               WebkitBackfaceVisibility: 'hidden',
               backfaceVisibility: 'hidden',
               transform: 'translateZ(0)',
               willChange: 'transform',
             }}
             loading="eager"
             decoding="sync"
           />

           {/* Status bar simulation - top black bar with notch */}
           <div className="absolute top-0 left-0 right-0 h-[55px] bg-gradient-to-b from-black/40 to-transparent pointer-events-none z-30">
             {/* Dynamic Island / Notch */}
             <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[125px] h-[35px] bg-black rounded-full"></div>
           </div>

           {/* Subtle glass reflection */}
           <div className="absolute inset-0 bg-gradient-to-br from-white/4 via-transparent to-transparent pointer-events-none z-20"></div>

           {/* Screen edge highlight */}
           <div className="absolute inset-0 rounded-[48px] pointer-events-none z-20"
                style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)' }}></div>
        </div>
      </div>
    );
  }

  // 4.5 PREMIUM GLASS (Ultra-high-end frosted glass look)
  if (style === FrameStyle.PREMIUM_GLASS) {
    return (
        <div className={`relative w-full h-full rounded-[56px] ${className}`}
             style={{
               padding: '8px',
               background: 'linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, rgba(0,0,0,0.1) 100%)',
               boxShadow: '0 50px 100px -25px rgba(0,0,0,0.5), 0 25px 50px -20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
             }}>
            {/* Outer frosted rim */}
            <div className="absolute inset-0 rounded-[56px] ring-1 ring-white/20 pointer-events-none"></div>

            {/* Inner device body */}
            <div className="w-full h-full rounded-[48px] overflow-hidden relative bg-black"
                 style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.3)' }}>
                <ScreenContent />
                
                {/* Dynamic Island */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[120px] h-[34px] bg-black rounded-full z-40 pointer-events-none"
                     style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                </div>
            </div>

            {/* Edge highlight */}
            <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"></div>
        </div>
    );
  }

  // 2. MATTE (Clay Look - Clean modern matte finish)
  if (style === FrameStyle.MATTE) {
    return (
      <div 
         className={`relative w-full h-full rounded-[56px] p-[12px] flex items-center justify-center ${className}`}
         style={{ 
           backgroundColor: deviceColor,
           boxShadow: '0 35px 70px -20px rgba(0,0,0,0.35), 0 20px 40px -15px rgba(0,0,0,0.25)'
         }}
      >
         {/* Matte surface - subtle ambient occlusion */}
         <div className="absolute inset-0 rounded-[56px] bg-gradient-to-b from-white/8 to-transparent pointer-events-none"></div>
         <div className="absolute inset-0 rounded-[56px] bg-gradient-to-t from-black/8 to-transparent pointer-events-none"></div>
         
         {/* Inner screen bezel */}
         <div className="w-full h-full rounded-[44px] bg-black overflow-hidden relative z-10"
              style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.2)' }}>
            <ScreenContent />
         </div>
      </div>
    );
  }

  // 3. GLOW (Endel Style)
  if (style === FrameStyle.GLOW) {
    return (
      <div className={`relative w-full h-full ${className}`}>
        <div 
          className="absolute inset-6 bg-white/30 blur-[100px] rounded-[120px] opacity-50"
          style={{ backgroundColor: accentColor }}
        ></div>
        <div className="relative w-full h-full rounded-[60px] overflow-hidden shadow-[0_30px_90px_-20px_rgba(0,0,0,0.9)] bg-black ring-1 ring-white/20">
           <ScreenContent />
        </div>
      </div>
    );
  }

  // 4. GLASS FROST / MORPHISM
  if (style === FrameStyle.GLASS_FROST) {
    return (
      <div className={`relative w-full h-full rounded-[72px] p-2 bg-white/5 backdrop-blur-2xl shadow-[0_60px_120px_-20px_rgba(0,0,0,0.7)] border border-white/20 ${className}`}>
        <div className="w-full h-full rounded-[64px] overflow-hidden relative shadow-xl bg-black">
           <ScreenContent />
        </div>
      </div>
    );
  }

  // 5. FLAT (Swiss Brutalism)
  if (style === FrameStyle.FLAT) {
    return (
      <div className={`relative w-full h-full rounded-[64px] border-[12px] border-black bg-black shadow-[20px_20px_0px_rgba(0,0,0,0.25)] ${className}`}>
         <div className="w-full h-full rounded-[52px] overflow-hidden relative z-10 border border-white/10">
           <ScreenContent />
         </div>
      </div>
    );
  }

  // 6. OUTLINE (Wireframe)
  if (style === FrameStyle.OUTLINE) {
    return (
      <div className={`relative w-full h-full rounded-[64px] border-[4px] border-white bg-transparent ${className} shadow-xl`}>
         <div className="absolute inset-4 rounded-[48px] overflow-hidden border border-white/20 bg-black/50 backdrop-blur-sm">
           <ScreenContent />
         </div>
      </div>
    );
  }

  // 7. TITANIUM & CERAMIC (Physical Models)
  const isTitanium = style === FrameStyle.TITANIUM;
  const frameColor = isTitanium 
    ? 'linear-gradient(135deg, #4a4a4a, #2a2a2a, #4a4a4a)' // Anodized metal look
    : deviceColor; // Glossy paint look

  return (
    <div 
       className={`relative w-full h-full rounded-[72px] p-[6px] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.9),0_20px_40px_-10px_rgba(0,0,0,0.5)] flex items-center justify-center ${className}`}
       style={{ background: frameColor }}
    >
       {/* Metallic Rim Light reflection */}
       <div className="absolute inset-0 rounded-[72px] ring-1 ring-white/30 pointer-events-none z-50 mix-blend-overlay opacity-80"></div>
       
       {/* Volume/Power Buttons (Subtle details) */}
       <div className="absolute -left-[5px] top-[200px] w-[5px] h-[60px] bg-gray-700 rounded-l-md opacity-90 shadow-sm"></div>
       <div className="absolute -left-[5px] top-[280px] w-[5px] h-[60px] bg-gray-700 rounded-l-md opacity-90 shadow-sm"></div>
       <div className="absolute -right-[5px] top-[240px] w-[5px] h-[90px] bg-gray-700 rounded-r-md opacity-90 shadow-sm"></div>

       {/* Soft Highlights on the frame itself */}
       <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/30 to-transparent rounded-t-[72px] pointer-events-none opacity-40 mix-blend-soft-light"></div>
       <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-black/40 to-transparent rounded-b-[72px] pointer-events-none opacity-50"></div>

       {/* Inner Black Bezel */}
       <div className="w-full h-full rounded-[64px] border-[8px] border-black bg-black overflow-hidden relative z-10 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
          <ScreenContent />
          
          {/* Dynamic Island */}
          <div className="absolute top-7 left-1/2 -translate-x-1/2 w-[126px] h-[37px] bg-black rounded-full z-50 pointer-events-none flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.5)] border border-white/5">
             <div className="w-[30%] h-[30%] rounded-full bg-[#151515] ml-auto mr-3 ring-1 ring-white/10 blur-[0.5px]"></div>
             <div className="w-[10px] h-[10px] rounded-full bg-[#0a0a0a] mr-2 ring-1 ring-white/5 opacity-50"></div>
          </div>
       </div>
    </div>
  );
};

export default DeviceFrame;
