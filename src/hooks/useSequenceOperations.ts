
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from '@/components/ui/sonner';
import { SequenceStep, useSequence } from '@/contexts/SequenceContext';
import { apiRequest } from '@/api/api';

// Using centralized apiRequest which handles auth headers

export const useSequenceOperations = (id: string | undefined, isNewTemplate: boolean, templateName: string) => {
  const navigate = useNavigate();
  const { addStep, markSaved } = useSequence();

  // Validation function
  const validateSequence = useCallback((steps: SequenceStep[]): string[] => {
    const errors: string[] = [];
    
    steps.forEach((step, index) => {
      if (step.type === 'email') {
        if (step.senders.length === 0) {
          errors.push(`Step ${index + 1}: At least one sender is required`);
        }
        if (step.senders.length > 5) {
          errors.push(`Step ${index + 1}: Maximum 5 senders allowed`);
        }
        if (step.templateIds.length === 0) {
          errors.push(`Step ${index + 1}: At least one template is required`);
        }
        if (step.templateIds.length > 3) {
          errors.push(`Step ${index + 1}: Maximum 3 templates allowed per step`);
        }
      }
    });
    
    return errors;
  }, []);

  // Save sequence mutation
  const saveSequenceMutation = useMutation({
    mutationFn: async (steps: SequenceStep[]) => {
      // Validate steps before saving
      const validationErrors = validateSequence(steps);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      if (isNewTemplate) {
        // Create a new template first
        if (!templateName.trim()) {
          throw new Error('Template name is required');
        }

        const newTemplate = await apiRequest<{ id: string }>('/templates', {
          method: 'POST',
          body: JSON.stringify({ 
            name: templateName,
            type: 'sequence',
          }),
        });
        
        // Now save the sequence with the new template ID
        return apiRequest(`/templates/${newTemplate.id}/sequence`, {
          method: 'POST',
          body: JSON.stringify({ steps }),
        });
      } else {
        // Update existing template sequence
        return apiRequest(`/templates/${id}/sequence`, {
          method: 'POST',
          body: JSON.stringify({ steps }),
        });
      }
    },
    onSuccess: () => {
      toast.success('Sequence saved');
      markSaved();
      // Navigate back to templates
      navigate('/templates');
    },
    onError: (error: any) => {
      console.error('Save sequence error:', error);
      toast.error(error.message || 'Failed to save sequence');
    },
  });

  const handleAddEmailStep = useCallback(() => {
    const newStep: SequenceStep = {
      id: `step-${Date.now()}`,
      type: 'email',
      senders: [],
      templateIds: [],
    };
    addStep(newStep);
  }, [addStep]);

  const handleAddWaitStep = useCallback(() => {
    const newStep: SequenceStep = {
      id: `step-${Date.now()}`,
      type: 'wait',
      senders: [],
      templateIds: [],
      delayHours: 24,
    };
    addStep(newStep);
  }, [addStep]);

  return {
    saveSequenceMutation,
    validateSequence,
    handleAddEmailStep,
    handleAddWaitStep,
  };
};
