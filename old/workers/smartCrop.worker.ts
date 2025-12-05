// Lightweight client-side saliency/cropping helper.
// Uses simple edge detection and center-of-mass weighting to find "interesting" parts of an image.

self.onmessage = async (e: MessageEvent) => {
  const { imageData, width, height } = e.data;

  try {
    const centerX = findCenterOfMass(imageData, width, height);
    const xPercent = (centerX / width) * 100;
    const safeX = Math.max(10, Math.min(90, xPercent));

    self.postMessage({ position: `${safeX.toFixed(0)}% center` });
  } catch (error) {
    self.postMessage({ error: (error as Error).message });
  }
};

function findCenterOfMass(data: Uint8ClampedArray, width: number, height: number): number {
  let totalEnergy = 0;
  let weightedSumX = 0;

  // Stride for perf
  const stride = 4;

  for (let y = 0; y < height; y += stride) {
    for (let x = 0; x < width; x += stride) {
      const i = (y * width + x) * 4;

      // Simple luminance contrast check with right neighbor
      if (x < width - 1) {
        const lum1 = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
        const i2 = (y * width + (x + 1)) * 4;
        const lum2 = (0.299 * data[i2] + 0.587 * data[i2 + 1] + 0.114 * data[i2 + 2]);

        const energy = Math.abs(lum1 - lum2);

        // Weight towards center slightly to avoid edge noise dominance
        const centerBias = 1 - Math.abs(x - width / 2) / (width / 2) * 0.2;

        const weightedEnergy = energy * centerBias;

        totalEnergy += weightedEnergy;
        weightedSumX += x * weightedEnergy;
      }
    }
  }

  return totalEnergy > 0 ? weightedSumX / totalEnergy : width / 2;
}
