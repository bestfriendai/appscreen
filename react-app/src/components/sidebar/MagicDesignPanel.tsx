import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Wand2,
  RefreshCw,
  Check,
  AlertCircle,
  Palette,
  Type,
  Layout,
  Zap,
} from 'lucide-react';
import { Button } from '../ui';
import { useAppStore } from '../../store/useAppStore';
import { geminiService, type MagicDesignResult } from '../../services/geminiService';
import { cn } from '../../lib/utils';

type Stage = 'idle' | 'analyzing' | 'generating' | 'complete' | 'error';

interface StageProgress {
  appAnalysis: boolean;
  screenshotAnalysis: boolean;
  headlines: boolean;
  layouts: boolean;
}

export function MagicDesignPanel() {
  const { screenshots, currentLanguage, setHeadlineText, setSubheadlineText, setGradient, applyPositionPreset } = useAppStore();
  const [stage, setStage] = useState<Stage>('idle');
  const [progress, setProgress] = useState<StageProgress>({
    appAnalysis: false,
    screenshotAnalysis: false,
    headlines: false,
    layouts: false,
  });
  const [result, setResult] = useState<MagicDesignResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedHeadlineIndex, setSelectedHeadlineIndex] = useState(0);

  const isConfigured = geminiService.isConfigured();
  const hasScreenshots = screenshots.length > 0;

  const runMagicDesign = async () => {
    if (!hasScreenshots) {
      setError('Please upload at least one screenshot first');
      return;
    }

    if (!isConfigured) {
      setError('Please configure your Gemini API key in settings');
      return;
    }

    setStage('analyzing');
    setError(null);
    setProgress({
      appAnalysis: false,
      screenshotAnalysis: false,
      headlines: false,
      layouts: false,
    });

    try {
      // Get screenshot images
      const screenshotImages = screenshots
        .map((s) => {
          const localizedImage = s.localizedImages[currentLanguage] || Object.values(s.localizedImages)[0];
          return localizedImage?.dataUrl;
        })
        .filter(Boolean) as string[];

      if (screenshotImages.length === 0) {
        throw new Error('No valid screenshot images found');
      }

      // Stage 1: App Analysis
      setProgress((p) => ({ ...p, appAnalysis: true }));
      const appAnalysis = await geminiService.analyzeApp(screenshotImages.slice(0, 3));

      // Stage 2: Screenshot Analysis
      setProgress((p) => ({ ...p, screenshotAnalysis: true }));
      const screenshotAnalyses = await Promise.all(
        screenshotImages.map((img) => geminiService.analyzeScreenshot(img, appAnalysis))
      );

      // Stage 3: Headlines
      setStage('generating');
      setProgress((p) => ({ ...p, headlines: true }));
      const headlines = await geminiService.generateHeadlines(screenshotImages, appAnalysis, 'punchy');

      // Stage 4: Layouts
      setProgress((p) => ({ ...p, layouts: true }));
      const suggestedLayouts = await geminiService.suggestLayouts(screenshotAnalyses, appAnalysis);

      const magicResult: MagicDesignResult = {
        appAnalysis,
        screenshotAnalyses,
        headlines,
        suggestedLayouts,
        designNotes: `Analyzed ${screenshotImages.length} screenshots for ${appAnalysis.category} app.`,
      };

      setResult(magicResult);
      setStage('complete');
    } catch (err) {
      console.error('Magic Design error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStage('error');
    }
  };

  const applyResult = () => {
    if (!result) return;

    // Apply color palette to gradient
    const { colorPalette } = result.appAnalysis;
    setGradient({
      stops: [
        { id: '1', color: colorPalette.background, position: 0 },
        { id: '2', color: colorPalette.primary, position: 50 },
        { id: '3', color: colorPalette.secondary, position: 100 },
      ],
    });

    // Apply headline
    if (result.headlines[selectedHeadlineIndex]) {
      setHeadlineText(currentLanguage, result.headlines[selectedHeadlineIndex].headline);
      setSubheadlineText(currentLanguage, result.headlines[selectedHeadlineIndex].subheadline);
    }

    // Apply first suggested layout
    if (result.suggestedLayouts[0]) {
      const layoutMap: Record<string, string> = {
        'centered': 'centered',
        'bleed-bottom': 'bleed-bottom',
        'bleed-top': 'bleed-top',
        'float-center': 'float-center',
        'tilt-left': 'tilt-left',
        'tilt-right': 'tilt-right',
        'perspective': 'perspective',
        'float-bottom': 'float-bottom',
      };
      const preset = layoutMap[result.suggestedLayouts[0]];
      if (preset) {
        applyPositionPreset(preset as any);
      }
    }
  };

  const stages = [
    { id: 'appAnalysis', label: 'Analyzing app', icon: Sparkles },
    { id: 'screenshotAnalysis', label: 'Studying screenshots', icon: Layout },
    { id: 'headlines', label: 'Generating headlines', icon: Type },
    { id: 'layouts', label: 'Suggesting layouts', icon: Palette },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Wand2 className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Magic Design</h3>
          <p className="text-2xs text-text-secondary">AI-powered screenshot optimization</p>
        </div>
      </div>

      {/* Not Configured Warning */}
      {!isConfigured && (
        <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-yellow-500 font-medium">API Key Required</p>
              <p className="text-2xs text-yellow-500/80 mt-0.5">
                Add your Gemini API key in settings to use Magic Design.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Action Button */}
      {stage === 'idle' && (
        <Button
          className="w-full"
          onClick={runMagicDesign}
          disabled={!hasScreenshots || !isConfigured}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Run Magic Design
        </Button>
      )}

      {/* Progress */}
      {(stage === 'analyzing' || stage === 'generating') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2 text-accent">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">
              {stage === 'analyzing' ? 'Analyzing...' : 'Generating...'}
            </span>
          </div>
          <div className="space-y-2">
            {stages.map((s) => (
              <div
                key={s.id}
                className={cn(
                  'flex items-center gap-2 p-2 rounded-lg transition-colors',
                  progress[s.id as keyof StageProgress]
                    ? 'bg-accent/10 text-accent'
                    : 'bg-bg-tertiary text-text-secondary'
                )}
              >
                {progress[s.id as keyof StageProgress] ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <s.icon className="w-4 h-4 opacity-50" />
                )}
                <span className="text-xs">{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Error */}
      {stage === 'error' && error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 rounded-lg bg-red-500/10 border border-red-500/20"
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-red-500 font-medium">Error</p>
              <p className="text-2xs text-red-500/80 mt-0.5">{error}</p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="w-full mt-3"
            onClick={() => setStage('idle')}
          >
            Try Again
          </Button>
        </motion.div>
      )}

      {/* Results */}
      {stage === 'complete' && result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* App Analysis */}
          <div className="p-3 rounded-lg bg-bg-tertiary">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-xs font-medium text-text-primary">App Detected</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-text-primary">
                {result.appAnalysis.category}
              </p>
              <p className="text-2xs text-text-secondary">
                {result.appAnalysis.primaryFunction} • {result.appAnalysis.visualVibe} vibe
              </p>
            </div>
          </div>

          {/* Color Palette */}
          <div className="p-3 rounded-lg bg-bg-tertiary">
            <div className="flex items-center gap-2 mb-2">
              <Palette className="w-4 h-4 text-accent" />
              <span className="text-xs font-medium text-text-primary">Suggested Colors</span>
            </div>
            <div className="flex gap-2">
              {Object.entries(result.appAnalysis.colorPalette).map(([key, color]) => (
                <div key={key} className="flex-1">
                  <div
                    className="w-full h-8 rounded-md border border-border"
                    style={{ backgroundColor: color }}
                  />
                  <p className="text-2xs text-text-secondary mt-1 text-center capitalize">
                    {key}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Headlines */}
          <div className="p-3 rounded-lg bg-bg-tertiary">
            <div className="flex items-center gap-2 mb-2">
              <Type className="w-4 h-4 text-accent" />
              <span className="text-xs font-medium text-text-primary">Headlines</span>
            </div>
            <div className="space-y-2">
              {result.headlines.slice(0, 3).map((headline, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedHeadlineIndex(i)}
                  className={cn(
                    'w-full p-2 rounded-md text-left transition-colors',
                    selectedHeadlineIndex === i
                      ? 'bg-accent/20 border border-accent/30'
                      : 'bg-bg-secondary hover:bg-bg-secondary/80'
                  )}
                >
                  <p className="text-sm font-medium text-text-primary">{headline.headline}</p>
                  <p className="text-2xs text-text-secondary">{headline.subheadline}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Suggested Layout */}
          <div className="p-3 rounded-lg bg-bg-tertiary">
            <div className="flex items-center gap-2 mb-2">
              <Layout className="w-4 h-4 text-accent" />
              <span className="text-xs font-medium text-text-primary">Suggested Layout</span>
            </div>
            <p className="text-sm text-text-secondary capitalize">
              {result.suggestedLayouts[0]?.replace(/-/g, ' ') || 'Centered'}
            </p>
          </div>

          {/* Apply Button */}
          <div className="space-y-2">
            <Button className="w-full" onClick={applyResult}>
              <Check className="w-4 h-4 mr-2" />
              Apply Design
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                setStage('idle');
                setResult(null);
              }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Run Again
            </Button>
          </div>
        </motion.div>
      )}

      {/* Info */}
      {stage === 'idle' && hasScreenshots && (
        <p className="text-2xs text-text-secondary text-center">
          Analyzes your screenshots and suggests headlines, colors, and layouts optimized for App Store conversion.
        </p>
      )}
    </div>
  );
}
