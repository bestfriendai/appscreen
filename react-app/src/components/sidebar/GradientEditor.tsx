import { useState, useRef, useCallback } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Button, Slider, ColorPicker } from '../ui';
import { useAppStore } from '../../store/useAppStore';
import { cn, generateGradientCSS } from '../../lib/utils';
import type { GradientType, GradientStop } from '../../types';

export function GradientEditor() {
  const {
    defaults: { background },
    setGradient,
    addGradientStop,
    updateGradientStop,
    removeGradientStop,
  } = useAppStore();

  const { gradient } = background;
  const [selectedStopId, setSelectedStopId] = useState<string | null>(
    gradient.stops[0]?.id || null
  );
  const trackRef = useRef<HTMLDivElement>(null);

  const selectedStop = gradient.stops.find((s) => s.id === selectedStopId);

  const handleTrackClick = useCallback(
    (e: React.MouseEvent) => {
      if (!trackRef.current) return;

      const rect = trackRef.current.getBoundingClientRect();
      const position = Math.round(((e.clientX - rect.left) / rect.width) * 100);

      // Find colors at this position to interpolate
      const sortedStops = [...gradient.stops].sort((a, b) => a.position - b.position);
      let beforeStop = sortedStops[0];

      for (let i = 0; i < sortedStops.length - 1; i++) {
        if (
          sortedStops[i].position <= position &&
          sortedStops[i + 1].position >= position
        ) {
          beforeStop = sortedStops[i];
          break;
        }
      }

      // Simple color interpolation (just use before color for simplicity)
      const newStop: GradientStop = {
        id: uuidv4(),
        color: beforeStop.color,
        position,
      };

      addGradientStop(newStop);
      setSelectedStopId(newStop.id);
    },
    [gradient.stops, addGradientStop]
  );

  const handleStopDrag = useCallback(
    (stopId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (!trackRef.current) return;

      const rect = trackRef.current.getBoundingClientRect();

      const handleMove = (moveEvent: MouseEvent) => {
        const position = Math.round(
          Math.min(100, Math.max(0, ((moveEvent.clientX - rect.left) / rect.width) * 100))
        );
        updateGradientStop(stopId, { position });
      };

      const handleUp = () => {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleUp);
      };

      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleUp);
    },
    [updateGradientStop]
  );

  const gradientCSS = generateGradientCSS(gradient.type, gradient.angle, gradient.stops);

  return (
    <div className="space-y-4">
      {/* Gradient Type */}
      <div className="space-y-2">
        <label className="text-xs text-text-secondary font-medium">Style</label>
        <div className="grid grid-cols-2 gap-2">
          {(['linear', 'radial'] as GradientType[]).map((type) => (
            <button
              key={type}
              onClick={() => setGradient({ type })}
              className={cn(
                'h-8 rounded-md text-sm font-medium transition-all capitalize',
                gradient.type === type
                  ? 'bg-accent text-white'
                  : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Angle (for linear) */}
      {gradient.type === 'linear' && (
        <Slider
          label="Angle"
          value={[gradient.angle]}
          onValueChange={([value]) => setGradient({ angle: value })}
          min={0}
          max={360}
          step={1}
          showValue
          valueFormatter={(v) => `${v}°`}
        />
      )}

      {/* Gradient Track */}
      <div className="space-y-2">
        <label className="text-xs text-text-secondary font-medium">Color Stops</label>
        <div
          ref={trackRef}
          className="relative h-8 rounded-lg cursor-pointer"
          style={{ background: gradientCSS }}
          onClick={handleTrackClick}
        >
          {gradient.stops.map((stop) => (
            <div
              key={stop.id}
              className={cn(
                'absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 cursor-grab active:cursor-grabbing transition-transform',
                selectedStopId === stop.id
                  ? 'border-white scale-125 z-10'
                  : 'border-white/70 hover:scale-110'
              )}
              style={{
                left: `calc(${stop.position}% - 8px)`,
                backgroundColor: stop.color,
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedStopId(stop.id);
              }}
              onMouseDown={(e) => handleStopDrag(stop.id, e)}
            />
          ))}
        </div>
        <p className="text-2xs text-text-secondary">
          Click on the bar to add a color stop
        </p>
      </div>

      {/* Selected Stop Editor */}
      {selectedStop && (
        <div className="space-y-3 p-3 bg-bg-tertiary rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-primary">
              Selected Stop
            </span>
            {gradient.stops.length > 2 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => {
                  removeGradientStop(selectedStop.id);
                  setSelectedStopId(gradient.stops[0]?.id || null);
                }}
              >
                <Trash2 className="h-3.5 w-3.5 text-[#ff453a]" />
              </Button>
            )}
          </div>

          <ColorPicker
            label="Color"
            value={selectedStop.color}
            onChange={(color) => updateGradientStop(selectedStop.id, { color })}
          />

          <Slider
            label="Position"
            value={[selectedStop.position]}
            onValueChange={([value]) =>
              updateGradientStop(selectedStop.id, { position: value })
            }
            min={0}
            max={100}
            step={1}
            showValue
            valueFormatter={(v) => `${v}%`}
          />
        </div>
      )}

      {/* Quick Add Button */}
      <Button
        variant="default"
        className="w-full"
        onClick={() => {
          const positions = gradient.stops.map((s) => s.position);
          const maxGap = { start: 0, end: 0, gap: 0 };

          for (let i = 0; i < positions.length - 1; i++) {
            const gap = positions[i + 1] - positions[i];
            if (gap > maxGap.gap) {
              maxGap.start = positions[i];
              maxGap.end = positions[i + 1];
              maxGap.gap = gap;
            }
          }

          const newPosition = Math.round((maxGap.start + maxGap.end) / 2);
          const newStop: GradientStop = {
            id: uuidv4(),
            color: '#888888',
            position: newPosition,
          };
          addGradientStop(newStop);
          setSelectedStopId(newStop.id);
        }}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Color Stop
      </Button>
    </div>
  );
}
