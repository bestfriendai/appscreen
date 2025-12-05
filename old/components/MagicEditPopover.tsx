import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import Button from './Button';

interface MagicEditPopoverProps {
  slideId: string;
  onClose: () => void;
  onMagicEdit: (slideId: string, instruction: string) => void;
  isLoading: boolean;
}

export const MagicEditPopover: React.FC<MagicEditPopoverProps> = ({ slideId, onClose, onMagicEdit, isLoading }) => {
  const [instruction, setInstruction] = useState('');

  const handleSubmit = () => {
    if (instruction.trim()) {
      onMagicEdit(slideId, instruction);
    }
  };

  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 w-72 p-4 bg-[#1e1e1e] border border-white/10 rounded-lg shadow-xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-semibold text-white">✨ Magic Edit</h4>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
      <textarea
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
        placeholder="e.g., 'Make the title punchier', 'Use a blue background', 'Change to bento grid layout'"
        className="w-full h-20 p-2 text-sm bg-black border border-white/10 rounded-md resize-none focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none text-white transition-all"
        disabled={isLoading}
      />
      <Button
        onClick={handleSubmit}
        className="w-full mt-3 flex items-center justify-center gap-2"
        variant="primary"
        size="sm"
        disabled={isLoading || !instruction.trim()}
      >
        {isLoading ? <Sparkles className="w-4 h-4 animate-pulse" /> : <Sparkles className="w-4 h-4" />}
        {isLoading ? 'Applying Magic...' : 'Apply Magic'}
      </Button>
    </div>
  );
};

export default MagicEditPopover;