export interface ExportWorkerMessage {
  type: 'compress' | 'resize';
  id: string;
  data: {
    canvasDataURL: string;
    format: 'png' | 'jpg' | 'webp';
    quality: number;
    targetWidth?: number;
    targetHeight?: number;
  };
}

export interface ExportWorkerResponse {
  id: string;
  type: 'success' | 'error';
  data?: Blob;
  error?: string;
}

self.onmessage = async (e: MessageEvent<ExportWorkerMessage>) => {
  const { type, id, data } = e.data;
  const { canvasDataURL, format, quality, targetWidth, targetHeight } = data;

  try {
    // Create image from data URL
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = canvasDataURL;
    });

    // Create canvas
    const canvas = new OffscreenCanvas(
      type === 'resize' && targetWidth ? targetWidth : img.width,
      type === 'resize' && targetHeight ? targetHeight : img.height
    );
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');

    // Draw image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Convert to blob
    const mimeType = format === 'jpg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
    const blob = await canvas.convertToBlob({ type: mimeType, quality });

    const response: ExportWorkerResponse = {
      id,
      type: 'success',
      data: blob
    };
    self.postMessage(response);
  } catch (error) {
    const response: ExportWorkerResponse = {
      id,
      type: 'error',
      error: (error as Error).message
    };
    self.postMessage(response);
  }
};
