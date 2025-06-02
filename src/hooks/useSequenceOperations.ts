
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from '@/components/ui/sonner';
import { SequenceStep, useSequence } from '@/contexts/SequenceContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.mydomain.com';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

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

        const createTemplateResponse = await fetch(`${API_BASE_URL}/api/templates`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify({ 
            name: templateName,
            type: 'sequence',
          }),
        });

        if (!createTemplateResponse.ok) {
          const errorData = await createTemplateResponse.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP ${createTemplateResponse.status}`);
        }

        const newTemplate = await createTemplateResponse.json();
        
        // Now save the sequence with the new template ID
        const saveSequenceResponse = await fetch(`${API_BASE_URL}/api/templates/${newTemplate.id}/sequence`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify({ steps }),
        });

        if (!saveSequenceResponse.ok) {
          const errorData = await saveSequenceResponse.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP ${saveSequenceResponse.status}`);
        }

        return saveSequenceResponse.json();
      } else {
        // Update existing template sequence
        const response = await fetch(`${API_BASE_URL}/api/templates/${id}/sequence`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify({ steps }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP ${response.status}`);
        }

        return response.json();
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
