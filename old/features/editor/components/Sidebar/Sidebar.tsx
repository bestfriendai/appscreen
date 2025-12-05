import React, { useState } from 'react';
import { Wand2, AlertTriangle, Check, Palette, Sparkles, Sliders, Sun, Moon, ImageIcon, Loader2, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import Button from '../../../../components/Button';
import { useStore } from '../../../../store/useStore';
import { fileToDataUrl } from '../../../../utils/fileUtils';
import { validateAppName, validateDescription } from '../../../../utils/validation';
import { FrameStyle, DesignTheme, DeviceColor } from '../../../../types';

interface SidebarProps {
  onGenerate: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onGenerate }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const {
    appName, setAppName,
    description, setDescription,
    forcedCategory, setForcedCategory,
    toneOfVoice, setToneOfVoice,
    screenshots, addScreenshots, removeScreenshot,
    generatedBackgrounds, selectedBackground, setSelectedBackground, setGeneratedBackgrounds,
    customColor, setCustomColor,
    isGenerating, statusMessage,
    showManualControls, setShowManualControls,
    themeMode, setThemeMode,
    frameStyle, setFrameStyle,
    designTheme, setDesignTheme,
    accentColor, setAccentColor,
    isPanoramic, setIsPanoramic,
    setThemeMode: _setThemeMode,
    setDeviceColor,
  } = useStore();

  return (
    <aside
        className={`flex-shrink-0 border-r border-white/5 bg-surface/90 backdrop-blur-xl flex flex-col z-20 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-[380px]'}`}
    >
      {/* Collapse Toggle */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
         {!isCollapsed && (
             <div className="flex items-center gap-3 select-none">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-[0_0_15px_rgba(0,209,255,0.3)]">
                <Wand2 className="w-4 h-4 text-black" />
                </div>
                <span className="font-bold text-white tracking-tight font-display">ScreenGenius</span>
            </div>
         )}
         <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 text-gray-500 hover:text-primary rounded-lg hover:bg-white/5 transition-colors"
         >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
         </button>
      </div>

      <div className={`overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent ${isCollapsed ? 'px-2 py-4' : 'p-6'}`}>
          {isCollapsed ? (
              <div className="flex flex-col items-center gap-4">
                  {/* Icons only view */}
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-primary transition-colors" title="Inputs">
                      <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-primary transition-colors" title="Screenshots">
                      <ImageIcon className="w-5 h-5" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-primary transition-colors" title="Controls">
                      <Sliders className="w-5 h-5" />
                  </div>
              </div>
          ) : (
            <div className="space-y-8">
                <Inputs />

                <ScreenshotUploader />

                <BackgroundSelector />

                <Button
                    onClick={onGenerate}
                    disabled={isGenerating || screenshots.length === 0}
                    className="w-full py-4 text-sm font-bold bg-primary text-black hover:bg-primary/80 transition-all rounded-xl shadow-[0_0_20px_rgba(0,209,255,0.3)] hover:shadow-[0_0_30px_rgba(0,209,255,0.5)] border border-primary/20"
                    data-tour="generate-button"
                >
                    {isGenerating ? (
                    <span className="flex items-center justify-center gap-3">
                        <Loader2 className="animate-spin w-4 h-4" /> {statusMessage}
                    </span>
                    ) : (
                    <span className="flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4" /> INITIATE GENERATION
                    </span>
                    )}
                </Button>

                <ManualControls />
            </div>
          )}
      </div>
    </aside>
  );
};

// ... Rest of the file (Inputs, ScreenshotUploader, etc) remains same as previous patch ...
// I need to include them to overwrite correctly.

// Sub-components for cleaner file
const Inputs = () => {
  const { appName, setAppName, description, setDescription, forcedCategory, setForcedCategory, toneOfVoice, setToneOfVoice } = useStore();
  const appNameError = validateAppName(appName);
  const descriptionError = validateDescription(description);

  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          value={appName}
          onChange={(e) => setAppName(e.target.value)}
          placeholder="App Name (e.g. 'FitBod')"
          className={`w-full bg-black/40 border rounded-xl px-4 py-3 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-600 font-medium text-white ${appNameError ? 'border-red-500' : 'border-white/10'}`}
        />
        {appNameError && (
          <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> {appNameError.message}
          </p>
        )}
      </div>
      <div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe features & category..."
          className={`w-full bg-black/40 border rounded-xl px-4 py-3 text-sm h-24 resize-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-600 text-white ${descriptionError ? 'border-red-500' : 'border-white/10'}`}
        />
        {descriptionError && (
          <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> {descriptionError.message}
          </p>
        )}
      </div>

       {/* Manual Category Selector */}
       <div>
          <label className="text-[9px] font-bold text-primary/70 uppercase tracking-widest mb-2 block">Force Category (Optional)</label>
          <select
            value={forcedCategory}
            onChange={(e) => setForcedCategory(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-primary/50 outline-none"
          >
            <option value="">Auto-Detect (AI)</option>
            <option value="finance">Finance / Crypto</option>
            <option value="fitness">Health & Fitness</option>
            <option value="social">Social / Dating</option>
            <option value="productivity">Productivity / Utilities</option>
            <option value="shopping">Shopping / E-commerce</option>
            <option value="entertainment">Entertainment / Streaming</option>
            <option value="kids">Education / Kids</option>
            <option value="travel">Travel / Maps</option>
            <option value="food">Food / Drink</option>
          </select>
        </div>

        {/* Tone of Voice */}
        <div>
          <label className="text-[9px] font-bold text-primary/70 uppercase tracking-widest mb-2 block">Tone of Voice</label>
          <select
            value={toneOfVoice}
            onChange={(e) => setToneOfVoice(e.target.value as any)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-primary/50 outline-none"
          >
            <option value="PROFESSIONAL">Professional</option>
            <option value="PLAYFUL">Playful</option>
            <option value="URGENT">Urgent</option>
            <option value="MINIMAL">Minimal</option>
          </select>
        </div>
    </div>
  );
};

const ScreenshotUploader = () => {
    const { screenshots, addScreenshots, removeScreenshot } = useStore();

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
          const newScreenshots = [];
          for (let i = 0; i < e.target.files.length; i++) {
            const file = e.target.files[i];
            const rawUrl = await fileToDataUrl(file);
            newScreenshots.push({
              id: Math.random().toString(36).substr(2, 9),
              url: rawUrl,
              file
            });
          }
          addScreenshots(newScreenshots);
          e.target.value = '';
        }
    };

    return (
        <div className="space-y-3" data-tour="screenshot-uploader">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Source Screenshots</label>
              <span className="text-[10px] text-gray-600">{screenshots.length} uploaded</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {screenshots.map((s) => (
                <div key={s.id} className="relative group h-24 transition-transform hover:-translate-y-1">
                  <img
                    src={s.url}
                    className="w-full h-full object-cover rounded-lg border border-white/10"
                    alt="screen"
                    loading="eager"
                    decoding="sync"
                    style={{
                      imageRendering: 'auto',
                      WebkitBackfaceVisibility: 'hidden',
                      backfaceVisibility: 'hidden',
                    }}
                  />
                  <button onClick={() => removeScreenshot(s.id)} className="absolute top-1 right-1 p-1 bg-red-500/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                </div>
              ))}
              <label className="h-24 rounded-lg border border-dashed border-white/10 hover:border-primary hover:bg-primary/5 cursor-pointer flex flex-col items-center justify-center text-gray-600 hover:text-primary transition-all group gap-2">
                <span className="w-4 h-4 group-hover:scale-110 transition-transform"><Plus className="w-4 h-4" /></span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          </div>
    );
}

const BackgroundSelector = () => {
    const {
        selectedBackground, setSelectedBackground,
        customColor, setCustomColor,
        themeMode, setThemeMode,
        setDeviceColor,
        generatedBackgrounds,
        setSlidesV1, setSlidesV2, setSlidesV3, slidesV1, slidesV2, slidesV3,
        setIsPanoramic
    } = useStore();

    const applyGlobalBackground = (bg: string) => {
        setSelectedBackground(bg);
        const updateBg = (slides: any[]) => slides.map(s => ({ ...s, backgroundUrl: bg }));
        setSlidesV1(updateBg(slidesV1));
        setSlidesV2(updateBg(slidesV2));
        setSlidesV3(updateBg(slidesV3));
        setIsPanoramic(false);
    };

    const handleBackgroundImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const url = await fileToDataUrl(file);
          applyGlobalBackground(url);
          e.target.value = '';
        }
    };

    return (
        <>
        <div className="space-y-3 pt-2 animate-in fade-in" data-tour="background-selector">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Background</label>
            </div>

            {/* Black, White, Custom Color */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  applyGlobalBackground('#FFFFFF');
                  setThemeMode('LIGHT');
                  setDeviceColor(DeviceColor.OFF_WHITE);
                }}
                className={`relative h-16 rounded-lg border-2 transition-all ${selectedBackground === '#FFFFFF' ? 'border-primary ring-2 ring-primary/30' : 'border-white/10 opacity-80 hover:opacity-100'}`}
                style={{ backgroundColor: '#FFFFFF' }}
              >
                {selectedBackground === '#FFFFFF' && <div className="absolute inset-0 flex items-center justify-center"><Check className="w-5 h-5 text-black" /></div>}
                <span className="absolute bottom-2 left-2 text-[10px] font-bold uppercase text-black/60">White</span>
              </button>

              <button
                onClick={() => {
                  applyGlobalBackground('#000000');
                  setThemeMode('DARK');
                  setDeviceColor(DeviceColor.MIDNIGHT);
                }}
                className={`relative h-16 rounded-lg border-2 transition-all ${selectedBackground === '#000000' ? 'border-primary ring-2 ring-primary/30' : 'border-white/10 opacity-80 hover:opacity-100'}`}
                style={{ backgroundColor: '#000000' }}
              >
                {selectedBackground === '#000000' && <div className="absolute inset-0 flex items-center justify-center"><Check className="w-5 h-5 text-white" /></div>}
                <span className="absolute bottom-2 left-2 text-[10px] font-bold uppercase text-white/60">Black</span>
              </button>

              <div className="relative">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={() => applyGlobalBackground(customColor)}
                  className={`relative w-full h-16 rounded-lg border-2 transition-all ${selectedBackground === customColor ? 'border-primary ring-2 ring-primary/30' : 'border-white/10 opacity-80 hover:opacity-100'}`}
                  style={{ backgroundColor: customColor }}
                >
                  {selectedBackground === customColor && <div className="absolute inset-0 flex items-center justify-center"><Check className="w-5 h-5 text-white drop-shadow-lg" /></div>}
                  <Palette className="absolute top-2 right-2 w-4 h-4 text-white/80 drop-shadow" />
                  <span className="absolute bottom-2 left-2 text-[10px] font-bold uppercase text-white/80 drop-shadow">Custom</span>
                </button>
              </div>
            </div>
        </div>

         {/* AI Generated Backgrounds */}
         {generatedBackgrounds.length > 0 && (
            <div className="space-y-3 pt-2 animate-in fade-in">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-3 h-3" /> AI Backgrounds
                </label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {generatedBackgrounds.map((bg, i) => (
                  <button
                    key={i}
                    onClick={() => applyGlobalBackground(bg)}
                    className={`relative aspect-[9/16] rounded-lg overflow-hidden border-2 transition-all group ${selectedBackground === bg ? 'border-primary ring-2 ring-primary/30' : 'border-white/10 opacity-60 hover:opacity-100'}`}
                  >
                    <img src={bg} alt={`AI Background ${i + 1}`} className="w-full h-full object-cover" />
                    {selectedBackground === bg && <div className="absolute inset-0 bg-primary/10 flex items-center justify-center"><Check className="w-4 h-4 text-white drop-shadow-md" /></div>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Optional: Upload Custom Image */}
          <div className="space-y-3 pt-2 animate-in fade-in">
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-gray-400 uppercase">Upload Image</label>
              <label className="block w-full py-2 px-3 rounded-lg bg-white/10 border border-white/10 hover:bg-white/20 transition-colors text-xs font-bold text-white text-center cursor-pointer">
                <ImageIcon className="w-4 h-4 inline mr-2" />
                Upload Background
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </>
    );
};

const ManualControls = () => {
    const {
        showManualControls, setShowManualControls,
        themeMode, setThemeMode,
        frameStyle, setFrameStyle,
        designTheme, setDesignTheme,
        accentColor, setAccentColor,
        isPanoramic, setIsPanoramic
    } = useStore();

    return (
        <div className="pt-4 border-t border-white/5" data-tour="manual-controls">
            <button
              onClick={() => setShowManualControls(!showManualControls)}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary/70 hover:text-white transition-colors w-full justify-between"
            >
              <span>System Overrides</span>
              <Sliders className="w-3 h-3" />
            </button>

            {showManualControls && (
              <div className="mt-6 space-y-6 animate-in slide-in-from-top-2 border-l-2 border-primary/20 pl-4 ml-1">
                {/* Theme Mode Toggle */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setThemeMode('LIGHT')}
                    className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-[10px] font-bold uppercase ${themeMode === 'LIGHT' ? 'bg-white text-black shadow-glow' : 'bg-black/40 text-gray-400'}`}
                  >
                    <Sun className="w-3 h-3" /> Light
                  </button>
                  <button
                    onClick={() => setThemeMode('DARK')}
                    className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-[10px] font-bold uppercase ${themeMode === 'DARK' ? 'bg-primary text-black shadow-glow' : 'bg-black/40 text-gray-400'}`}
                  >
                    <Moon className="w-3 h-3" /> Dark
                  </button>
                </div>

                {/* Frame Selector */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Frame Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[FrameStyle.FRAMELESS, FrameStyle.MATTE, FrameStyle.GLOW, FrameStyle.TITANIUM].map(style => (
                      <button
                        key={style} onClick={() => setFrameStyle(style)}
                        className={`py-2 rounded-lg text-[9px] font-bold border transition-all ${frameStyle === style ? 'bg-primary text-black border-primary' : 'bg-black/40 text-gray-400 border-white/10'}`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme Selector */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Design Theme</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['CLEAN_PRO', 'MODERN_MINIMAL', 'SWISS_BRUTALISM', 'NEON_CYBER'].map((t) => (
                      <button
                        key={t} onClick={() => setDesignTheme(t as DesignTheme)}
                        className={`py-2 px-3 rounded-lg text-[9px] font-bold border text-left transition-all ${designTheme === t ? 'bg-primary/20 border-primary text-white' : 'bg-black/40 border-white/10 text-gray-400'}`}
                      >
                        {t.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Accent Color Picker */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Accent Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-12 h-10 rounded-lg border border-white/10 cursor-pointer bg-black"
                    />
                    <input
                      type="text"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      placeholder="#00D1FF"
                      className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary/50 outline-none font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {['#00D1FF', '#FF3D00', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'].map(color => (
                      <button
                        key={color}
                        onClick={() => setAccentColor(color)}
                        className={`w-full h-8 rounded-md border-2 transition-all ${accentColor === color ? 'border-white' : 'border-white/10'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Panoramic Toggle */}
                <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] font-bold text-gray-300 uppercase">Panoramic BG</span>
                  <input type="checkbox" checked={isPanoramic} onChange={(e) => setIsPanoramic(e.target.checked)} className="accent-primary" />
                </div>
              </div>
            )}
        </div>
    );
};
