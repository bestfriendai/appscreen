import { useRef, useEffect, useCallback, useState, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Move,
  RotateCcw,
  Copy,
  Trash2,
  Download,
  Box,
} from 'lucide-react';
import { Button } from '../ui';
import { useAppStore } from '../../store/useAppStore';
import { OUTPUT_DEVICES } from '../../types';
import { cn } from '../../lib/utils';

// Lazy load 3D component
const Device3D = lazy(() => import('./Device3D').then(module => ({ default: module.Device3D })));

export function CanvasPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [loadedImages, setLoadedImages] = useState<Map<string, HTMLImageElement>>(new Map());

  const {
    screenshots,
    selectedIndex,
    outputDevice,
    currentLanguage,
    defaults: { background, screenshot: screenshotSettings, device, noise, text },
    selectScreenshot,
    setPreviewScale,
    setScreenshotPosition,
    duplicateScreenshot,
    removeScreenshot,
    setShowExportModal,
  } = useAppStore();

  const currentScreenshot = screenshots[selectedIndex];
  const deviceConfig = OUTPUT_DEVICES[outputDevice];

  // Get screenshot image for current language
  const getScreenshotImage = useCallback(() => {
    if (!currentScreenshot) return null;
    const localizedImage =
      currentScreenshot.localizedImages[currentLanguage] ||
      currentScreenshot.localizedImages['en'] ||
      Object.values(currentScreenshot.localizedImages)[0];
    return localizedImage?.dataUrl || null;
  }, [currentScreenshot, currentLanguage]);

  // Preload images
  useEffect(() => {
    const imageUrl = getScreenshotImage();
    if (imageUrl && !loadedImages.has(imageUrl)) {
      const img = new Image();
      img.onload = () => {
        setLoadedImages((prev) => new Map(prev).set(imageUrl, img));
      };
      img.src = imageUrl;
    }

    // Also preload background image if exists
    if (background.image?.dataUrl && !loadedImages.has(background.image.dataUrl)) {
      const img = new Image();
      img.onload = () => {
        setLoadedImages((prev) => new Map(prev).set(background.image!.dataUrl, img));
      };
      img.src = background.image.dataUrl;
    }
  }, [getScreenshotImage, background.image, loadedImages]);

  // Draw canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = deviceConfig;
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    drawBackground(ctx, width, height);

    // Draw screenshot
    const imageUrl = getScreenshotImage();
    if (imageUrl) {
      const img = loadedImages.get(imageUrl);
      if (img) {
        drawScreenshot(ctx, img, width, height);
      }
    }

    // Draw text
    drawText(ctx, width, height);

    // Draw noise
    if (noise.enabled) {
      drawNoise(ctx, width, height);
    }
  }, [deviceConfig, background, screenshotSettings, device, noise, text, currentLanguage, getScreenshotImage, loadedImages]);

  // Draw background
  const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (background.type === 'solid') {
      ctx.fillStyle = background.color;
      ctx.fillRect(0, 0, width, height);
    } else if (background.type === 'gradient') {
      const gradient =
        background.gradient.type === 'linear'
          ? ctx.createLinearGradient(
              width / 2 + Math.cos((background.gradient.angle - 90) * Math.PI / 180) * width,
              height / 2 + Math.sin((background.gradient.angle - 90) * Math.PI / 180) * height,
              width / 2 - Math.cos((background.gradient.angle - 90) * Math.PI / 180) * width,
              height / 2 - Math.sin((background.gradient.angle - 90) * Math.PI / 180) * height
            )
          : ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) / 2);

      background.gradient.stops.forEach((stop) => {
        gradient.addColorStop(stop.position / 100, stop.color);
      });

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    } else if (background.type === 'image' && background.image) {
      const img = loadedImages.get(background.image.dataUrl);
      if (img) {
        // Cover the canvas
        const imgScale = Math.max(width / img.width, height / img.height);
        const x = (width - img.width * imgScale) / 2;
        const y = (height - img.height * imgScale) / 2;

        if (background.imageBlur > 0) {
          ctx.filter = `blur(${background.imageBlur}px)`;
        }
        ctx.drawImage(img, x, y, img.width * imgScale, img.height * imgScale);
        ctx.filter = 'none';

        // Overlay
        if (background.imageOverlayOpacity > 0) {
          ctx.fillStyle = background.imageOverlayColor;
          ctx.globalAlpha = background.imageOverlayOpacity;
          ctx.fillRect(0, 0, width, height);
          ctx.globalAlpha = 1;
        }
      }
    }
  };

  // Draw screenshot
  const drawScreenshot = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    width: number,
    height: number
  ) => {
    ctx.save();

    const posX = (screenshotSettings.position.x / 100) * width;
    const posY = (screenshotSettings.position.y / 100) * height;

    ctx.translate(posX, posY);
    ctx.rotate((screenshotSettings.rotation * Math.PI) / 180);

    const scaledWidth = img.width * screenshotSettings.scale;
    const scaledHeight = img.height * screenshotSettings.scale;

    // Shadow
    if (screenshotSettings.shadow.enabled) {
      ctx.shadowColor = screenshotSettings.shadow.color;
      ctx.shadowBlur = screenshotSettings.shadow.blur;
      ctx.shadowOffsetX = screenshotSettings.shadow.offsetX;
      ctx.shadowOffsetY = screenshotSettings.shadow.offsetY;
    }

    // Rounded corners clipping
    if (screenshotSettings.cornerRadius > 0) {
      const radius = screenshotSettings.cornerRadius * screenshotSettings.scale;
      ctx.beginPath();
      ctx.roundRect(
        -scaledWidth / 2,
        -scaledHeight / 2,
        scaledWidth,
        scaledHeight,
        radius
      );
      ctx.clip();
    }

    // Draw image
    ctx.drawImage(
      img,
      -scaledWidth / 2,
      -scaledHeight / 2,
      scaledWidth,
      scaledHeight
    );

    // Reset shadow for border
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Border
    if (screenshotSettings.border.enabled) {
      ctx.strokeStyle = screenshotSettings.border.color;
      ctx.lineWidth = screenshotSettings.border.width;

      if (screenshotSettings.cornerRadius > 0) {
        const radius = screenshotSettings.cornerRadius * screenshotSettings.scale;
        ctx.beginPath();
        ctx.roundRect(
          -scaledWidth / 2,
          -scaledHeight / 2,
          scaledWidth,
          scaledHeight,
          radius
        );
        ctx.stroke();
      } else {
        ctx.strokeRect(
          -scaledWidth / 2,
          -scaledHeight / 2,
          scaledWidth,
          scaledHeight
        );
      }
    }

    ctx.restore();
  };

  // Draw text
  const drawText = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Headline
    if (text.headline.enabled) {
      const headlineText = text.headlines[currentLanguage] || '';
      if (headlineText) {
        ctx.save();
        ctx.font = `${text.headline.fontWeight} ${text.headline.fontSize}px "${text.headline.fontFamily}"`;
        ctx.fillStyle = text.headline.color;
        ctx.textAlign = text.headline.alignment;

        const maxWidth = (text.headline.maxWidth / 100) * width;
        const x =
          text.headline.alignment === 'left'
            ? (width - maxWidth) / 2
            : text.headline.alignment === 'right'
            ? width - (width - maxWidth) / 2
            : width / 2;
        const y =
          text.headline.position === 'top'
            ? text.headline.offsetY
            : height - text.headline.offsetY;

        // Word wrap
        const words = headlineText.split(' ');
        let line = '';
        let lineY = y;
        const lineHeight = text.headline.fontSize * text.headline.lineHeight;

        words.forEach((word) => {
          const testLine = line + word + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && line !== '') {
            ctx.fillText(line.trim(), x, lineY);
            line = word + ' ';
            lineY += lineHeight;
          } else {
            line = testLine;
          }
        });
        ctx.fillText(line.trim(), x, lineY);
        ctx.restore();
      }
    }

    // Subheadline
    if (text.subheadline.enabled) {
      const subheadlineText = text.subheadlines[currentLanguage] || '';
      if (subheadlineText) {
        ctx.save();
        ctx.font = `${text.subheadline.fontWeight} ${text.subheadline.fontSize}px "${text.subheadline.fontFamily}"`;
        ctx.fillStyle = text.subheadline.color;
        ctx.textAlign = text.subheadline.alignment;

        const maxWidth = (text.subheadline.maxWidth / 100) * width;
        const x =
          text.subheadline.alignment === 'left'
            ? (width - maxWidth) / 2
            : text.subheadline.alignment === 'right'
            ? width - (width - maxWidth) / 2
            : width / 2;
        const y =
          text.subheadline.position === 'top'
            ? text.subheadline.offsetY
            : height - text.subheadline.offsetY;

        ctx.fillText(subheadlineText, x, y, maxWidth);
        ctx.restore();
      }
    }
  };

  // Draw noise
  const drawNoise = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const value = Math.random() * 255;
      data[i] = value;
      data[i + 1] = value;
      data[i + 2] = value;
      data[i + 3] = noise.opacity * 255;
    }

    ctx.putImageData(imageData, 0, 0);
  };

  // Fit canvas to container
  const fitToContainer = useCallback(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;

    const containerWidth = container.clientWidth - 80;
    const containerHeight = container.clientHeight - 100;

    const scaleX = containerWidth / deviceConfig.width;
    const scaleY = containerHeight / deviceConfig.height;
    const newScale = Math.min(scaleX, scaleY, 1);

    setScale(newScale);
    setPreviewScale(newScale);
  }, [deviceConfig, setPreviewScale]);

  // Handle drag for repositioning screenshot
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!currentScreenshot || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Check if click is on the screenshot area (rough detection)
      const posX = (screenshotSettings.position.x / 100) * rect.width;
      const posY = (screenshotSettings.position.y / 100) * rect.height;
      const distance = Math.sqrt(Math.pow(x - posX, 2) + Math.pow(y - posY, 2));

      if (distance < 150 * scale) {
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    },
    [currentScreenshot, screenshotSettings.position, scale]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100;
      const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100;

      const newX = Math.min(100, Math.max(0, screenshotSettings.position.x + deltaX));
      const newY = Math.min(100, Math.max(0, screenshotSettings.position.y + deltaY));

      setScreenshotPosition({ x: newX, y: newY });
      setDragStart({ x: e.clientX, y: e.clientY });
    },
    [isDragging, dragStart, screenshotSettings.position, setScreenshotPosition]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const step = e.shiftKey ? 5 : 1;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (e.metaKey || e.ctrlKey) {
            // Previous screenshot
            if (selectedIndex > 0) selectScreenshot(selectedIndex - 1);
          } else {
            // Move position
            setScreenshotPosition({ x: Math.max(0, screenshotSettings.position.x - step) });
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (e.metaKey || e.ctrlKey) {
            // Next screenshot
            if (selectedIndex < screenshots.length - 1) selectScreenshot(selectedIndex + 1);
          } else {
            // Move position
            setScreenshotPosition({ x: Math.min(100, screenshotSettings.position.x + step) });
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          setScreenshotPosition({ y: Math.max(0, screenshotSettings.position.y - step) });
          break;
        case 'ArrowDown':
          e.preventDefault();
          setScreenshotPosition({ y: Math.min(100, screenshotSettings.position.y + step) });
          break;
        case '+':
        case '=':
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            setScale((s) => Math.min(s * 1.2, 2));
          }
          break;
        case '-':
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            setScale((s) => Math.max(s / 1.2, 0.1));
          }
          break;
        case '0':
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            fitToContainer();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, screenshots.length, screenshotSettings.position, selectScreenshot, setScreenshotPosition, fitToContainer]);

  // Redraw on state change
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Fit on mount and resize
  useEffect(() => {
    fitToContainer();
    window.addEventListener('resize', fitToContainer);
    return () => window.removeEventListener('resize', fitToContainer);
  }, [fitToContainer]);

  // Navigation
  const goToPrevious = () => {
    if (selectedIndex > 0) {
      selectScreenshot(selectedIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedIndex < screenshots.length - 1) {
      selectScreenshot(selectedIndex + 1);
    }
  };

  const zoomIn = () => setScale((s) => Math.min(s * 1.2, 2));
  const zoomOut = () => setScale((s) => Math.max(s / 1.2, 0.1));

  // Quick actions
  const handleDuplicate = () => {
    if (currentScreenshot) {
      duplicateScreenshot(currentScreenshot.id);
    }
  };

  const handleDelete = () => {
    if (currentScreenshot) {
      removeScreenshot(currentScreenshot.id);
    }
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  const is3DMode = device.mode === '3d';

  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col items-center justify-center bg-bg-primary p-6 relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 3D Preview (when in 3D mode) */}
      {is3DMode && currentScreenshot && (
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Suspense
            fallback={
              <div
                className="flex items-center justify-center bg-bg-tertiary rounded-xl"
                style={{
                  width: Math.min(400, deviceConfig.width * 0.3),
                  height: Math.min(500, deviceConfig.height * 0.25),
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-text-secondary">Loading 3D...</span>
                </div>
              </div>
            }
          >
            <Device3D
              screenshotUrl={getScreenshotImage()}
              width={deviceConfig.width}
              height={deviceConfig.height}
            />
          </Suspense>

          {/* 3D Mode badge */}
          <div className="absolute top-2 right-2 bg-accent/90 text-white text-2xs px-2 py-1 rounded-md flex items-center gap-1">
            <Box className="h-3 w-3" />
            3D
          </div>
        </motion.div>
      )}

      {/* 2D Canvas (when in 2D mode) */}
      {!is3DMode && (
        <motion.div
          className={cn(
            'relative shadow-2xl rounded-lg overflow-hidden transition-shadow',
            isDragging && 'ring-2 ring-accent ring-offset-2 ring-offset-bg-primary'
          )}
          style={{
            width: deviceConfig.width * scale,
            height: deviceConfig.height * scale,
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <canvas
            ref={canvasRef}
            className={cn(
              'w-full h-full',
              currentScreenshot && 'cursor-move'
            )}
            style={{
              width: deviceConfig.width * scale,
              height: deviceConfig.height * scale,
            }}
            onMouseDown={handleMouseDown}
          />

          {/* Drag indicator */}
          {isDragging && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-accent/20 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-2">
                <Move className="h-4 w-4 text-accent" />
                <span className="text-sm text-accent font-medium">
                  {Math.round(screenshotSettings.position.x)}%, {Math.round(screenshotSettings.position.y)}%
                </span>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Navigation */}
      {screenshots.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 shadow-lg"
            onClick={goToPrevious}
            disabled={selectedIndex === 0}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 shadow-lg"
            onClick={goToNext}
            disabled={selectedIndex === screenshots.length - 1}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </>
      )}

      {/* Zoom controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-bg-secondary/95 backdrop-blur-sm rounded-lg px-3 py-2 border border-border shadow-lg">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={zoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-xs text-text-secondary w-12 text-center font-medium">
          {Math.round(scale * 100)}%
        </span>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={zoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-border" />
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={fitToContainer} title="Fit to screen (⌘0)">
          <Maximize2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setScale(1)} title="100%">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Screenshot counter and quick actions */}
      {screenshots.length > 0 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
          {/* Counter */}
          <div className="text-xs text-text-secondary bg-bg-secondary/95 backdrop-blur-sm rounded-full px-3 py-1.5 border border-border shadow-lg">
            <span className="text-text-primary font-medium">{selectedIndex + 1}</span>
            <span className="mx-1">/</span>
            <span>{screenshots.length}</span>
          </div>

          {/* Quick actions */}
          <div className="flex items-center gap-1 bg-bg-secondary/95 backdrop-blur-sm rounded-lg px-2 py-1 border border-border shadow-lg">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleDuplicate}
              title="Duplicate screenshot"
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleExport}
              title="Export"
            >
              <Download className="h-3.5 w-3.5" />
            </Button>
            <div className="w-px h-4 bg-border mx-1" />
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-red-500 hover:text-red-400 hover:bg-red-500/10"
              onClick={handleDelete}
              title="Delete screenshot"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      {currentScreenshot && !isDragging && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-2xs text-text-secondary/60">
          {is3DMode
            ? 'Drag to rotate • Use sliders to adjust rotation and scale'
            : 'Arrow keys to move • Hold Shift for faster • Drag to reposition'}
        </div>
      )}

      {/* Empty state */}
      {screenshots.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div
              className="mx-auto mb-4 rounded-xl border-2 border-dashed border-border flex items-center justify-center bg-bg-secondary/30"
              style={{
                width: 200,
                height: 200 * (deviceConfig.height / deviceConfig.width),
              }}
            >
              <span className="text-4xl opacity-30">📱</span>
            </div>
            <p className="text-text-secondary text-sm mb-1">
              Add screenshots to get started
            </p>
            <p className="text-text-secondary/60 text-xs">
              Drag and drop or use the upload button
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
