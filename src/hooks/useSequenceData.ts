
import { useQuery } from '@tanstack/react-query';
import { sendersApi } from '@/services/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.mydomain.com';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const useSequenceData = (id: string | undefined) => {
  // Fetch template data
  const templateQuery = useQuery({
    queryKey: ['template', id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/templates/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
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
      const response = await fetch(`${API_BASE_URL}/api/templates?type=email`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    },
  });

  // Load existing sequence
  const sequenceQuery = useQuery({
    queryKey: ['sequence', id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/templates/${id}/sequence`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });
      if (!response.ok) {
        if (response.status === 404) {
          return { steps: [] };
        }
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
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
