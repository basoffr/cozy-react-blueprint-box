
import { useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { SequenceStep } from '@/contexts/SequenceContext';

interface DebouncedDragHandlerProps {
  onStepUpdate: (id: string, updates: Partial<SequenceStep>) => void;
  debounceMs?: number;
}

export const useDebouncedDragHandler = ({ 
  onStepUpdate, 
  debounceMs = 250 
}: DebouncedDragHandlerProps) => {
  
  const debouncedUpdatePosition = useDebouncedCallback(
    (stepId: string, position: { x: number; y: number }) => {
      onStepUpdate(stepId, { position });
    },
    debounceMs
  );

  const handleDragMove = useCallback((stepId: string, x: number, y: number) => {
    // Immediate visual feedback (optimistic update)
    // The debounced callback will handle the actual state update
    debouncedUpdatePosition(stepId, { x, y });
  }, [debouncedUpdatePosition]);

  return { handleDragMove };
};
