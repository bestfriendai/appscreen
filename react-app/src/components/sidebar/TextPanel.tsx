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
import type { TextAlignment, TextPosition } from '../../types';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

const FONT_FAMILIES = [
  'SF Pro Display',
  'SF Pro Text',
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Playfair Display',
  'Merriweather',
  'Source Sans Pro',
  'Raleway',
  'Oswald',
  'Nunito',
  'Ubuntu',
];

const FONT_WEIGHTS = [
  { value: 100, label: 'Thin' },
  { value: 200, label: 'Extra Light' },
  { value: 300, label: 'Light' },
  { value: 400, label: 'Regular' },
  { value: 500, label: 'Medium' },
  { value: 600, label: 'Semi Bold' },
  { value: 700, label: 'Bold' },
  { value: 800, label: 'Extra Bold' },
  { value: 900, label: 'Black' },
];

export function TextPanel() {
  const {
    defaults: { text },
    currentLanguage,
    setHeadlineText,
    setSubheadlineText,
  } = useAppStore();

  const headlineText = text.headlines[currentLanguage] || '';
  const subheadlineText = text.subheadlines[currentLanguage] || '';

  return (
    <div className="p-4 space-y-4">
      {/* Headline Section */}
      <HeadlineSection />

      {/* Headline Text Input */}
      {text.headline.enabled && (
        <div className="space-y-2">
          <label className="text-xs text-text-secondary font-medium">
            Headline Text ({currentLanguage.toUpperCase()})
          </label>
          <textarea
            value={headlineText}
            onChange={(e) => setHeadlineText(currentLanguage, e.target.value)}
            placeholder="Enter headline text..."
            className="w-full h-20 rounded-lg border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:border-accent focus:outline-none resize-none"
          />
        </div>
      )}

      {/* Subheadline Section */}
      <SubheadlineSection />

      {/* Subheadline Text Input */}
      {text.subheadline.enabled && (
        <div className="space-y-2">
          <label className="text-xs text-text-secondary font-medium">
            Subheadline Text ({currentLanguage.toUpperCase()})
          </label>
          <textarea
            value={subheadlineText}
            onChange={(e) => setSubheadlineText(currentLanguage, e.target.value)}
            placeholder="Enter subheadline text..."
            className="w-full h-16 rounded-lg border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:border-accent focus:outline-none resize-none"
          />
        </div>
      )}
    </div>
  );
}

function HeadlineSection() {
  const {
    defaults: { text },
    setHeadlineEnabled,
    setHeadlineStyle,
  } = useAppStore();

  const { headline } = text;

  return (
    <Collapsible defaultOpen={headline.enabled}>
      <CollapsibleTrigger className="text-text-secondary hover:text-text-primary">
        <div className="flex items-center gap-2">
          <span>Headline</span>
          {headline.enabled && <span className="text-2xs text-accent">Active</span>}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3 space-y-3">
        {/* Enable Toggle */}
        <div className="flex items-center justify-between">
          <label className="text-xs text-text-secondary">Enable</label>
          <button
            onClick={() => setHeadlineEnabled(!headline.enabled)}
            className={cn(
              'w-9 h-5 rounded-full transition-colors relative',
              headline.enabled ? 'bg-accent' : 'bg-bg-tertiary'
            )}
          >
            <div
              className={cn(
                'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform',
                headline.enabled ? 'left-4' : 'left-0.5'
              )}
            />
          </button>
        </div>

        {headline.enabled && (
          <>
            {/* Font Family */}
            <Select
              value={headline.fontFamily}
              onValueChange={(value) => setHeadlineStyle({ fontFamily: value })}
            >
              <SelectTrigger label="Font">
                <SelectValue>{headline.fontFamily}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {FONT_FAMILIES.map((font) => (
                  <SelectItem key={font} value={font}>
                    <span style={{ fontFamily: font }}>{font}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Font Weight */}
            <Select
              value={headline.fontWeight.toString()}
              onValueChange={(value) =>
                setHeadlineStyle({ fontWeight: parseInt(value) })
              }
            >
              <SelectTrigger label="Weight">
                <SelectValue>
                  {FONT_WEIGHTS.find((w) => w.value === headline.fontWeight)?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {FONT_WEIGHTS.map((weight) => (
                  <SelectItem key={weight.value} value={weight.value.toString()}>
                    {weight.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Font Size */}
            <Slider
              label="Size"
              value={[headline.fontSize]}
              onValueChange={([value]) => setHeadlineStyle({ fontSize: value })}
              min={24}
              max={120}
              step={1}
              showValue
              valueFormatter={(v) => `${v}px`}
            />

            {/* Color */}
            <ColorPicker
              label="Color"
              value={headline.color}
              onChange={(color) => setHeadlineStyle({ color })}
            />

            {/* Alignment */}
            <div className="space-y-2">
              <label className="text-xs text-text-secondary font-medium">
                Alignment
              </label>
              <div className="flex gap-2">
                {(['left', 'center', 'right'] as TextAlignment[]).map((align) => (
                  <button
                    key={align}
                    onClick={() => setHeadlineStyle({ alignment: align })}
                    className={cn(
                      'flex-1 h-8 rounded-md flex items-center justify-center transition-colors',
                      headline.alignment === align
                        ? 'bg-accent text-white'
                        : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
                    )}
                  >
                    {align === 'left' && <AlignLeft className="h-4 w-4" />}
                    {align === 'center' && <AlignCenter className="h-4 w-4" />}
                    {align === 'right' && <AlignRight className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Position */}
            <div className="space-y-2">
              <label className="text-xs text-text-secondary font-medium">
                Position
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['top', 'bottom'] as TextPosition[]).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setHeadlineStyle({ position: pos })}
                    className={cn(
                      'h-8 rounded-md text-sm font-medium transition-colors capitalize',
                      headline.position === pos
                        ? 'bg-accent text-white'
                        : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
                    )}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>

            {/* Offset Y */}
            <Slider
              label="Vertical Offset"
              value={[headline.offsetY]}
              onValueChange={([value]) => setHeadlineStyle({ offsetY: value })}
              min={0}
              max={500}
              step={1}
              showValue
              valueFormatter={(v) => `${v}px`}
            />

            {/* Letter Spacing */}
            <Slider
              label="Letter Spacing"
              value={[headline.letterSpacing]}
              onValueChange={([value]) => setHeadlineStyle({ letterSpacing: value })}
              min={-5}
              max={10}
              step={0.5}
              showValue
              valueFormatter={(v) => `${v}px`}
            />

            {/* Line Height */}
            <Slider
              label="Line Height"
              value={[headline.lineHeight * 100]}
              onValueChange={([value]) => setHeadlineStyle({ lineHeight: value / 100 })}
              min={80}
              max={200}
              step={5}
              showValue
              valueFormatter={(v) => `${v}%`}
            />

            {/* Max Width */}
            <Slider
              label="Max Width"
              value={[headline.maxWidth]}
              onValueChange={([value]) => setHeadlineStyle({ maxWidth: value })}
              min={50}
              max={100}
              step={1}
              showValue
              valueFormatter={(v) => `${v}%`}
            />
          </>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

function SubheadlineSection() {
  const {
    defaults: { text },
    setSubheadlineEnabled,
    setSubheadlineStyle,
  } = useAppStore();

  const { subheadline } = text;

  return (
    <Collapsible defaultOpen={subheadline.enabled}>
      <CollapsibleTrigger className="text-text-secondary hover:text-text-primary">
        <div className="flex items-center gap-2">
          <span>Subheadline</span>
          {subheadline.enabled && <span className="text-2xs text-accent">Active</span>}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3 space-y-3">
        {/* Enable Toggle */}
        <div className="flex items-center justify-between">
          <label className="text-xs text-text-secondary">Enable</label>
          <button
            onClick={() => setSubheadlineEnabled(!subheadline.enabled)}
            className={cn(
              'w-9 h-5 rounded-full transition-colors relative',
              subheadline.enabled ? 'bg-accent' : 'bg-bg-tertiary'
            )}
          >
            <div
              className={cn(
                'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform',
                subheadline.enabled ? 'left-4' : 'left-0.5'
              )}
            />
          </button>
        </div>

        {subheadline.enabled && (
          <>
            {/* Font Family */}
            <Select
              value={subheadline.fontFamily}
              onValueChange={(value) => setSubheadlineStyle({ fontFamily: value })}
            >
              <SelectTrigger label="Font">
                <SelectValue>{subheadline.fontFamily}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {FONT_FAMILIES.map((font) => (
                  <SelectItem key={font} value={font}>
                    <span style={{ fontFamily: font }}>{font}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Font Weight */}
            <Select
              value={subheadline.fontWeight.toString()}
              onValueChange={(value) =>
                setSubheadlineStyle({ fontWeight: parseInt(value) })
              }
            >
              <SelectTrigger label="Weight">
                <SelectValue>
                  {FONT_WEIGHTS.find((w) => w.value === subheadline.fontWeight)?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {FONT_WEIGHTS.map((weight) => (
                  <SelectItem key={weight.value} value={weight.value.toString()}>
                    {weight.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Font Size */}
            <Slider
              label="Size"
              value={[subheadline.fontSize]}
              onValueChange={([value]) => setSubheadlineStyle({ fontSize: value })}
              min={12}
              max={72}
              step={1}
              showValue
              valueFormatter={(v) => `${v}px`}
            />

            {/* Color */}
            <ColorPicker
              label="Color"
              value={subheadline.color}
              onChange={(color) => setSubheadlineStyle({ color })}
            />

            {/* Alignment */}
            <div className="space-y-2">
              <label className="text-xs text-text-secondary font-medium">
                Alignment
              </label>
              <div className="flex gap-2">
                {(['left', 'center', 'right'] as TextAlignment[]).map((align) => (
                  <button
                    key={align}
                    onClick={() => setSubheadlineStyle({ alignment: align })}
                    className={cn(
                      'flex-1 h-8 rounded-md flex items-center justify-center transition-colors',
                      subheadline.alignment === align
                        ? 'bg-accent text-white'
                        : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
                    )}
                  >
                    {align === 'left' && <AlignLeft className="h-4 w-4" />}
                    {align === 'center' && <AlignCenter className="h-4 w-4" />}
                    {align === 'right' && <AlignRight className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Offset Y */}
            <Slider
              label="Vertical Offset"
              value={[subheadline.offsetY]}
              onValueChange={([value]) => setSubheadlineStyle({ offsetY: value })}
              min={0}
              max={500}
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
