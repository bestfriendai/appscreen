import { useRef, useCallback } from 'react';
import { Image, Trash2 } from 'lucide-react';
import { Button, Slider, ColorPicker } from '../ui';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../ui/Collapsible';
import { useAppStore } from '../../store/useAppStore';
import { GradientEditor } from './GradientEditor';
import { cn, generateGradientCSS } from '../../lib/utils';
import type { BackgroundType } from '../../types';

export function BackgroundPanel() {
  const {
    defaults: { background },
    setBackgroundType,
    setBackgroundColor,
    setBackgroundImage,
    clearBackgroundImage,
    setImageBlur,
    setImageOverlay,
  } = useAppStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        await setBackgroundImage(file);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [setBackgroundImage]
  );

  const backgroundTypes: { type: BackgroundType; label: string }[] = [
    { type: 'solid', label: 'Solid' },
    { type: 'gradient', label: 'Gradient' },
    { type: 'image', label: 'Image' },
  ];

  const gradientCSS = generateGradientCSS(
    background.gradient.type,
    background.gradient.angle,
    background.gradient.stops
  );

  return (
    <div className="p-4 space-y-4">
      {/* Background Type Selector */}
      <div className="space-y-2">
        <label className="text-xs text-text-secondary font-medium">Type</label>
        <div className="grid grid-cols-3 gap-2">
          {backgroundTypes.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => setBackgroundType(type)}
              className={cn(
                'h-9 rounded-lg text-sm font-medium transition-all',
                background.type === type
                  ? 'bg-accent text-white'
                  : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Solid Color */}
      {background.type === 'solid' && (
        <ColorPicker
          label="Color"
          value={background.color}
          onChange={setBackgroundColor}
        />
      )}

      {/* Gradient */}
      {background.type === 'gradient' && (
        <div className="space-y-4">
          {/* Preview */}
          <div
            className="h-20 rounded-lg border border-border"
            style={{ background: gradientCSS }}
          />

          <GradientEditor />
        </div>
      )}

      {/* Image */}
      {background.type === 'image' && (
        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          {background.image ? (
            <div className="space-y-3">
              {/* Preview */}
              <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
                <img
                  src={background.image.dataUrl}
                  alt="Background"
                  className="w-full h-full object-cover"
                  style={{ filter: `blur(${background.imageBlur}px)` }}
                />
                {background.imageOverlayOpacity > 0 && (
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundColor: background.imageOverlayColor,
                      opacity: background.imageOverlayOpacity,
                    }}
                  />
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Image className="h-4 w-4 mr-2" />
                  Change
                </Button>
                <Button variant="danger" size="icon" onClick={clearBackgroundImage}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Blur */}
              <Slider
                label="Blur"
                value={[background.imageBlur]}
                onValueChange={([value]) => setImageBlur(value)}
                min={0}
                max={50}
                step={1}
                showValue
                valueFormatter={(v) => `${v}px`}
              />

              {/* Overlay */}
              <Collapsible defaultOpen={background.imageOverlayOpacity > 0}>
                <CollapsibleTrigger className="text-text-secondary hover:text-text-primary">
                  Color Overlay
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3 space-y-3">
                  <ColorPicker
                    label="Overlay Color"
                    value={background.imageOverlayColor}
                    onChange={(color) =>
                      setImageOverlay(color, background.imageOverlayOpacity)
                    }
                  />
                  <Slider
                    label="Opacity"
                    value={[background.imageOverlayOpacity * 100]}
                    onValueChange={([value]) =>
                      setImageOverlay(background.imageOverlayColor, value / 100)
                    }
                    min={0}
                    max={100}
                    step={1}
                    showValue
                    valueFormatter={(v) => `${v}%`}
                  />
                </CollapsibleContent>
              </Collapsible>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-video rounded-lg border-2 border-dashed border-border hover:border-accent transition-colors flex flex-col items-center justify-center gap-2"
            >
              <Image className="h-8 w-8 text-text-secondary" />
              <span className="text-sm text-text-secondary">Click to upload</span>
            </button>
          )}
        </div>
      )}

      {/* Noise Section */}
      <NoiseSection />
    </div>
  );
}

function NoiseSection() {
  const {
    defaults: { noise },
    setNoiseEnabled,
    setNoiseOpacity,
  } = useAppStore();

  return (
    <Collapsible defaultOpen={noise.enabled}>
      <CollapsibleTrigger className="text-text-secondary hover:text-text-primary">
        <div className="flex items-center gap-2">
          <span>Noise Texture</span>
          {noise.enabled && (
            <span className="text-2xs text-accent">Active</span>
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs text-text-secondary">Enable</label>
          <button
            onClick={() => setNoiseEnabled(!noise.enabled)}
            className={cn(
              'w-9 h-5 rounded-full transition-colors relative',
              noise.enabled ? 'bg-accent' : 'bg-bg-tertiary'
            )}
          >
            <div
              className={cn(
                'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform',
                noise.enabled ? 'left-4' : 'left-0.5'
              )}
            />
          </button>
        </div>

        {noise.enabled && (
          <Slider
            label="Opacity"
            value={[noise.opacity * 100]}
            onValueChange={([value]) => setNoiseOpacity(value / 100)}
            min={1}
            max={20}
            step={1}
            showValue
            valueFormatter={(v) => `${v}%`}
          />
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
