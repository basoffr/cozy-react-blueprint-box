import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCampaigns, getCampaign, createCampaign, updateCampaign, deleteCampaign, Campaign
} from '@/api/api';

export const useCampaigns = () =>
  useQuery({ queryKey: ['campaigns'], queryFn: getCampaigns });

export const useCampaign = (id: string) =>
  useQuery({ queryKey: ['campaign', id], queryFn: () => getCampaign(id), enabled: !!id });

export const useCreateCampaign = () => {
  const qc = useQueryClient();
  return useMutation({ 
    mutationFn: createCampaign,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['campaigns'] }) 
  });
};

export const useUpdateCampaign = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & Partial<Campaign>) => updateCampaign(id, body),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['campaigns'] });
      qc.invalidateQueries({ queryKey: ['campaign', id] });
    },
  });
};

export const useDeleteCampaign = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCampaign,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['campaigns'] }),
  });
};
