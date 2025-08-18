import { toast } from "@/components/ui/sonner";
import { apiRequest as baseApiRequest, getAuthHeaders } from "@/api/api";
import { Lead, LeadListResponse, TemplateListResponse } from '@/types/api';

const handleApiError = (error: any) => {
  console.error('API Error:', error);
  const message = error.message || 'An error occurred';
  toast.error(message);
  throw error;
};

const apiRequest = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  try {
    // already JSON, do not call .json()
    const response = await baseApiRequest<T>(endpoint, config);
    return response;
  } catch (error) {
    handleApiError(error);
  }
};

// Dashboard API
export const dashboardApi = {
  getOverview: () => apiRequest('/stats/overview/'),
};

// Campaigns API
export const campaignsApi = {
  getAll: () => apiRequest('/campaigns/'),
  create: (data: { template_id: string; list_id: string; schedule_at?: string }) =>
    apiRequest('/campaigns/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Templates API
export const templatesApi = {
  getAll: (page: number = 1, size: number = 50): Promise<TemplateListResponse> =>
    apiRequest<TemplateListResponse>(`/templates/?page=${page}&size=${size}`),
  getEmailTemplates: () => apiRequest('/templates/?type=email'),
  getById: (id: string) => apiRequest(`/templates/${id}/`),
  preview: (id: string) => apiRequest(`/templates/${id}/preview/`, { method: 'POST' }),
  delete: (id: string) => apiRequest(`/templates/${id}/`, { method: 'DELETE' }),
  getSequence: (id: string) => apiRequest(`/templates/${id}/sequence/`),
  saveSequence: (id: string, steps: any[]) => apiRequest(`/templates/${id}/sequence/`, {
    method: 'POST',
    body: JSON.stringify({ steps }),
  }),
};

// Senders API
export const sendersApi = {
  getAll: () => apiRequest('/senders/'),
};

// Leads API
export const leadsApi = {
  getAll: (page: number = 1, size: number = 50): Promise<LeadListResponse> =>
    apiRequest<LeadListResponse>(`/leads/?page=${page}&size=${size}`),
  getById: (id: string) =>
    apiRequest(`/leads/${id}`),
  create: (data: Partial<Lead>) =>
    apiRequest('/leads/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Lead>) =>
    apiRequest(`/leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest(`/leads/${id}`, {
      method: 'DELETE',
    }),
  getLists: () => apiRequest('/leads/lists/'),
  import: (file: File, listName?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (listName) {
      formData.append('list_name', listName);
    }
    
    // Use the new baseApiRequest directly with the endpoint
    return baseApiRequest('/leads/import/', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    }).then((response) => {
      // already JSON, do not call .json()
      return response;
    }).catch(handleApiError);
  },
};

// Statistics API
export const statisticsApi = {
  getDaily: (range: string = '30d') => apiRequest(`/stats/daily/?range=${range}`),
};

// Settings API
export const settingsApi = {
  get: () => apiRequest('/settings/'),
  update: (data: any) => apiRequest('/settings/', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};
