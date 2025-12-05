import React, { useMemo, useState } from 'react';
import { DndContext, DragEndEvent, useDraggable, useSensor, useSensors, PointerSensor, DragStartEvent } from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';

import DeviceFrame from './DeviceFrame';
import { LayoutType, FrameStyle, FontStyle, DeviceColor, Widget, DesignTheme, ThemeMode, FloatingElement } from '../types';
import { AppStrategy } from '../types/AppStrategy';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants';
import { Loader2, Star, Shield, Zap, Award, Check, Heart, Bell, CreditCard, Activity, RefreshCw, Download, Lock, Utensils, Plane, Dumbbell, Code, Music, ShoppingBag, Briefcase } from 'lucide-react';
import { typographyEngine } from '../utils/typographyEngine';
import { getSmartCropPosition } from '../utils/smartCrop';
import { analyzeContrast } from '../utils/smartContrast';
import { getProfessionalPalette, getRandomPrimaryColor, getRandomAccentColor } from '../utils/professionalColors';
import { detectAppCategory, AppCategory } from '../utils/categoryDetection';

// Background Components
import { MeshGradient } from './Backgrounds/MeshGradient';
import { NeonGrid } from './Backgrounds/NeonGrid';
import { SoftBokeh } from './Backgrounds/SoftBokeh';
import { AbstractShapes } from './Backgrounds/AbstractShapes';
import { OrganicShapes } from './Backgrounds/OrganicShapes';
import { ProfessionalGradient } from './Backgrounds/ProfessionalGradient';

// --- DRAGGABLE WRAPPER ---
interface DraggableProps {
  id: string;
  children: React.ReactNode;
  initialOffset?: { x: number, y: number };
  style?: React.CSSProperties;
  className?: string;
  onDragStart?: () => void;
}

const Draggable: React.FC<DraggableProps> = ({ id, children, initialOffset, style, className, onDragStart }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });

  const currentX = (initialOffset?.x || 0) + (transform?.x || 0);
  const currentY = (initialOffset?.y || 0) + (transform?.y || 0);

  const combinedStyle: React.CSSProperties = {
    ...style,
    transform: `translate3d(${currentX}px, ${currentY}px, 0)`,
    cursor: isDragging ? 'grabbing' : 'grab',
    touchAction: 'none',
    zIndex: isDragging ? 100 : style?.zIndex,
  };

  return (
    <div
        ref={setNodeRef}
        style={combinedStyle}
        {...listeners}
        {...attributes}
        className={className}
    >
      {children}
    </div>
  );
};

interface CanvasPreviewProps {
  screenshotUrl: string | null;
  secondaryScreenshotUrl?: string | null;
  backgroundUrl: string | null;
  title: string;
  subtitle: string;
  keywords?: string[];
  layout: LayoutType;
  theme?: DesignTheme;
  themeMode?: ThemeMode;
  frameStyle?: FrameStyle;
  deviceColor?: DeviceColor;
  fontStyle?: FontStyle;
  accentColor?: string;
  scale?: number;
  widgets?: Widget[];
  floatingElements?: FloatingElement[];
  index?: number;
  totalSlides?: number;
  isPanoramic?: boolean;
  deviceOffset?: { x: number; y: number };
  onRegenerateBackground?: () => void;
  availableBackgrounds?: string[];
  onChooseBackground?: (bg: string) => void;
  onDeviceTransformChange?: (offset: { x: number; y: number }) => void;
  textOffset?: { x: number; y: number };
  onTextTransformChange?: (offset: { x: number; y: number }) => void;
  customTextColor?: string;
  customFontSize?: number;
  appStrategy?: AppStrategy | null;
}

const CanvasPreview: React.FC<CanvasPreviewProps> = ({
  screenshotUrl,
  secondaryScreenshotUrl,
  backgroundUrl,
  title,
  subtitle,
  keywords = [],
  layout,
  theme = 'MODERN_MINIMAL',
  themeMode = 'DARK',
  frameStyle = FrameStyle.PREMIUM_GLASS, // Default to Premium
  deviceColor = DeviceColor.MIDNIGHT,
  fontStyle = 'MODERN_CLEAN',
  accentColor = '#ffffff',
  scale = 0.2,
  widgets = [],
  floatingElements = [],
  index = 0,
  totalSlides = 4,
  isPanoramic = false,
  deviceOffset,
  onRegenerateBackground,
  availableBackgrounds = [],
  onChooseBackground,
  onDeviceTransformChange,
  textOffset,
  onTextTransformChange,
  customTextColor,
  customFontSize,
  appStrategy
}) => {

  const sensors = useSensors(
      useSensor(PointerSensor, {
          activationConstraint: {
              distance: 5,
          }
      })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const id = active?.id;
    if (id === 'draggable-text' && onTextTransformChange) {
        const newOffset = {
            x: (textOffset?.x || 0) + delta.x,
            y: (textOffset?.y || 0) + delta.y
        };
        onTextTransformChange(newOffset);
    } else if (id === 'draggable-device' && onDeviceTransformChange) {
         const newOffset = {
            x: (deviceOffset?.x || 0) + delta.x,
            y: (deviceOffset?.y || 0) + delta.y
        };
        onDeviceTransformChange(newOffset);
    }
  };

  const [bgPosition, setBgPosition] = React.useState<string>('center center');
  const [dynamicContrast, setDynamicContrast] = React.useState<{ color: string, shadow: string } | null>(null);

  React.useEffect(() => {
    if (backgroundUrl && !backgroundUrl.startsWith('#') && !backgroundUrl.startsWith('data:image/svg') && !backgroundUrl.startsWith('preset:')) {
      getSmartCropPosition(backgroundUrl, CANVAS_WIDTH, CANVAS_HEIGHT).then(setBgPosition);
      analyzeContrast(backgroundUrl, { x: 0, y: 200, w: 1290, h: 600 }, CANVAS_WIDTH, CANVAS_HEIGHT).then(res => {
        setDynamicContrast({ color: res.textColor, shadow: res.shadow });
      });
    } else {
      setBgPosition('center center');
      setDynamicContrast(null);
    }
  }, [backgroundUrl]);

  // --- SMART CONTEXT LOGIC ---
  const { appCategory, colorPalette, backgroundPreset } = useMemo(() => {
    if (appStrategy) {
       // STRATEGY MODE: Strict adherence to Global Theme
       return {
         appCategory: appStrategy.category,
         colorPalette: {
            primary: [appStrategy.palette.primary, appStrategy.palette.secondary, appStrategy.palette.accent],
            accent: [appStrategy.palette.accent],
            background: [appStrategy.palette.background, appStrategy.palette.primary],
            style: appStrategy.background.type as any,
            mood: appStrategy.vibe,
            saturation: 50,
            lightness: 50
         },
         backgroundPreset: appStrategy.background.type === 'abstract' ? 'shapes' : appStrategy.background.type
       };
    }

    // LEGACY MODE: Smart Guessing
    // 1. Detect Category
    const combinedText = `${title} ${subtitle} ${keywords.join(' ')}`;
    const category = detectAppCategory(combinedText);

    // 2. Get Professional Palette
    const palette = getProfessionalPalette(category);

    // 3. Determine Background Preset if not explicit
    let preset = 'mesh';
    if (backgroundUrl && backgroundUrl.startsWith('preset:')) {
      preset = backgroundUrl.replace('preset:', '');
    } else if (!backgroundUrl || backgroundUrl.startsWith('#')) {
      // Auto-select based on category
      switch(category) {
        case 'fitness':
        case 'developer':
          preset = 'neon';
          break;
        case 'food':
        case 'social':
        case 'health':
        case 'travel':
          preset = 'organic';
          break;
        case 'finance':
        case 'productivity':
        case 'education':
          preset = 'gradient';
          break;
        case 'shopping':
        case 'entertainment':
          preset = 'bold';
          break;
        default:
          preset = 'mesh';
      }
    }

    return { appCategory: category, colorPalette: palette, backgroundPreset: preset };
  }, [title, subtitle, keywords, backgroundUrl, appStrategy]);


  const { textColor, subTextColor, textShadow } = useMemo(() => {
    // Strategy Override
    if (appStrategy) {
       return {
         textColor: appStrategy.palette.text,
         subTextColor: appStrategy.palette.text + 'CC', // 80% opacity
         textShadow: themeMode === 'LIGHT'
            ? '0 2px 4px rgba(0,0,0,0.1)'
            : '0 4px 12px rgba(0,0,0,0.5)'
       };
    }

    let optimalColor = '#FFFFFF';
    let bgHint = '#000000';

    if (backgroundUrl) {
      if (backgroundUrl.startsWith('#')) {
        bgHint = backgroundUrl;
        optimalColor = typographyEngine.getOptimalTextColor(bgHint);
      } else if (backgroundUrl.startsWith('data:image/svg')) {
        const colorMatch = backgroundUrl.match(/fill="(#[0-9a-fA-F]{6})"/);
        if (colorMatch) {
          bgHint = colorMatch[1];
          optimalColor = typographyEngine.getOptimalTextColor(bgHint);
        }
      }
    } else {
      bgHint = themeMode === 'LIGHT' ? '#F5F5F7' : '#050505';
      optimalColor = typographyEngine.getOptimalTextColor(bgHint);
    }

    if (dynamicContrast) {
      optimalColor = dynamicContrast.color;
    }

    // Override for specific presets if they are dark/light knowns
    if (backgroundUrl?.startsWith('preset:neon')) optimalColor = '#FFFFFF';

    const isLight = optimalColor === '#FFFFFF';
    const subColor = isLight ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.75)';
    const strongShadow = '0 8px 24px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.7)';

    return {
      textColor: optimalColor,
      subTextColor: subColor,
      textShadow: dynamicContrast
        ? dynamicContrast.shadow
        : (isLight ? strongShadow : '0 4px 12px rgba(0,0,0,0.3)')
    };
  }, [backgroundUrl, themeMode, dynamicContrast]);

  const renderBackground = () => {
    // 1. Image URL
    if (backgroundUrl && !backgroundUrl.startsWith('#') && !backgroundUrl.startsWith('preset:')) {
      const isPanoramicBg = isPanoramic && totalSlides > 1;
      return (
        <div
          className="absolute inset-0 z-0"
          style={{
             backgroundImage: `url(${backgroundUrl})`,
             backgroundSize: isPanoramicBg ? `${totalSlides * 100}% auto` : 'cover',
             backgroundPosition: isPanoramicBg ? `${(index! / (totalSlides - 1)) * 100}% center` : bgPosition,
             backgroundRepeat: 'no-repeat',
             // High-quality image rendering
             imageRendering: 'auto',
             WebkitBackfaceVisibility: 'hidden',
             backfaceVisibility: 'hidden',
          }}
        />
      );
    }

    // 2. Solid Color
    if (backgroundUrl && backgroundUrl.startsWith('#')) {
      return <div className="absolute inset-0 z-0" style={{ backgroundColor: backgroundUrl }} />;
    }

    // 3. Procedural Presets (Thematic)
    // Use extracted palette or fallbacks
    const c1 = colorPalette.primary[0];
    const c2 = colorPalette.primary[1] || colorPalette.primary[0];
    const c3 = colorPalette.primary[2] || c1;
    const accent = colorPalette.accent[0];
    const bgColors = colorPalette.background || [c1, c2, c3];
    const mode = themeMode === 'LIGHT' ? 'light' : 'dark';

    switch (backgroundPreset) {
      case 'neon':
        return <NeonGrid primaryColor={c1} secondaryColor={accent} />;
      case 'organic':
        // Organic flowing shapes - great for food, health, social apps
        return <OrganicShapes 
          primaryColor={c1} 
          secondaryColor={c2} 
          accentColor={accent}
          variant="flowing"
          themeMode={mode}
        />;
      case 'gradient':
        // Professional gradients - great for finance, productivity
        return <ProfessionalGradient
          colors={bgColors}
          style="soft"
          direction="diagonal"
          themeMode={mode}
        />;
      case 'bold':
        // Bold color blocks - great for shopping, entertainment
        return <ProfessionalGradient
          colors={bgColors}
          style="bold"
          direction="diagonal"
          themeMode={mode}
        />;
      case 'bokeh':
        return <SoftBokeh primaryColor={c1} secondaryColor={c2} accentColor={accent} />;
      case 'shapes':
        return <AbstractShapes primaryColor={c1} secondaryColor={c2} />;
      case 'mesh':
      default:
        return <MeshGradient colors={[c1, c2, accent, '#000000']} animate={true} />;
    }
  };

  const renderThematicDecorators = () => {
      // More subtle, professional decorative elements
      // Only render for certain categories where it adds value
      const shouldShowIcons = ['food', 'fitness', 'travel', 'entertainment'].includes(appCategory);
      
      if (!shouldShowIcons) {
        // For professional categories, use abstract circles instead
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Subtle decorative circles */}
            <div 
              className="absolute top-[5%] left-[5%] w-20 h-20 rounded-full"
              style={{ 
                backgroundColor: colorPalette.primary[0], 
                opacity: themeMode === 'LIGHT' ? 0.08 : 0.12 
              }}
            />
            <div 
              className="absolute bottom-[15%] right-[8%] w-12 h-12 rounded-full"
              style={{ 
                backgroundColor: colorPalette.accent[0], 
                opacity: themeMode === 'LIGHT' ? 0.1 : 0.15 
              }}
            />
          </div>
        );
      }
      
      // For lifestyle categories, show subtle icons
      let Icon = Star;
      switch(appCategory) {
          case 'food': Icon = Utensils; break;
          case 'travel': Icon = Plane; break;
          case 'fitness': Icon = Dumbbell; break;
          case 'entertainment': Icon = Music; break;
          default: return null;
      }

      return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-[0.06] mix-blend-overlay">
              <Icon className="absolute top-24 left-16 w-48 h-48 text-white rotate-12" />
              <Icon className="absolute bottom-48 right-0 w-64 h-64 text-white -rotate-12" />
          </div>
      );
  };

  const renderAtmosphere = () => {
    return (
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className={`absolute inset-0 mix-blend-overlay ${themeMode === 'LIGHT' ? 'bg-white/30' : 'bg-black/20'}`}></div>
        <div
          className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-30 mix-blend-screen blur-[180px]"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${accentColor}, transparent 70%)`,
            transform: 'translate3d(0,0,0)'
          }}
        ></div>
        <div
          className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full opacity-20 mix-blend-screen blur-[150px]"
          style={{ background: accentColor }}
        ></div>
        {renderThematicDecorators()}
      </div>
    );
  };

  const renderLegibilityGradient = () => {
    // ENHANCED gradients that GUARANTEE text readability on any background
    if (themeMode === 'LIGHT') {
      // Light mode - subtle but effective gradient
      return (
        <div className="absolute top-0 left-0 right-0 h-[1000px] bg-gradient-to-b from-white/80 via-white/40 to-transparent z-10 pointer-events-none"></div>
      );
    }

    if (layout === 'magazine_cover') {
      return <div className="absolute top-0 left-0 right-0 h-[1200px] bg-gradient-to-b from-black/90 via-black/60 to-transparent z-0 pointer-events-none"></div>;
    }

    const isBottomText = layout === 'zoom_bottom';
    if (isBottomText) {
      return <div className="absolute bottom-0 left-0 right-0 h-[1400px] bg-gradient-to-t from-black/90 via-black/60 to-transparent z-10 pointer-events-none"></div>;
    }

    // Default - STRONGER gradient for guaranteed text legibility on AI backgrounds
    return (
      <>
        <div className="absolute top-0 left-0 right-0 h-[1400px] bg-gradient-to-b from-black/80 via-black/50 to-transparent z-10 pointer-events-none"></div>
      </>
    );
  };

  const getFontFamily = () => {
    switch (fontStyle) {
      case 'GEOMETRIC_SANS': return '"Poppins", "Montserrat", sans-serif';
      case 'CLASSIC_SERIF': return '"Merriweather", Georgia, serif';
      case 'EDITORIAL_SERIF': return '"Playfair Display", Georgia, serif';
      case 'BOLD_IMPACT': return '"Oswald", "Poppins", sans-serif';
      case 'MINIMAL_TECH': return '"DM Sans", "Inter", sans-serif';
      default: return '"Inter", "DM Sans", sans-serif';
    }
  };

  const renderTypography = () => {
    const isMagazine = layout === 'magazine_cover';
    const isBento = layout === 'bento_grid';
    
    // Determine text alignment based on layout
    // Device on right = text on left, device on left = text on right
    const isRightDevice = ['panoramic_right', 'panoramic_center_right', 'offset_right', 'off_axis_left'].includes(layout);
    const isLeftDevice = ['panoramic_left', 'offset_left'].includes(layout);
    const isMinimalText = layout === 'minimal_type' || layout === 'poster_hero';
    
    let textAlign: 'left' | 'center' | 'right' = 'center';
    let maxTextWidth = '100%';
    let textPadding = '0 80px';
    
    if (isRightDevice) {
      textAlign = 'left';
      maxTextWidth = '65%';
      textPadding = '0 80px 0 100px';
    } else if (isLeftDevice) {
      textAlign = 'right';
      maxTextWidth = '65%';
      textPadding = '0 100px 0 80px';
    } else if (isBento) {
      textAlign = 'left';
      maxTextWidth = '55%';
    } else if (isMinimalText) {
      textAlign = 'center';
      maxTextWidth = '90%';
    }

    const Wrapper = isBento ? 'div' : React.Fragment;
    const wrapperProps = isBento ? {
      className: `p-12 rounded-[40px] border backdrop-blur-xl ${themeMode === 'LIGHT' ? 'bg-white/60 border-white/40 shadow-xl' : 'bg-black/40 border-white/10 shadow-2xl'}`
    } : {};

    // Premium App Store font sizing - LARGE and BOLD
    const getSmartFontSize = (text: string, isTitle: boolean) => {
      if (isMagazine && isTitle) return '240px'; // Bolder
      if (isMinimalText && isTitle) return '200px'; // Extra large for minimal text layouts
      const len = text.length;
      if (isTitle) {
        // MUCH larger titles for premium look - Apple App Store style
        // Tuned for "Amazing Quality"
        if (len < 6) return '180px';  // "Go."
        if (len < 10) return '150px'; // "Crave."
        if (len < 16) return '130px'; // "Transform."
        if (len < 25) return '110px';
        if (len < 35) return '90px';
        return '80px';
      }
      return '52px'; // Even bigger subtitles
    };

    const getSmartTextPosition = () => {
      // Position text higher for more visual impact
      if (layout === 'zoom_bottom') return '120px';
      if (layout === 'magazine_cover') return '100px';
      if (isMinimalText) return '300px'; // Lower for minimal text layouts since device is tiny/absent
      return '140px';
    };

    const fontSize = customFontSize ? `${customFontSize}px` : getSmartFontSize(title || '', true);
    const subFontSize = (title || '').length > 30 ? '36px' : '44px';

    // Determine if we should use italic for stylistic effect (like "Crave. Discover.")
    const useItalic = fontStyle === 'EDITORIAL_SERIF' || fontStyle === 'CLASSIC_SERIF';
    
    // ULTRA-PREMIUM text shadows for maximum readability and impact
    // These shadows ensure text is ALWAYS readable regardless of background
    const titleShadow = themeMode === 'LIGHT'
      ? '0 10px 30px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1)' // Softer, deeper shadow for light mode
      : '0 10px 40px rgba(0,0,0,0.9), 0 4px 12px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)'; // Dramatic depth for dark mode

    const subtitleShadow = themeMode === 'LIGHT'
      ? '0 2px 4px rgba(0,0,0,0.1)'
      : '0 4px 12px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)';

    const content = (
        // @ts-ignore
        <Wrapper {...wrapperProps}>
          <h2 style={{
            fontFamily: getFontFamily(),
            fontSize: fontSize,
            fontWeight: 900,
            fontStyle: useItalic ? 'italic' : 'normal',
            lineHeight: 0.95,
            letterSpacing: fontStyle === 'BOLD_IMPACT' ? '-0.04em' : '-0.025em',
            color: customTextColor || textColor,
            textTransform: (fontStyle === 'BOLD_IMPACT' || fontStyle === 'MINIMAL_TECH') ? 'uppercase' : 'none',
            textShadow: titleShadow,
            marginBottom: '24px',
            position: 'relative',
            maxWidth: maxTextWidth,
            wordWrap: 'break-word',
            pointerEvents: 'none',
            textAlign: textAlign
          }}>
            {/* Clean title rendering - no tacky keyword highlighting */}
            {(title || '').split(' ').slice(0, 5).join(' ')}
          </h2>
          {subtitle && (
            <p style={{
              fontFamily: getFontFamily(),
              fontSize: subFontSize,
              fontWeight: 500,
              color: subTextColor,
              maxWidth: isBento ? '100%' : maxTextWidth,
              lineHeight: 1.35,
              textShadow: subtitleShadow,
              pointerEvents: 'none',
              letterSpacing: '-0.01em',
              textAlign: textAlign
            }}>
              {(subtitle || '').split(' ').slice(0, 10).join(' ')}
            </p>
          )}
        </Wrapper>
    );

    // Determine justify content based on text alignment
    const justifyContent = textAlign === 'left' ? 'flex-start' : textAlign === 'right' ? 'flex-end' : 'center';

    return (
        <Draggable id="draggable-text" initialOffset={textOffset} style={{
            position: 'absolute',
            top: getSmartTextPosition(),
            left: 0,
            width: '100%',
            display: 'flex',
            justifyContent: justifyContent,
            zIndex: isMagazine ? 10 : 30,
            textAlign: textAlign,
            alignItems: textAlign === 'left' ? 'flex-start' : textAlign === 'right' ? 'flex-end' : 'center',
        }}>
            <div style={{ 
              width: '100%', 
              padding: textPadding, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: justifyContent
            }}>
                {content}
            </div>
        </Draggable>
    );
  };

  // --- WIDGETS RENDERER (PROFESSIONAL SOCIAL PROOF BADGES) ---
  const renderWidgets = () => {
    if (!widgets || widgets.length === 0) return null;

    // Determine widget position based on layout
    const isRightDevice = ['panoramic_right', 'panoramic_center_right', 'offset_right', 'off_axis_left'].includes(layout);
    const isLeftDevice = ['panoramic_left', 'offset_left'].includes(layout);
    const isMinimalText = layout === 'minimal_type' || layout === 'poster_hero';
    
    let justifyContent = 'center';
    let widgetPadding = '0';
    let widgetTop = '420px';
    
    if (isRightDevice) {
      justifyContent = 'flex-start';
      widgetPadding = '0 0 0 100px';
    } else if (isLeftDevice) {
      justifyContent = 'flex-end';
      widgetPadding = '0 100px 0 0';
    } else if (isMinimalText) {
      widgetTop = '650px'; // Below the larger text area
    }

    return (
      <div 
        className="absolute left-0 right-0 flex gap-6 z-40 pointer-events-none"
        style={{ 
          top: widgetTop,
          justifyContent: justifyContent,
          padding: widgetPadding 
        }}
      >
        {widgets.map((widget, i) => {
          let Icon = Star;
          let iconColor = colorPalette.accent[0];
          let showStars = false;
          
          if (widget.type === 'security') {
            Icon = Shield;
            iconColor = '#10B981'; // Green for security
          }
          if (widget.type === 'download') {
            Icon = Download;
            iconColor = colorPalette.primary[0];
          }
          if (widget.type === 'award') {
            Icon = Award;
            iconColor = '#F59E0B'; // Gold for awards
          }
          if (widget.type === 'rating') {
            showStars = true;
            iconColor = '#FBBF24'; // Yellow for stars
          }
          if (widget.type === 'speed') {
            Icon = Zap;
            iconColor = '#8B5CF6'; // Purple for speed
          }

          // Professional pill badge style
          const badgeStyle = themeMode === 'LIGHT' 
            ? 'bg-white/90 text-gray-900 shadow-[0_8px_16px_-4px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,1)_inset] border border-gray-100'
            : 'bg-gray-900/80 text-white shadow-[0_8px_16px_-4px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.1)_inset] border border-white/10';

          return (
            <div 
              key={i} 
              className={`flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-xl ${badgeStyle}`}
              style={{ 
                boxShadow: themeMode === 'LIGHT' 
                  ? '0 10px 30px -10px rgba(0,0,0,0.15)' 
                  : '0 10px 40px -10px rgba(0,0,0,0.5)'
              }}
            >
              {showStars ? (
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className="w-5 h-5" style={{ color: iconColor, fill: iconColor }} />
                  ))}
                </div>
              ) : (
                <div className="p-1.5 rounded-full" style={{ backgroundColor: `${iconColor}20` }}>
                  <Icon className="w-5 h-5" style={{ color: iconColor }} />
                </div>
              )}
              <span className="text-base font-bold tracking-tight">{widget.text}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderContent = () => {
    const transition = "all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)";
    const baseSize = { width: '1080px', height: '2340px' };

    let style: React.CSSProperties = { ...baseSize, position: 'absolute', transition, zIndex: 20, left: '50%', transformOrigin: 'center center' };

    // Ultra-premium device shadows - Apple keynote quality
    const deepShadow = '0 50px 100px -20px rgba(0,0,0,0.5), 0 30px 60px -20px rgba(0,0,0,0.4), 0 15px 30px -10px rgba(0,0,0,0.3), 0 -2px 6px 0 rgba(255,255,255,0.15) inset';
    const floatingShadow = '0 80px 150px -30px rgba(0,0,0,0.4), 0 50px 100px -30px rgba(50,50,93,0.3), 0 30px 60px -30px rgba(0,0,0,0.25), 0 -2px 6px 0 rgba(255,255,255,0.2) inset';
    const groundedShadow = '0 20px 50px -15px rgba(0,0,0,0.4), 0 10px 30px -10px rgba(0,0,0,0.3), 0 -1px 4px 0 rgba(255,255,255,0.2) inset';

    const applyOffset = (transform: string) => transform;

    // Use PREMIUM_GLASS as default style if none specified or generic
    const effectiveFrameStyle = frameStyle === FrameStyle.FRAMELESS && layout !== 'minimal_type' ? FrameStyle.PREMIUM_GLASS : frameStyle;

    let contentNode: React.ReactNode = <DeviceFrame imageSrc={screenshotUrl || ''} style={effectiveFrameStyle} deviceColor={deviceColor} />;

    switch (layout) {
      case 'zoom_top':
        style = { ...style, bottom: '-1300px', transform: applyOffset('translateX(-50%) scale(1.2)'), boxShadow: groundedShadow };
        break;
      case 'zoom_bottom':
        style = { ...style, top: '-1100px', transform: applyOffset('translateX(-50%) scale(1.2)'), boxShadow: groundedShadow };
        break;
      case 'tilted_dynamic':
        style = { ...style, top: '950px', transform: applyOffset('translateX(-50%) perspective(2000px) rotateY(-15deg) rotateX(5deg) rotateZ(-2deg) scale(0.95)'), boxShadow: floatingShadow };
        break;
      case 'isometric_stack':
        return (
          <Draggable id="draggable-device" initialOffset={deviceOffset} style={{ position: 'absolute', inset: 0, zIndex: 20 }}>
            <div className="absolute inset-0 pointer-events-none">
                <div style={{ ...baseSize, position: 'absolute', top: '850px', left: '50%', transform: 'translateX(-65%) perspective(3000px) rotateX(20deg) rotateY(15deg) rotateZ(-10deg) scale(0.85)', opacity: 0.4, filter: 'blur(12px)', zIndex: 18, boxShadow: floatingShadow }}>
                <DeviceFrame imageSrc={secondaryScreenshotUrl || screenshotUrl || ''} style={effectiveFrameStyle} deviceColor={deviceColor} />
                </div>
                <div style={{ ...baseSize, position: 'absolute', top: '900px', left: '50%', transform: 'translateX(-58%) perspective(3000px) rotateX(20deg) rotateY(15deg) rotateZ(-10deg) scale(0.9)', opacity: 0.7, filter: 'blur(6px)', zIndex: 19, boxShadow: floatingShadow }}>
                <DeviceFrame imageSrc={screenshotUrl || ''} style={effectiveFrameStyle} deviceColor={deviceColor} />
                </div>
                <div style={{ ...baseSize, position: 'absolute', top: '950px', left: '50%', transform: 'translateX(-50%) perspective(3000px) rotateX(20deg) rotateY(15deg) rotateZ(-10deg) scale(0.95)', zIndex: 20, boxShadow: floatingShadow }}>
                <DeviceFrame imageSrc={screenshotUrl || ''} style={effectiveFrameStyle} deviceColor={deviceColor} />
                </div>
            </div>
          </Draggable>
        );
      case 'off_axis_left':
        style = { ...style, top: '900px', left: '50%', transform: applyOffset('translateX(-25%) rotate(-8deg) scale(0.95)'), boxShadow: deepShadow };
        break;
      case 'magazine_cover':
        style = { ...style, bottom: '-500px', transform: applyOffset('translateX(-50%) scale(1.05)'), boxShadow: deepShadow };
        break;
      case 'double_phones':
         return (
             <Draggable id="draggable-device" initialOffset={deviceOffset} style={{ position: 'absolute', inset: 0, zIndex: 20 }}>
                <div className="absolute inset-0 z-20">
                    <div style={{ ...baseSize, position: 'absolute', top: '1000px', left: '50%', transform: 'translateX(-90%) rotate(-8deg) scale(0.9)', transition, boxShadow: deepShadow }}>
                    <DeviceFrame imageSrc={screenshotUrl || ''} style={effectiveFrameStyle} deviceColor={deviceColor} />
                    </div>
                    <div style={{ ...baseSize, position: 'absolute', top: '1200px', left: '50%', transform: 'translateX(-10%) rotate(8deg) scale(0.95)', transition, zIndex: 21, boxShadow: floatingShadow }}>
                    <DeviceFrame imageSrc={secondaryScreenshotUrl || screenshotUrl || ''} style={effectiveFrameStyle} deviceColor={deviceColor} />
                    </div>
                </div>
            </Draggable>
        );
      case 'bento_grid':
        style = { ...style, top: '800px', right: '-450px', left: 'auto', transform: applyOffset('perspective(2000px) rotateY(-15deg) scale(0.85)'), boxShadow: floatingShadow };
        break;
      
      // === NEW PANORAMIC LAYOUTS (Device spans between frames) ===
      // These create the professional "continuous" look where a device appears 
      // partially on one slide and continues onto the next
      
      case 'panoramic_right':
        // Device positioned at right edge - spans into next frame (like in food app examples)
        style = { 
          ...style, 
          top: '750px', 
          right: '-380px', 
          left: 'auto',
          transform: applyOffset('rotate(-3deg) scale(1.0)'), 
          boxShadow: deepShadow 
        };
        break;
        
      case 'panoramic_left':
        // Device positioned at left edge - continues from previous frame
        style = { 
          ...style, 
          top: '750px', 
          left: '-380px',
          transform: applyOffset('rotate(3deg) scale(1.0)'), 
          boxShadow: deepShadow 
        };
        break;
        
      case 'panoramic_center_right':
        // Device splits between frames - 50% on each side
        style = { 
          ...style, 
          top: '700px', 
          right: '-540px', 
          left: 'auto',
          transform: applyOffset('scale(1.05)'), 
          boxShadow: floatingShadow 
        };
        break;
        
      case 'offset_right':
        // Device offset to right with rotation (like modern app examples)
        style = { 
          ...style, 
          top: '850px', 
          left: '55%',
          transform: applyOffset('translateX(-30%) rotate(-5deg) scale(0.95)'), 
          boxShadow: deepShadow 
        };
        break;
        
      case 'offset_left':
        // Device offset to left with rotation
        style = { 
          ...style, 
          top: '850px', 
          left: '45%',
          transform: applyOffset('translateX(-70%) rotate(5deg) scale(0.95)'), 
          boxShadow: deepShadow 
        };
        break;
        
      case 'hero_large':
        // Large centered device - great for first screenshot (high impact)
        style = { 
          ...style, 
          top: '750px', 
          transform: applyOffset('translateX(-50%) scale(1.05)'), 
          boxShadow: floatingShadow 
        };
        break;
        
      case 'minimal_type':
        // Small device below large text - emphasis on messaging
        style = { 
          ...style, 
          top: '1400px', 
          transform: applyOffset('translateX(-50%) scale(0.75)'), 
          boxShadow: groundedShadow 
        };
        break;
        
      case 'poster_hero':
        // No device - pure text/graphic layout
        return null;
        
      // === DUO DEVICE LAYOUTS ===
      case 'duo_overlap':
        // Two overlapping devices at different angles
        return (
          <Draggable id="draggable-device" initialOffset={deviceOffset} style={{ position: 'absolute', inset: 0, zIndex: 20 }}>
            <div className="absolute inset-0 z-20">
                <div style={{ ...baseSize, position: 'absolute', top: '950px', left: '50%', transform: 'translateX(-85%) rotate(-10deg) scale(0.85)', transition, boxShadow: deepShadow, zIndex: 19 }}>
                  <DeviceFrame imageSrc={screenshotUrl || ''} style={effectiveFrameStyle} deviceColor={deviceColor} />
                </div>
                <div style={{ ...baseSize, position: 'absolute', top: '1050px', left: '50%', transform: 'translateX(-15%) rotate(8deg) scale(0.9)', transition, zIndex: 20, boxShadow: floatingShadow }}>
                  <DeviceFrame imageSrc={secondaryScreenshotUrl || screenshotUrl || ''} style={effectiveFrameStyle} deviceColor={deviceColor} />
                </div>
            </div>
          </Draggable>
        );
        
      case 'duo_side_by_side':
        // Two devices side by side
        return (
          <Draggable id="draggable-device" initialOffset={deviceOffset} style={{ position: 'absolute', inset: 0, zIndex: 20 }}>
            <div className="absolute inset-0 z-20">
                <div style={{ ...baseSize, position: 'absolute', top: '900px', left: '50%', transform: 'translateX(-105%) scale(0.8)', transition, boxShadow: deepShadow }}>
                  <DeviceFrame imageSrc={screenshotUrl || ''} style={effectiveFrameStyle} deviceColor={deviceColor} />
                </div>
                <div style={{ ...baseSize, position: 'absolute', top: '900px', left: '50%', transform: 'translateX(5%) scale(0.8)', transition, zIndex: 21, boxShadow: deepShadow }}>
                  <DeviceFrame imageSrc={secondaryScreenshotUrl || screenshotUrl || ''} style={effectiveFrameStyle} deviceColor={deviceColor} />
                </div>
            </div>
          </Draggable>
        );
        
      default:
        style = { ...style, top: '1000px', transform: applyOffset('translateX(-50%) scale(0.95)'), boxShadow: deepShadow };
    }

    return (
        <Draggable id="draggable-device" initialOffset={deviceOffset} style={style}>
            <div style={{ width: '100%', height: '100%' }}>
                <DeviceFrame imageSrc={screenshotUrl || ''} style={effectiveFrameStyle} deviceColor={deviceColor} />
            </div>
        </Draggable>
    );
  };

  const renderFloatingElements = () => {
    if (!floatingElements) return null;
    return floatingElements.map((el, i) => {
      const safeYStart = 1200;
      const defaultX = i % 2 === 0 ? 120 : CANVAS_WIDTH - 120 - 350;

      let finalX = el.position?.x ?? defaultX;
      let finalY = el.position?.y ?? (safeYStart + (i * 400));

      if (layout === 'poster_hero') {
        // Center the element if it's a poster hero
        finalX = CANVAS_WIDTH / 2 - 200; // Centered roughly
        finalY = 1000;
      } else if (finalY < 1200 && layout !== 'bento_grid') {
        finalY = 1300 + (i * 400);
      }
      if (layout === 'bento_grid') {
        const col = i % 2;
        const row = Math.floor(i / 2);
        finalX = 80 + (col * 480);
        finalY = 1100 + (row * 350);
      }

      // Handle Image Type - Only render if actual imageUrl is provided (not placeholders)
      if (el.type === 'image') {
         // Only render if we have a real, high-quality image URL
         // Skip placeholder/flaticon images as they look cheap
         if (!el.imageUrl || el.imageUrl.includes('flaticon') || el.imageUrl.includes('placehold')) {
             return null; // Don't render cheap placeholder images
         }

         return (
             <div key={i} style={{
                 position: 'absolute',
                 top: `${finalY}px`,
                 left: `${finalX}px`,
                 transform: `rotate(${el.position?.rotate || 0}deg) scale(${el.position?.scale || 1})`,
                 zIndex: 40,
                 pointerEvents: 'none'
             }}>
                 <img
                   src={el.imageUrl}
                   alt="Floating Element"
                   className="w-[600px] h-[600px] object-contain drop-shadow-2xl filter contrast-125"
                   style={{
                     imageRendering: 'auto',
                     WebkitBackfaceVisibility: 'hidden',
                     backfaceVisibility: 'hidden',
                   }}
                   loading="eager"
                   decoding="sync"
                 />
             </div>
         );
      }

      const style: React.CSSProperties = {
        position: 'absolute',
        top: `${finalY}px`,
        left: `${finalX}px`,
        transform: `rotate(${el.position?.rotate || (i % 2 === 0 ? -5 : 5)}deg) scale(${el.position?.scale || 1})`,
        zIndex: 40,
        transformOrigin: 'center'
      };

      const IconComponent = () => {
         switch (el.icon) {
            case 'bell': return <Bell className="w-14 h-14" />;
            case 'card': return <CreditCard className="w-14 h-14" />;
            case 'activity': return <Activity className="w-14 h-14" />;
            case 'shield': return <Shield className="w-14 h-14" />;
            case 'star': return <Star className="w-14 h-14" />;
            case 'heart': return <Heart className="w-14 h-14" />;
            case 'zap': return <Zap className="w-14 h-14" />;
            case 'award': return <Award className="w-14 h-14" />;
            case 'review': return <Star className="w-14 h-14 text-yellow-400 fill-yellow-400" />;
            default: return <Check className="w-14 h-14" />;
         }
      };

      return (
        <div key={i} style={style} className={`
          flex items-center gap-6 px-10 py-8 rounded-[48px] 
          ${themeMode === 'LIGHT' 
            ? 'bg-gradient-to-br from-white/80 to-white/40 border border-white/60 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.5)_inset]' 
            : 'bg-gradient-to-br from-white/10 to-black/40 border border-white/15 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)_inset]'}
          backdrop-blur-2xl backdrop-saturate-150
          ${layout === 'bento_grid' ? 'w-[440px] h-[300px] justify-center flex-col text-center' : ''} 
        `}>
           {el.type === 'review' ? (
                <div className="flex flex-col items-center gap-2">
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-8 h-8 text-yellow-400 fill-yellow-400" />)}
                </div>
                <div className="text-2xl font-bold mt-2">"{el.text}"</div>
                </div>
           ) : (
                <>
                <div className={`p-5 rounded-full ${themeMode === 'LIGHT' ? 'bg-black text-white' : 'bg-white/20 text-white'}`}>
                    <IconComponent />
                </div>
                <div>
                    {el.text && <div className="text-5xl font-black leading-tight tracking-tight">{el.text}</div>}
                    {el.subtext && <div className={`text-3xl font-semibold mt-1 ${themeMode === 'LIGHT' ? 'text-gray-500' : 'text-white/70'}`}>{el.subtext}</div>}
                </div>
                </>
           )}
        </div>
      );
    });
  };

  return (
    <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement]}
    >
        <div
            className="relative overflow-hidden shadow-2xl block transition-colors duration-700"
            style={{
                width: `${CANVAS_WIDTH}px`,
                height: `${CANVAS_HEIGHT}px`,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                // High-quality rendering settings
                imageRendering: 'auto',
                WebkitFontSmoothing: 'antialiased',
                backfaceVisibility: 'hidden',
                willChange: 'transform',
            }}
        >

        {/* Render Background Layer */}
        {renderBackground()}

        {onRegenerateBackground && (
            <button
            onClick={(e) => { e.stopPropagation(); onRegenerateBackground(); }}
            className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/80 hover:scale-110 transition-all z-50 opacity-0 group-hover:opacity-100"
            >
            <RefreshCw className="w-4 h-4" />
            </button>
        )}

        {availableBackgrounds && availableBackgrounds.length > 0 && onChooseBackground && (
            <div className="absolute bottom-4 left-4 right-4 z-50 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center pointer-events-none">
            <div className="bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 p-2 flex gap-2 shadow-2xl pointer-events-auto max-w-full overflow-x-auto">
                {availableBackgrounds.map((bg, i) => (
                <button
                    key={i}
                    className={`w-16 h-24 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${backgroundUrl === bg ? 'border-primary ring-2 ring-primary/30 shadow-[0_0_10px_rgba(0,209,255,0.3)]' : 'border-transparent hover:border-white/50'}`}
                    onClick={(e) => { e.stopPropagation(); onChooseBackground(bg); }}
                >
                    <img src={bg} className="w-full h-full object-cover" />
                </button>
                ))}
            </div>
            </div>
        )}

        {renderAtmosphere()}
        {renderLegibilityGradient()}

        {renderTypography()}
        {renderWidgets()}

        {screenshotUrl ? renderContent() : (
            <div className="absolute inset-0 flex items-center justify-center z-20">
            <Loader2 className="w-32 h-32 text-primary/20 animate-spin" />
            </div>
        )}

        {renderFloatingElements()}
        </div>
    </DndContext>
  );
};

export default CanvasPreview;
