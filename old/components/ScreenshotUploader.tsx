import React from 'react';
import { Plus, X, Info } from 'lucide-react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { UploadedImage } from '../types';
import ProgressiveImage from './ProgressiveImage';

interface ScreenshotUploaderProps {
  screenshots: UploadedImage[];
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (id: string) => void;
  onReorder: (newOrder: UploadedImage[]) => void;
}

const SortableScreenshot: React.FC<{
  screenshot: UploadedImage;
  index: number;
  onRemove: (id: string) => void;
}> = ({ screenshot, index, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: screenshot.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group aspect-[1290/2796] transition-transform hover:-translate-y-1 cursor-move"
    >
      <ProgressiveImage src={screenshot.url} alt={`Screenshot ${index + 1}`} className="w-full h-full rounded-lg border border-white/10" />
      <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded font-bold">
        {index + 1}
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(screenshot.id);
        }}
        className="absolute top-1 right-1 p-1 bg-red-500/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};

const ScreenshotUploader: React.FC<ScreenshotUploaderProps> = ({
  screenshots,
  onUpload,
  onRemove,
  onReorder,
}) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = screenshots.findIndex((s) => s.id === active.id);
    const newIndex = screenshots.findIndex((s) => s.id === over.id);

    const newScreenshots = [...screenshots];
    const [moved] = newScreenshots.splice(oldIndex, 1);
    newScreenshots.splice(newIndex, 0, moved);

    onReorder(newScreenshots);
  };

  return (
    <div className="space-y-3" data-tour="screenshot-uploader">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          Source Screenshots
        </label>
        <span className="text-[10px] text-gray-600">{screenshots.length} uploaded</span>
      </div>

      {/* Upload Guidelines */}
      <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-[10px] text-primary/80">
            <p className="font-bold mb-1 uppercase tracking-wider font-mono">Protocol:</p>
            <ul className="space-y-0.5 text-primary/60 font-mono">
              <li>• Upload 3-8 screenshots (more = better AI understanding)</li>
              <li>• Show your app's key features in order</li>
              <li>• Use high-resolution images (1080x2340+)</li>
              <li>• Drag to reorder slides</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Screenshots Grid with Drag & Drop */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={screenshots.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-3 gap-3">
            {screenshots.map((screenshot, index) => (
              <SortableScreenshot
                key={screenshot.id}
                screenshot={screenshot}
                index={index}
                onRemove={onRemove}
              />
            ))}
            <label className="aspect-[1290/2796] rounded-lg border border-dashed border-white/10 hover:border-primary hover:bg-primary/5 cursor-pointer flex flex-col items-center justify-center text-gray-600 hover:text-primary transition-all group gap-2">
              <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={onUpload}
                onClick={(e) => {
                  (e.target as HTMLInputElement).value = '';
                }}
              />
            </label>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ScreenshotUploader;
