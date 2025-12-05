import { useRef, useCallback } from 'react';
import type { ExportWorkerMessage, ExportWorkerResponse } from '../workers/export.worker';

// Note: In Vite, workers are imported with ?worker suffix
// import ExportWorker from '../workers/export.worker.ts?worker';

export function useExportWorker() {
  const workerRef = useRef<Worker | null>(null);
  const pendingCallbacks = useRef<Map<string, (response: ExportWorkerResponse) => void>>(new Map());

  const initWorker = useCallback(() => {
    if (!workerRef.current) {
      try {
        // Create worker from file
        workerRef.current = new Worker(
          new URL('../workers/export.worker.ts', import.meta.url),
          { type: 'module' }
        );

        workerRef.current.onmessage = (e: MessageEvent<ExportWorkerResponse>) => {
          const callback = pendingCallbacks.current.get(e.data.id);
          if (callback) {
            callback(e.data);
            pendingCallbacks.current.delete(e.data.id);
          }
        };

        workerRef.current.onerror = (error) => {
          console.error('Export worker error:', error);
        };
      } catch (error) {
        console.error('Failed to create export worker:', error);
      }
    }
    return workerRef.current;
  }, []);

  const compressImage = useCallback(
    (canvasDataURL: string, format: 'png' | 'jpg' | 'webp' = 'png', quality: number = 0.95): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        const worker = initWorker();
        if (!worker) {
          reject(new Error('Worker not available'));
          return;
        }

        const id = Math.random().toString(36).substring(7);

        pendingCallbacks.current.set(id, (response) => {
          if (response.type === 'success' && response.data instanceof Blob) {
            resolve(response.data);
          } else if (response.type === 'error') {
            reject(new Error(response.error || 'Unknown error'));
          }
        });

        const message: ExportWorkerMessage = {
          type: 'compress',
          id,
          data: { canvasDataURL, format, quality },
        };

        worker.postMessage(message);

        // Timeout after 30 seconds
        setTimeout(() => {
          if (pendingCallbacks.current.has(id)) {
            pendingCallbacks.current.delete(id);
            reject(new Error('Worker timeout'));
          }
        }, 30000);
      });
    },
    [initWorker]
  );

  const resizeImage = useCallback(
    (
      canvasDataURL: string,
      targetWidth: number,
      targetHeight: number,
      format: 'png' | 'jpg' | 'webp' = 'png',
      quality: number = 0.95
    ): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        const worker = initWorker();
        if (!worker) {
          reject(new Error('Worker not available'));
          return;
        }

        const id = Math.random().toString(36).substring(7);

        pendingCallbacks.current.set(id, (response) => {
          if (response.type === 'success' && response.data instanceof Blob) {
            resolve(response.data);
          } else if (response.type === 'error') {
            reject(new Error(response.error || 'Unknown error'));
          }
        });

        const message: ExportWorkerMessage = {
          type: 'resize',
          id,
          data: { canvasDataURL, targetWidth, targetHeight, format, quality },
        };

        worker.postMessage(message);

        // Timeout after 30 seconds
        setTimeout(() => {
          if (pendingCallbacks.current.has(id)) {
            pendingCallbacks.current.delete(id);
            reject(new Error('Worker timeout'));
          }
        }, 30000);
      });
    },
    [initWorker]
  );

  const terminateWorker = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
  }, []);

  return {
    compressImage,
    resizeImage,
    terminateWorker,
  };
}
