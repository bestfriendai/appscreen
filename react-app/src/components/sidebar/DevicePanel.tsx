import { Slider, ColorPicker } from '../ui';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../ui/Collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/Select';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';
import { POSITION_PRESETS, type DeviceMode, type DeviceFrame, type PositionPreset } from '../../types';
import {
  Target,
  ArrowUp,
  ArrowDown,
  ArrowUpCircle,
  ArrowDownCircle,
  RotateCcw,
  RotateCw,
  Box,
  Cloud,
} from 'lucide-react';

const presetIcons: Record<PositionPreset, React.ReactNode> = {
  centered: <Target className="h-4 w-4" />,
  top: <ArrowUp className="h-4 w-4" />,
  bottom: <ArrowDown className="h-4 w-4" />,
  'bleed-top': <ArrowUpCircle className="h-4 w-4" />,
  'bleed-bottom': <ArrowDownCircle className="h-4 w-4" />,
  'tilt-left': <RotateCcw className="h-4 w-4" />,
  'tilt-right': <RotateCw className="h-4 w-4" />,
  perspective: <Box className="h-4 w-4" />,
  float: <Cloud className="h-4 w-4" />,
};

export function DevicePanel() {
  const {
    defaults: { device, screenshot },
    setDeviceMode,
    setDeviceFrame,
    setDevice3DRotation,
    setDevice3DScale,
    setScreenshotPosition,
    setScreenshotScale,
    setScreenshotRotation,
    setScreenshotCornerRadius,
    applyPositionPreset,
  } = useAppStore();

  const deviceFrames: { value: DeviceFrame; label: string }[] = [
    { value: 'none', label: 'No Frame' },
    { value: 'iphone-15-pro-max', label: 'iPhone 15 Pro Max' },
    { value: 'iphone-15-pro', label: 'iPhone 15 Pro' },
    { value: 'iphone-15', label: 'iPhone 15' },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Device Mode */}
      <div className="space-y-2">
        <label className="text-xs text-text-secondary font-medium">Mode</label>
        <div className="grid grid-cols-2 gap-2">
          {(['2d', '3d'] as DeviceMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setDeviceMode(mode)}
              className={cn(
                'h-9 rounded-lg text-sm font-medium transition-all uppercase',
                device.mode === mode
                  ? 'bg-accent text-white'
                  : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Device Frame */}
      <Select
        value={device.frame}
        onValueChange={(value) => setDeviceFrame(value as DeviceFrame)}
      >
        <SelectTrigger label="Device Frame">
          <SelectValue>{deviceFrames.find((f) => f.value === device.frame)?.label}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {deviceFrames.map((frame) => (
            <SelectItem key={frame.value} value={frame.value}>
              {frame.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 2D Mode Controls */}
      {device.mode === '2d' && (
        <>
          {/* Position Presets */}
          <div className="space-y-2">
            <label className="text-xs text-text-secondary font-medium">
              Position Presets
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(POSITION_PRESETS) as [PositionPreset, typeof POSITION_PRESETS[PositionPreset]][]).map(
                ([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => applyPositionPreset(key)}
                    className="h-10 rounded-lg bg-bg-tertiary hover:bg-[#252528] transition-colors flex flex-col items-center justify-center gap-0.5 text-text-secondary hover:text-text-primary"
                    title={preset.name}
                  >
                    {presetIcons[key]}
                    <span className="text-2xs">{preset.name}</span>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Position */}
          <div className="space-y-3">
            <Slider
              label="Position X"
              value={[screenshot.position.x]}
              onValueChange={([value]) => setScreenshotPosition({ x: value })}
              min={0}
              max={100}
              step={1}
              showValue
              valueFormatter={(v) => `${v}%`}
            />
            <Slider
              label="Position Y"
              value={[screenshot.position.y]}
              onValueChange={([value]) => setScreenshotPosition({ y: value })}
              min={0}
              max={100}
              step={1}
              showValue
              valueFormatter={(v) => `${v}%`}
            />
          </div>

          {/* Scale */}
          <Slider
            label="Scale"
            value={[screenshot.scale * 100]}
            onValueChange={([value]) => setScreenshotScale(value / 100)}
            min={10}
            max={150}
            step={1}
            showValue
            valueFormatter={(v) => `${v}%`}
          />

          {/* Rotation */}
          <Slider
            label="Rotation"
            value={[screenshot.rotation]}
            onValueChange={([value]) => setScreenshotRotation(value)}
            min={-45}
            max={45}
            step={1}
            showValue
            valueFormatter={(v) => `${v}°`}
          />

          {/* Corner Radius */}
          <Slider
            label="Corner Radius"
            value={[screenshot.cornerRadius]}
            onValueChange={([value]) => setScreenshotCornerRadius(value)}
            min={0}
            max={100}
            step={1}
            showValue
            valueFormatter={(v) => `${v}px`}
          />
        </>
      )}

      {/* 3D Mode Controls */}
      {device.mode === '3d' && (
        <>
          {/* 3D Rotation Presets */}
          <div className="space-y-2">
            <label className="text-xs text-text-secondary font-medium">
              3D Presets
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: 'Front', x: 0, y: 0, z: 0 },
                { name: 'Tilt L', x: 5, y: -15, z: 0 },
                { name: 'Tilt R', x: 5, y: 15, z: 0 },
                { name: 'Hero', x: 10, y: -25, z: 5 },
                { name: 'Float', x: -5, y: 10, z: -3 },
                { name: 'Angle', x: 8, y: 20, z: -5 },
              ].map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    setDevice3DRotation({ x: preset.x, y: preset.y, z: preset.z });
                  }}
                  className="h-8 rounded-lg bg-bg-tertiary hover:bg-[#252528] transition-colors text-xs text-text-secondary hover:text-text-primary"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* 3D Rotation Sliders */}
          <div className="space-y-3">
            <Slider
              label="Rotation X"
              value={[device.rotationX]}
              onValueChange={([value]) => setDevice3DRotation({ x: value })}
              min={-30}
              max={30}
              step={1}
              showValue
              valueFormatter={(v) => `${v}°`}
            />
            <Slider
              label="Rotation Y"
              value={[device.rotationY]}
              onValueChange={([value]) => setDevice3DRotation({ y: value })}
              min={-45}
              max={45}
              step={1}
              showValue
              valueFormatter={(v) => `${v}°`}
            />
            <Slider
              label="Rotation Z"
              value={[device.rotationZ]}
              onValueChange={([value]) => setDevice3DRotation({ z: value })}
              min={-30}
              max={30}
              step={1}
              showValue
              valueFormatter={(v) => `${v}°`}
            />
            <Slider
              label="Scale"
              value={[device.scale3d * 100]}
              onValueChange={([value]) => setDevice3DScale(value / 100)}
              min={50}
              max={150}
              step={1}
              showValue
              valueFormatter={(v) => `${v}%`}
            />
          </div>

          {/* Reset button */}
          <button
            onClick={() => {
              setDevice3DRotation({ x: 0, y: 0, z: 0 });
              setDevice3DScale(1);
            }}
            className="w-full h-8 rounded-lg border border-border hover:border-accent/50 transition-colors text-xs text-text-secondary hover:text-text-primary"
          >
            Reset 3D Transform
          </button>
        </>
      )}

      {/* Shadow Section */}
      <ShadowSection />

      {/* Border Section */}
      <BorderSection />
    </div>
  );
}

function ShadowSection() {
  const {
    defaults: { screenshot },
    setShadowSettings,
  } = useAppStore();

  const { shadow } = screenshot;

  return (
    <Collapsible defaultOpen={shadow.enabled}>
      <CollapsibleTrigger className="text-text-secondary hover:text-text-primary">
        <div className="flex items-center gap-2">
          <span>Shadow</span>
          {shadow.enabled && <span className="text-2xs text-accent">Active</span>}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs text-text-secondary">Enable</label>
          <button
            onClick={() => setShadowSettings({ enabled: !shadow.enabled })}
            className={cn(
              'w-9 h-5 rounded-full transition-colors relative',
              shadow.enabled ? 'bg-accent' : 'bg-bg-tertiary'
            )}
          >
            <div
              className={cn(
                'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform',
                shadow.enabled ? 'left-4' : 'left-0.5'
              )}
            />
          </button>
        </div>

        {shadow.enabled && (
          <>
            <ColorPicker
              label="Color"
              value={shadow.color.startsWith('rgba') ? '#000000' : shadow.color}
              onChange={(color) => setShadowSettings({ color })}
            />
            <Slider
              label="Blur"
              value={[shadow.blur]}
              onValueChange={([value]) => setShadowSettings({ blur: value })}
              min={0}
              max={100}
              step={1}
              showValue
              valueFormatter={(v) => `${v}px`}
            />
            <Slider
              label="Offset X"
              value={[shadow.offsetX]}
              onValueChange={([value]) => setShadowSettings({ offsetX: value })}
              min={-50}
              max={50}
              step={1}
              showValue
              valueFormatter={(v) => `${v}px`}
            />
            <Slider
              label="Offset Y"
              value={[shadow.offsetY]}
              onValueChange={([value]) => setShadowSettings({ offsetY: value })}
              min={-50}
              max={50}
              step={1}
              showValue
              valueFormatter={(v) => `${v}px`}
            />
          </>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

function BorderSection() {
  const {
    defaults: { screenshot },
    setBorderSettings,
  } = useAppStore();

  const { border } = screenshot;

  return (
    <Collapsible defaultOpen={border.enabled}>
      <CollapsibleTrigger className="text-text-secondary hover:text-text-primary">
        <div className="flex items-center gap-2">
          <span>Border</span>
          {border.enabled && <span className="text-2xs text-accent">Active</span>}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs text-text-secondary">Enable</label>
          <button
            onClick={() => setBorderSettings({ enabled: !border.enabled })}
            className={cn(
              'w-9 h-5 rounded-full transition-colors relative',
              border.enabled ? 'bg-accent' : 'bg-bg-tertiary'
            )}
          >
            <div
              className={cn(
                'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform',
                border.enabled ? 'left-4' : 'left-0.5'
              )}
            />
          </button>
        </div>

        {border.enabled && (
          <>
            <ColorPicker
              label="Color"
              value={border.color}
              onChange={(color) => setBorderSettings({ color })}
            />
            <Slider
              label="Width"
              value={[border.width]}
              onValueChange={([value]) => setBorderSettings({ width: value })}
              min={1}
              max={20}
              step={1}
              showValue
              valueFormatter={(v) => `${v}px`}
            />
          </>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
