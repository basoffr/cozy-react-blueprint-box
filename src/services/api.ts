
import { toast } from "@/components/ui/sonner";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.mydomain.com';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleApiError = (error: any) => {
  console.error('API Error:', error);
  const message = error.message || 'An error occurred';
  toast.error(message);
  throw error;
};

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    handleApiError(error);
  }
};

// Dashboard API
export const dashboardApi = {
  getOverview: () => apiRequest('/api/stats/overview'),
};

// Campaigns API
export const campaignsApi = {
  getAll: () => apiRequest('/api/campaigns'),
  create: (data: { template_id: string; list_id: string; schedule_at?: string }) =>
    apiRequest('/api/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Templates API
export const templatesApi = {
  getAll: () => apiRequest('/api/templates'),
  preview: (id: string) => apiRequest(`/api/templates/${id}/preview`, { method: 'POST' }),
  delete: (id: string) => apiRequest(`/api/templates/${id}`, { method: 'DELETE' }),
};

// Leads API
export const leadsApi = {
  getAll: (page: number = 1, size: number = 50) =>
    apiRequest(`/api/leads?page=${page}&size=${size}`),
  getLists: () => apiRequest('/api/leads/lists'),
  import: (file: File, listName?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (listName) {
      formData.append('list_name', listName);
    }
    
    return fetch(`${API_BASE_URL}/api/leads/import`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    }).then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
      return response.json();
    }).catch(handleApiError);
  },
};

// Statistics API
export const statisticsApi = {
  getDaily: (range: string = '30d') => apiRequest(`/api/stats/daily?range=${range}`),
};

// Settings API
export const settingsApi = {
  get: () => apiRequest('/api/settings'),
  update: (data: any) => apiRequest('/api/settings', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};
