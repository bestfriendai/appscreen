import { logger } from './logger';

/**
 * Analyzes an image URL and returns a CSS background-position string
 * that centers the most visually interesting area (highest edge density).
 */
export async function getSmartCropPosition(imageUrl: string, canvasWidth: number, canvasHeight: number): Promise<string> {
  try {
    const img = await loadImage(imageUrl);
    const { naturalWidth: w, naturalHeight: h } = img;

    // Downsample for performance
    const sampleSize = 256;
    const canvas = new OffscreenCanvas(sampleSize, sampleSize * (h / w));
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'center center';

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    return new Promise((resolve, reject) => {
        const worker = new Worker(new URL('../workers/smartCrop.worker.ts', import.meta.url), { type: 'module' });

        worker.onmessage = (e) => {
            if (e.data.error) {
                logger.error('Smart crop worker error', e.data.error);
                resolve('center center');
            } else {
                resolve(e.data.position);
            }
            worker.terminate();
        };

        worker.onerror = (err) => {
            logger.error('Smart crop worker error', err);
            resolve('center center');
            worker.terminate();
        };

        // Transferable buffer for performance
        // worker.postMessage({ imageData: imageData.data, width: canvas.width, height: canvas.height }, [imageData.data.buffer]);
        // Note: imageData.data is a readonly view, we might need to copy it if we want transferable.
        // For small 256px image, copying is negligible.
        worker.postMessage({ imageData: imageData.data, width: canvas.width, height: canvas.height });
    });

  } catch (e) {
    logger.warn('Smart crop failed, falling back to center', e);
    return 'center center';
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
