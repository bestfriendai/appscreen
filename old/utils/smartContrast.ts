export interface ContrastResult {
  textColor: string;
  shadow: string;
  overlay?: string; // If we need a scrim
}

export async function analyzeContrast(
  bgUrl: string,
  rect: { x: number; y: number; w: number; h: number },
  canvasW: number,
  canvasH: number
): Promise<ContrastResult> {
  // Default fallback
  const DEFAULT_RESULT = {
    textColor: '#FFFFFF',
    shadow: '0 2px 4px rgba(0,0,0,0.5)',
  };

  try {
    const img = await loadImage(bgUrl);
    const canvas = new OffscreenCanvas(100, 100); // Low res sampling
    const ctx = canvas.getContext('2d');
    if (!ctx) return DEFAULT_RESULT;

    // Draw full image scaled down
    ctx.drawImage(img, 0, 0, 100, 100);
    
    // Map relative rect coordinates to this 100x100 canvas
    // (assuming rect is in original canvas coords)
    const sx = Math.floor((rect.x / canvasW) * 100);
    const sy = Math.floor((rect.y / canvasH) * 100);
    const sw = Math.floor((rect.w / canvasW) * 100);
    const sh = Math.floor((rect.h / canvasH) * 100);

    const data = ctx.getImageData(sx, sy, Math.max(1, sw), Math.max(1, sh)).data;
    
    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i+1];
      b += data[i+2];
      count++;
    }

    if (count === 0) return DEFAULT_RESULT;

    r /= count;
    g /= count;
    b /= count;

    // Calculate relative luminance (WCAG definition)
    // https://www.w3.org/TR/WCAG20/#relativeluminancedef
    const lum = 0.2126 * (r/255) + 0.7152 * (g/255) + 0.0722 * (b/255);

    if (lum > 0.5) {
      // Bright background -> Dark text
      return {
        textColor: '#000000',
        shadow: '0 1px 2px rgba(255,255,255,0.5)',
        overlay: lum > 0.8 ? undefined : 'linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)'
      };
    } else {
      // Dark background -> White text
      return {
        textColor: '#FFFFFF',
        shadow: '0 2px 10px rgba(0,0,0,0.5)',
        overlay: lum < 0.2 ? undefined : 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)'
      };
    }

  } catch (e) {
    console.warn("Contrast analysis failed", e);
    return DEFAULT_RESULT;
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
