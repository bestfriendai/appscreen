// Lightweight client-side image enhancement helpers
// Applies contrast/sat/brightness adjustments and a mild sharpen via convolution.

export interface EnhanceOptions {
  contrast?: number;   // 1.0 = no change
  saturation?: number; // 1.0 = no change
  brightness?: number; // 1.0 = no change
  sharpen?: number;    // 0..1 strength
}

const DEFAULTS: Required<EnhanceOptions> = {
  contrast: 1.08,
  saturation: 1.12,
  brightness: 1.03,
  sharpen: 0.35,
};

export async function enhanceImageDataUrl(dataUrl: string, opts: EnhanceOptions = {}): Promise<string> {
  const options = { ...DEFAULTS, ...opts };

  // Create image element
  const img = await loadImage(dataUrl);
  const width = img.naturalWidth || 1290;
  const height = img.naturalHeight || 2796;

  // Use OffscreenCanvas where available for perf
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return dataUrl;

  // Step 1: global filters (contrast/saturation/brightness)
  // Note: Canvas filter order matters; keep blur last when used.
  ctx.filter = `contrast(${options.contrast}) saturate(${options.saturation}) brightness(${options.brightness})`;
  ctx.drawImage(img, 0, 0, width, height);
  ctx.filter = 'none';

  // Step 2: mild sharpen convolution (optional)
  if (options.sharpen > 0) {
    try {
      const imageData = ctx.getImageData(0, 0, width, height);
      const sharpened = applySharpen(imageData, options.sharpen);
      ctx.putImageData(sharpened, 0, 0);
    } catch {
      // Ignore if cross-origin or disabled
    }
  }

  return canvas.toDataURL('image/png');
}

function applySharpen(src: ImageData, strength: number): ImageData {
  // Unsharp mask style kernel; strength blends with identity
  // Base kernel 3x3 sharpen
  const k = [
    0, -1, 0,
    -1, 5, -1,
    0, -1, 0,
  ];

  // Blend with identity depending on strength
  const kernel = k.map(v => 1 * (1 - strength) + v * strength);
  return convolve(src, kernel, 3);
}

function convolve(src: ImageData, kernel: number[], size: number): ImageData {
  const { width, height, data } = src;
  const out = new ImageData(width, height);
  const half = Math.floor(size / 2);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let ky = -half; ky <= half; ky++) {
        for (let kx = -half; kx <= half; kx++) {
          const ix = Math.min(width - 1, Math.max(0, x + kx));
          const iy = Math.min(height - 1, Math.max(0, y + ky));
          const i = (iy * width + ix) * 4;
          const w = kernel[(ky + half) * size + (kx + half)];
          r += data[i] * w;
          g += data[i + 1] * w;
          b += data[i + 2] * w;
          a += data[i + 3] * (w > 0 ? w : 0); // keep alpha reasonable
        }
      }
      const o = (y * width + x) * 4;
      out.data[o] = clamp(r);
      out.data[o + 1] = clamp(g);
      out.data[o + 2] = clamp(b);
      out.data[o + 3] = data[o + 3];
    }
  }
  return out;
}

function clamp(v: number): number {
  return v < 0 ? 0 : v > 255 ? 255 : v | 0;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.crossOrigin = 'anonymous';
    img.src = src;
  });
}
