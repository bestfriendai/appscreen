import { toast } from 'react-hot-toast';
import { useStore } from '../store/useStore';
import { exportAllSlidesAsZip, exportAllSlidesAsPDF, exportMultipleSizes, DeviceSize } from '../utils/exportUtils';
import { ExportOptions } from '../components/ExportModal';
import { logger } from '../utils/logger';

export const useExportHandler = () => {
  const {
    slidesV1,
    slidesV2,
    slidesV3,
    appName,
    setShowExportModal
  } = useStore();

  const handleExport = async (options: ExportOptions) => {
    const slidesToExport = slidesV3.length > 0 ? slidesV3 : slidesV2.length > 0 ? slidesV2 : slidesV1;

    if (slidesToExport.length === 0) {
      toast.error('No slides to export');
      return;
    }

    try {
      toast.loading('Preparing export...', { id: 'export' });

      const slideElements: HTMLElement[] = [];
      for (let i = 0; i < slidesToExport.length; i++) {
        const canvasEl = document.querySelector(`[data-slide-id="${slidesToExport[i].id}"]`) as HTMLElement;
        if (canvasEl) {
          slideElements.push(canvasEl);
        }
      }

      if (slideElements.length === 0) {
        toast.error('Could not find slide elements', { id: 'export' });
        return;
      }

      switch (options.exportType) {
        case 'all-zip':
          await exportAllSlidesAsZip(slideElements, appName, {
            format: options.format,
            scale: options.scale,
            quality: options.quality,
          });
          toast.success(`Exported ${slideElements.length} slides as ZIP`, { id: 'export' });
          break;

        case 'all-pdf':
          await exportAllSlidesAsPDF(slideElements, appName, { scale: options.scale });
          toast.success(`Exported ${slideElements.length} slides as PDF`, { id: 'export' });
          break;

        case 'multi-size':
          if (!options.deviceSizes || options.deviceSizes.length === 0) {
            toast.error('Please select at least one device size', { id: 'export' });
            return;
          }

          toast.loading(`Exporting ${slideElements.length} slides in ${options.deviceSizes.length} sizes...`, { id: 'export' });

          for (let i = 0; i < slideElements.length; i++) {
            await exportMultipleSizes(
              slideElements[i],
              i,
              appName,
              options.deviceSizes as DeviceSize[],
              options.format
            );
          }

          toast.success(`Exported ${slideElements.length} slides in ${options.deviceSizes.length} sizes`, { id: 'export' });
          break;

        case 'single':
          toast.success('Click on individual slides to export them', { id: 'export' });
          break;
      }

      setShowExportModal(false);
    } catch (error) {
      logger.error('Export failed:', error);
      toast.error('Export failed: ' + (error as Error).message, { id: 'export' });
    }
  };

  return { handleExport };
};
