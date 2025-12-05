import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import { toBlob, toCanvas } from 'html-to-image';
import { GeneratedSlide } from '../types';
import { logger } from './logger';

// Device sizes for App Store requirements
export const DEVICE_SIZES = {
  'iphone-6.7': { width: 1290, height: 2796, name: 'iPhone 16 Pro Max (6.7")' },
  'iphone-6.5': { width: 1242, height: 2688, name: 'iPhone 14 Pro Max (6.5")' },
  'iphone-5.5': { width: 1242, height: 2208, name: 'iPhone 8 Plus (5.5")' },
  'ipad-12.9': { width: 2048, height: 2732, name: 'iPad Pro 12.9"' },
  'ipad-11': { width: 1668, height: 2388, name: 'iPad Pro 11"' },
  'social-story': { width: 1080, height: 1920, name: 'Social Story 9:16' },
  'social-landscape': { width: 1920, height: 1080, name: 'Social Landscape 16:9' },
  'social-square': { width: 1080, height: 1080, name: 'Social Square 1:1' },
  'current': { width: 1290, height: 2796, name: 'Current Size' },
} as const;

// Font CSS to embed directly (avoids cross-origin issues)
const EMBEDDED_FONT_CSS = `
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 300 900;
  font-display: swap;
  src: local('Inter');
}
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400 900;
  font-display: swap;
  src: local('Poppins');
}
@font-face {
  font-family: 'Oswald';
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
  src: local('Oswald');
}
@font-face {
  font-family: 'Playfair Display';
  font-style: normal;
  font-weight: 400 900;
  font-display: swap;
  src: local('Playfair Display');
}
@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 400 900;
  font-display: swap;
  src: local('Montserrat');
}
@font-face {
  font-family: 'DM Sans';
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
  src: local('DM Sans');
}
@font-face {
  font-family: 'Merriweather';
  font-style: normal;
  font-weight: 300 900;
  font-display: swap;
  src: local('Merriweather');
}
`;

export type DeviceSize = keyof typeof DEVICE_SIZES;
export type ExportFormat = 'png' | 'jpg' | 'webp' | 'pdf';

interface ExportOptions {
  format: ExportFormat;
  quality?: number; // 0-1 for jpg/webp
  deviceSize?: DeviceSize;
  scale?: number; // Retina multiplier (1 or 2)
}

/**
 * Captures a DOM element and converts it to an image blob using html-to-image
 * Handles cross-origin CSS issues by skipping external stylesheets
 */
export async function captureElement(
  element: HTMLElement,
  options: ExportOptions = { format: 'png' }
): Promise<Blob> {
  // Wait for fonts to load
  await document.fonts.ready;

  // Small delay to ensure all images are rendered
  await new Promise(resolve => setTimeout(resolve, 100));

  // Exclude UI controls from screenshot if any exist inside the element
  const filter = (node: HTMLElement) => {
    // Exclude UI controls
    if (node.classList?.contains('exclude-from-export')) return false;
    // Exclude link tags (external stylesheets that cause CORS issues)
    if (node.tagName === 'LINK' && (node as HTMLLinkElement).rel === 'stylesheet') return false;
    return true;
  };

  const config = {
    cacheBust: true,
    pixelRatio: options.scale || 2,
    filter: filter as any,
    quality: options.quality || 1.0,
    backgroundColor: null as unknown as string,
    // Skip fetching external resources that cause CORS errors
    skipFonts: false,
    // Include inline styles to preserve fonts
    includeQueryParams: true,
    // Use high-quality image settings
    style: {
      textRendering: 'geometricPrecision',
      imageRendering: '-webkit-optimize-contrast',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    } as Record<string, string>,
    // Handle font embedding manually
    fontEmbedCSS: EMBEDDED_FONT_CSS,
    // Skip external stylesheets that cause CORS issues
    skipAutoScale: false,
    // Fetch with proper CORS handling for images
    fetchRequestInit: {
      mode: 'cors' as RequestMode,
      credentials: 'omit' as RequestCredentials,
    },
  };

  try {
    // First try with canvas for better quality
    const canvas = await toCanvas(element, config);
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Apply image smoothing for better quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    }

    // Convert canvas to blob with high quality
    const mimeType = options.format === 'jpg' ? 'image/jpeg' :
                     options.format === 'webp' ? 'image/webp' : 'image/png';
    const quality = options.format === 'png' ? undefined : (options.quality || 0.95);

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        },
        mimeType,
        quality
      );
    });
  } catch (error) {
    logger.error("Canvas capture failed, falling back to toBlob", error);

    // Fallback to direct toBlob if canvas fails
    try {
      if (options.format === 'jpg') {
        return await toBlob(element, { ...config, type: 'image/jpeg' }) as Blob;
      } else if (options.format === 'webp') {
        return await toBlob(element, { ...config, type: 'image/webp' }) as Blob;
      } else {
        return await toBlob(element, { ...config, type: 'image/png' }) as Blob;
      }
    } catch (fallbackError) {
      logger.error("Fallback capture also failed", fallbackError);
      throw fallbackError;
    }
  }
}

/**
 * Downloads a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Exports all slides as a ZIP file
 * Note: Uses JSZip directly instead of worker due to interface compatibility
 */
export async function exportAllSlidesAsZip(
  slideElements: HTMLElement[],
  appName: string,
  options: ExportOptions = { format: 'png', scale: 2 }
): Promise<void> {
  const zip = new JSZip();
  const folderName = `${appName.replace(/\s+/g, '-')}-screenshots`;
  const folder = zip.folder(folderName) || zip;

  // Capture all slides sequentially to avoid memory issues
  for (let i = 0; i < slideElements.length; i++) {
    try {
      const blob = await captureElement(slideElements[i], options);
      const filename = `screenshot-${i + 1}.${options.format}`;
      folder.file(filename, blob);
    } catch (error) {
      logger.error(`Failed to capture slide ${i + 1}`, error);
      throw new Error(`Failed to capture slide ${i + 1}: ${(error as Error).message}`);
    }
  }

  // Generate ZIP and download
  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  const zipFilename = `${appName.replace(/\s+/g, '-')}-screenshots.zip`;
  downloadBlob(zipBlob, zipFilename);
}

/**
 * Exports all slides as a single PDF
 */
export async function exportAllSlidesAsPDF(
  slideElements: HTMLElement[],
  appName: string,
  options: { scale?: number } = { scale: 2 }
): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [1290, 2796],
  });

  for (let i = 0; i < slideElements.length; i++) {
    // Capture as JPEG for PDF size optimization
    const blob = await captureElement(slideElements[i], { format: 'jpg', scale: options.scale, quality: 0.9 });

    // Convert blob to base64 for jsPDF
    const reader = new FileReader();
    const base64data = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
    });

    if (i > 0) {
      pdf.addPage([1290, 2796], 'portrait');
    }

    pdf.addImage(base64data, 'JPEG', 0, 0, 1290, 2796);
  }

  pdf.save(`${appName.replace(/\s+/g, '-')}-screenshots.pdf`);
}

/**
 * Exports slides in multiple device sizes
 */
export async function exportMultipleSizes(
  slideElement: HTMLElement,
  slideIndex: number,
  appName: string,
  deviceSizes: DeviceSize[],
  format: ExportFormat = 'png'
): Promise<void> {
  const zip = new JSZip();
  const folderName = `${appName.replace(/\s+/g, '-')}-multiple-sizes`;
  const folder = zip.folder(folderName) || zip;

  const baseBlob = await captureElement(slideElement, { scale: 2, format: 'png' });
  const baseImg = await createImageBitmap(baseBlob);

  for (const sizeKey of deviceSizes) {
    const size = DEVICE_SIZES[sizeKey];
    const deviceFolder = folder.folder(sizeKey) || folder;

    const out = new OffscreenCanvas(size.width, size.height);
    const ctx = out.getContext('2d')!;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, out.width, out.height);

    const scaleContain = Math.min(out.width / baseImg.width, out.height / baseImg.height);
    const drawW = baseImg.width * scaleContain;
    const drawH = baseImg.height * scaleContain;
    const dx = (out.width - drawW) / 2;
    const dy = (out.height - drawH) / 2;
    ctx.drawImage(baseImg, dx, dy, drawW, drawH);

    const blob = await out.convertToBlob({ type: `image/${format === 'jpg' ? 'jpeg' : format}`, quality: 0.95 });
    const filename = `screenshot-${slideIndex + 1}.${format}`;
    deviceFolder.file(filename, blob);
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(zipBlob, `${folderName}.zip`);
}

export interface ProjectData {
  version: string;
  appName: string;
  description: string;
  screenshots: { id: string; url: string }[];
  slides: GeneratedSlide[];
  settings: {
    designTheme: string;
    themeMode: string;
    frameStyle: string;
    deviceColor: string;
    fontStyle: string;
    accentColor: string;
    isPanoramic: boolean;
  };
  timestamp: number;
}

export function exportProjectAsJSON(data: ProjectData): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const filename = `${data.appName.replace(/\s+/g, '-')}-project.screengenius.json`;
  downloadBlob(blob, filename);
}
