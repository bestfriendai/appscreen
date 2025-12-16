import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Detect language from filename
export function detectLanguageFromFilename(filename: string): string | null {
  const languagePatterns = [
    /[_-](en|en-US|en-GB)(?:\.|$)/i,
    /[_-](de|de-DE)(?:\.|$)/i,
    /[_-](fr|fr-FR|fr-CA)(?:\.|$)/i,
    /[_-](es|es-ES|es-MX)(?:\.|$)/i,
    /[_-](it|it-IT)(?:\.|$)/i,
    /[_-](pt|pt-PT|pt-BR)(?:\.|$)/i,
    /[_-](nl|nl-NL)(?:\.|$)/i,
    /[_-](pl|pl-PL)(?:\.|$)/i,
    /[_-](ru|ru-RU)(?:\.|$)/i,
    /[_-](ja|ja-JP)(?:\.|$)/i,
    /[_-](ko|ko-KR)(?:\.|$)/i,
    /[_-](zh|zh-CN|zh-Hans|zh-TW|zh-Hant)(?:\.|$)/i,
    /[_-](ar|ar-SA)(?:\.|$)/i,
    /[_-](he|he-IL)(?:\.|$)/i,
    /[_-](hi|hi-IN)(?:\.|$)/i,
    /[_-](th|th-TH)(?:\.|$)/i,
    /[_-](vi|vi-VN)(?:\.|$)/i,
    /[_-](id|id-ID)(?:\.|$)/i,
    /[_-](ms|ms-MY)(?:\.|$)/i,
    /[_-](tr|tr-TR)(?:\.|$)/i,
    /[_-](sv|sv-SE)(?:\.|$)/i,
    /[_-](da|da-DK)(?:\.|$)/i,
    /[_-](fi|fi-FI)(?:\.|$)/i,
    /[_-](no|no-NO|nb|nn)(?:\.|$)/i,
    /[_-](uk|uk-UA)(?:\.|$)/i,
    /[_-](cs|cs-CZ)(?:\.|$)/i,
    /[_-](el|el-GR)(?:\.|$)/i,
    /[_-](ro|ro-RO)(?:\.|$)/i,
    /[_-](hu|hu-HU)(?:\.|$)/i,
    /[_-](sk|sk-SK)(?:\.|$)/i,
    /[_-](ca|ca-ES)(?:\.|$)/i,
    /[_-](hr|hr-HR)(?:\.|$)/i,
  ];

  for (const pattern of languagePatterns) {
    const match = filename.match(pattern);
    if (match) {
      return normalizeLanguageCode(match[1]);
    }
  }

  return null;
}

// Normalize language code to standard format
export function normalizeLanguageCode(code: string): string {
  const mapping: Record<string, string> = {
    'en-us': 'en',
    'en-gb': 'en',
    'de-de': 'de',
    'fr-fr': 'fr',
    'fr-ca': 'fr',
    'es-es': 'es',
    'es-mx': 'es',
    'it-it': 'it',
    'pt-pt': 'pt',
    'nl-nl': 'nl',
    'pl-pl': 'pl',
    'ru-ru': 'ru',
    'ja-jp': 'ja',
    'ko-kr': 'ko',
    'zh-cn': 'zh-Hans',
    'zh-tw': 'zh-Hant',
    'ar-sa': 'ar',
    'he-il': 'he',
    'hi-in': 'hi',
    'th-th': 'th',
    'vi-vn': 'vi',
    'id-id': 'id',
    'ms-my': 'ms',
    'tr-tr': 'tr',
    'sv-se': 'sv',
    'da-dk': 'da',
    'fi-fi': 'fi',
    'no-no': 'no',
    'uk-ua': 'uk',
    'cs-cz': 'cs',
    'el-gr': 'el',
    'ro-ro': 'ro',
    'hu-hu': 'hu',
    'sk-sk': 'sk',
    'ca-es': 'ca',
    'hr-hr': 'hr',
  };

  const lower = code.toLowerCase();
  return mapping[lower] || lower.split('-')[0];
}

// Get base filename without language suffix and extension
export function getBaseFilename(filename: string): string {
  // Remove extension
  const withoutExt = filename.replace(/\.[^/.]+$/, '');

  // Remove language suffix
  const langPatterns = [
    /[_-](en|en-US|en-GB)$/i,
    /[_-](de|de-DE)$/i,
    /[_-](fr|fr-FR|fr-CA)$/i,
    /[_-](es|es-ES|es-MX)$/i,
    /[_-](it|it-IT)$/i,
    /[_-](pt|pt-PT|pt-BR)$/i,
    /[_-](nl|nl-NL)$/i,
    /[_-](pl|pl-PL)$/i,
    /[_-](ru|ru-RU)$/i,
    /[_-](ja|ja-JP)$/i,
    /[_-](ko|ko-KR)$/i,
    /[_-](zh|zh-CN|zh-Hans|zh-TW|zh-Hant)$/i,
    /[_-](ar|ar-SA)$/i,
    /[_-](he|he-IL)$/i,
    /[_-](hi|hi-IN)$/i,
    /[_-](th|th-TH)$/i,
    /[_-](vi|vi-VN)$/i,
    /[_-](id|id-ID)$/i,
    /[_-](ms|ms-MY)$/i,
    /[_-](tr|tr-TR)$/i,
    /[_-](sv|sv-SE)$/i,
    /[_-](da|da-DK)$/i,
    /[_-](fi|fi-FI)$/i,
    /[_-](no|no-NO|nb|nn)$/i,
    /[_-](uk|uk-UA)$/i,
    /[_-](cs|cs-CZ)$/i,
    /[_-](el|el-GR)$/i,
    /[_-](ro|ro-RO)$/i,
    /[_-](hu|hu-HU)$/i,
    /[_-](sk|sk-SK)$/i,
    /[_-](ca|ca-ES)$/i,
    /[_-](hr|hr-HR)$/i,
  ];

  for (const pattern of langPatterns) {
    if (pattern.test(withoutExt)) {
      return withoutExt.replace(pattern, '');
    }
  }

  return withoutExt;
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Clamp number between min and max
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Linear interpolation
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

// Map value from one range to another
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

// Generate gradient CSS string
export function generateGradientCSS(
  type: 'linear' | 'radial',
  angle: number,
  stops: Array<{ color: string; position: number }>
): string {
  const sortedStops = [...stops].sort((a, b) => a.position - b.position);
  const stopsStr = sortedStops.map((s) => `${s.color} ${s.position}%`).join(', ');

  if (type === 'linear') {
    return `linear-gradient(${angle}deg, ${stopsStr})`;
  } else {
    return `radial-gradient(circle, ${stopsStr})`;
  }
}

// Parse hex color to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// RGB to hex
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

// Download file
export function downloadFile(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Download blob
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  downloadFile(url, filename);
  URL.revokeObjectURL(url);
}
