import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useStore } from '../store/useStore';
import { GeneratedSlide } from '../types';
import { regenerateSlideCopy, regenerateSlideVisuals } from '../services/geminiService';
import { logger } from '../utils/logger';

export const useMagicEdit = (slide: GeneratedSlide) => {
  const {
    appName,
    description,
    accentColor,
    forcedCategory,
    updateSlide,
    setUpdatingSlideState,
    setEditTitle, // Used for the regular edit modal, but might be useful for magic edit too
    setEditSubtitle, // Same as above
  } = useStore();

  const [isLoading, setIsLoading] = useState(false);

  const applyMagicEdit = async (instruction: string) => {
    setIsLoading(true);
    setUpdatingSlideState({ id: slide.id, message: 'Applying Magic Edit...' });

    try {
      if (instruction.toLowerCase().includes('title') || instruction.toLowerCase().includes('subtitle') || instruction.toLowerCase().includes('copy') || instruction.toLowerCase().includes('text')) {
        // Assume text-based edit
        toast.loading('AI is rethinking the copy...', { id: 'magic-edit' });
        const { title, subtitle } = await regenerateSlideCopy(
          slide.title,
          slide.subtitle,
          appName,
          description // Using description as theme for context
        );
        updateSlide('v3', slide.id, { title, subtitle });
        toast.success('Copy updated magically!', { id: 'magic-edit' });
      } else {
        // Assume visual-based edit
        toast.loading('AI is adjusting the visuals...', { id: 'magic-edit' });
        const updatedVisualProps = await regenerateSlideVisuals(
          slide,
          instruction,
          appName,
          description,
          accentColor,
          forcedCategory
        );
        updateSlide('v3', slide.id, updatedVisualProps);
        toast.success('Visuals updated magically!', { id: 'magic-edit' });
      }
    } catch (error) {
      logger.error(`Magic Edit failed for slide ${slide.id}:`, error);
      toast.error('Magic Edit failed: ' + (error as Error).message, { id: 'magic-edit' });
    } finally {
      setIsLoading(false);
      setUpdatingSlideState(null);
    }
  };

  return { applyMagicEdit, isLoading };
};
