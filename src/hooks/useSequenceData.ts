
import { useQuery } from '@tanstack/react-query';
import { sendersApi } from '@/services/api';
import { apiRequest } from '@/api/api';

// Using centralized apiRequest which handles auth headers

export const useSequenceData = (id: string | undefined) => {
  // Fetch template data
  const templateQuery = useQuery({
    queryKey: ['template', id],
    queryFn: async () => {
      return apiRequest(`/templates/${id}`);
    },
    enabled: !!id,
  });

  // Fetch senders
  const sendersQuery = useQuery({
    queryKey: ['senders'],
    queryFn: sendersApi.getAll,
  });

  // Fetch email templates
  const templatesQuery = useQuery({
    queryKey: ['email-templates'],
    queryFn: async () => {
      return apiRequest(`/templates?type=email`);
    },
  });

  // Load existing sequence
  const sequenceQuery = useQuery({
    queryKey: ['sequence', id],
    queryFn: async () => {
      try {
        return await apiRequest(`/templates/${id}/sequence`);
      } catch (error) {
        // Handle 404 case for sequences that don't exist yet
        if (error instanceof Error && error.message.includes('404')) {
          return { steps: [] };
        }
        throw error;
      }
    },
    enabled: !!id,
  });

  return {
    template: templateQuery.data,
    senders: sendersQuery.data,
    templates: templatesQuery.data,
    existingSequence: sequenceQuery.data,
    isLoading: templateQuery.isLoading || sendersQuery.isLoading || templatesQuery.isLoading || sequenceQuery.isLoading,
  };
};
