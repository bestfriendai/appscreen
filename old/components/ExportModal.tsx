import React, { useState } from 'react';
import { X, Download, FileText, Image as ImageIcon, FileArchive, Check } from 'lucide-react';
import Button from './Button';
import { DEVICE_SIZES, DeviceSize, ExportFormat } from '../utils/exportUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: ExportOptions) => void;
  slideCount: number;
  appName: string;
}

export interface ExportOptions {
  exportType: 'single' | 'all-zip' | 'all-pdf' | 'multi-size';
  format: ExportFormat;
  quality: number;
  deviceSizes: DeviceSize[];
  scale: number;
}

export default function ExportModal({
  isOpen,
  onClose,
  onExport,
  slideCount,
  appName,
}: ExportModalProps) {
  const [exportType, setExportType] = useState<'single' | 'all-zip' | 'all-pdf' | 'multi-size'>('all-zip');
  const [format, setFormat] = useState<ExportFormat>('png');
  const [quality, setQuality] = useState(0.95);
  const [selectedDeviceSizes, setSelectedDeviceSizes] = useState<DeviceSize[]>(['iphone-6.7']);
  const [scale, setScale] = useState(2); // Retina

  if (!isOpen) return null;

  const toggleDeviceSize = (size: DeviceSize) => {
    setSelectedDeviceSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const handleExport = () => {
    onExport({
      exportType,
      format,
      quality,
      deviceSizes: selectedDeviceSizes,
      scale,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-2xl p-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Download className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display tracking-wide">EXPORT SCREENSHOTS</h3>
              <p className="text-xs text-gray-500 font-mono">{slideCount} slides ready</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Type Selection */}
        <div className="space-y-4 mb-6">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">
            Export Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setExportType('all-zip')}
              className={`p-4 rounded-xl border-2 transition-all group relative overflow-hidden ${
                exportType === 'all-zip'
                  ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(0,209,255,0.1)]'
                  : 'border-white/10 bg-black/20 hover:border-white/20'
              }`}
            >
              {exportType === 'all-zip' && <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50"></div>}
              <FileArchive className={`w-6 h-6 mb-2 ${exportType === 'all-zip' ? 'text-primary' : 'text-gray-400'}`} />
              <div className="text-sm font-bold text-white font-display tracking-wide">ZIP ARCHIVE</div>
              <div className="text-xs text-gray-500 font-mono">Bundle all screenshots</div>
            </button>

            <button
              onClick={() => setExportType('all-pdf')}
              className={`p-4 rounded-xl border-2 transition-all group relative overflow-hidden ${
                exportType === 'all-pdf'
                  ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(0,209,255,0.1)]'
                  : 'border-white/10 bg-black/20 hover:border-white/20'
              }`}
            >
              {exportType === 'all-pdf' && <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50"></div>}
              <FileText className={`w-6 h-6 mb-2 ${exportType === 'all-pdf' ? 'text-primary' : 'text-gray-400'}`} />
              <div className="text-sm font-bold text-white font-display tracking-wide">PDF DOCUMENT</div>
              <div className="text-xs text-gray-500 font-mono">Single PDF document</div>
            </button>

            <button
              onClick={() => setExportType('multi-size')}
              className={`p-4 rounded-xl border-2 transition-all group relative overflow-hidden ${
                exportType === 'multi-size'
                  ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(0,209,255,0.1)]'
                  : 'border-white/10 bg-black/20 hover:border-white/20'
              }`}
            >
              {exportType === 'multi-size' && <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50"></div>}
              <ImageIcon className={`w-6 h-6 mb-2 ${exportType === 'multi-size' ? 'text-primary' : 'text-gray-400'}`} />
              <div className="text-sm font-bold text-white font-display tracking-wide">MULTI-DEVICE</div>
              <div className="text-xs text-gray-500 font-mono">App Store sizes</div>
            </button>

            <button
              onClick={() => setExportType('single')}
              className={`p-4 rounded-xl border-2 transition-all group relative overflow-hidden ${
                exportType === 'single'
                  ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(0,209,255,0.1)]'
                  : 'border-white/10 bg-black/20 hover:border-white/20'
              }`}
            >
              {exportType === 'single' && <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50"></div>}
              <ImageIcon className={`w-6 h-6 mb-2 ${exportType === 'single' ? 'text-primary' : 'text-gray-400'}`} />
              <div className="text-sm font-bold text-white font-display tracking-wide">INDIVIDUAL</div>
              <div className="text-xs text-gray-500 font-mono">Export one by one</div>
            </button>
          </div>
        </div>

        {/* Format Selection */}
        {exportType !== 'all-pdf' && (
          <div className="space-y-4 mb-6">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">
              Format
            </label>
            <div className="flex gap-2">
              {(['png', 'jpg', 'webp'] as ExportFormat[]).map(fmt => (
                <button
                  key={fmt}
                  onClick={() => setFormat(fmt)}
                  className={`flex-1 py-3 rounded-lg border transition-all text-xs font-bold uppercase ${
                    format === fmt
                      ? 'bg-primary border-primary text-black'
                      : 'bg-black/20 border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quality Slider (for JPG/WebP) */}
        {(format === 'jpg' || format === 'webp') && exportType !== 'all-pdf' && (
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">
                Quality
              </label>
              <span className="text-sm text-primary font-bold">{Math.round(quality * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1"
              step="0.05"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full accent-primary h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}

        {/* Resolution Scale */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">
              Resolution
            </label>
            <span className="text-sm text-primary font-bold">
              {scale === 1 ? 'Standard' : `Retina (${scale}x)`}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setScale(1)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                scale === 1
                  ? 'bg-primary text-black'
                  : 'bg-black/20 border border-white/10 text-gray-400'
              }`}
            >
              Standard (1x)
            </button>
            <button
              onClick={() => setScale(2)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                scale === 2
                  ? 'bg-primary text-black'
                  : 'bg-black/20 border border-white/10 text-gray-400'
              }`}
            >
              Retina (2x)
            </button>
          </div>
        </div>

        {/* Device Sizes (for multi-size export) */}
        {exportType === 'multi-size' && (
          <div className="space-y-4 mb-6">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">
              Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedDeviceSizes(['iphone-6.7','iphone-6.5','iphone-5.5','ipad-12.9','ipad-11'])}
                className="p-3 rounded-lg border border-white/10 bg-black/20 hover:border-white/20 text-xs text-gray-300 font-mono"
              >App Store Set</button>
              <button
                onClick={() => setSelectedDeviceSizes(['social-story','social-landscape','social-square'])}
                className="p-3 rounded-lg border border-white/10 bg-black/20 hover:border-white/20 text-xs text-gray-300 font-mono"
              >Social Pack</button>
            </div>

            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">
              Device Sizes (Select Multiple)
            </label>
            <div className="space-y-2">
              {(Object.keys(DEVICE_SIZES) as DeviceSize[]).filter(key => key !== 'current').map(sizeKey => {
                const size = DEVICE_SIZES[sizeKey];
                const isSelected = selectedDeviceSizes.includes(sizeKey);
                return (
                  <button
                    key={sizeKey}
                    onClick={() => toggleDeviceSize(sizeKey)}
                    className={`w-full p-3 rounded-lg border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-white/10 bg-black/20 hover:border-white/20'
                    }`}
                  >
                    <div className="text-left">
                      <div className="text-sm font-bold text-white">{size.name}</div>
                      <div className="text-xs text-gray-500 font-mono">{size.width} × {size.height}px</div>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Export Info */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="p-1 bg-primary/20 rounded">
              <ImageIcon className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-white mb-1 font-display tracking-wide">EXPORT SUMMARY</div>
              <div className="text-xs text-gray-400 space-y-1 font-mono">
                {exportType === 'all-zip' && (
                  <p>• Exporting {slideCount} slides as {format.toUpperCase()} in a ZIP file</p>
                )}
                {exportType === 'all-pdf' && (
                  <p>• Exporting {slideCount} slides in a single PDF document</p>
                )}
                {exportType === 'multi-size' && (
                  <p>• Exporting {slideCount} slides in {selectedDeviceSizes.length} device size(s)</p>
                )}
                {exportType === 'single' && (
                  <p>• Export slides individually by clicking the download button on each slide</p>
                )}
                <p>• Resolution: {scale === 2 ? 'Retina' : 'Standard'} ({scale}x)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="secondary"
            className="flex-1 bg-black/50 text-gray-300 hover:bg-black/70"
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            variant="primary"
            className="flex-1 bg-primary text-black hover:bg-primary/80 font-bold tracking-wide"
            disabled={exportType === 'multi-size' && selectedDeviceSizes.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Now
          </Button>
        </div>
      </div>
    </div>
  );
}
