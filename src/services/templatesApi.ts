
import { toast } from "@/components/ui/sonner";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.mydomain.com';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleApiError = (error: any) => {
  console.error('Templates API Error:', error);
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

export interface TemplateListItem {
  id: string;
  name: string;
  subject: string;
  createdAt: string;
  length: number;
}

export interface TemplatePreview {
  id: string;
  html: string;
}

export const templatesApi = {
  // Optimized list query - only fetch essential fields
  getList: (page: number = 1, limit: number = 20) => 
    apiRequest(`/api/templates?page=${page}&limit=${limit}&fields=id,name,subject,created_at,char_length(html) as length`),
  
  // Lazy loading for full template data
  getPreview: (id: string): Promise<TemplatePreview> => 
    apiRequest(`/api/templates/${id}/preview`),
  
  getById: (id: string) => apiRequest(`/api/templates/${id}`),
  
  create: (data: any) => apiRequest('/api/templates', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: any) => apiRequest(`/api/templates/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => apiRequest(`/api/templates/${id}`, { 
    method: 'DELETE' 
  }),
  
  getSequence: (id: string) => apiRequest(`/api/templates/${id}/sequence`),
  
  saveSequence: (id: string, steps: any[]) => apiRequest(`/api/templates/${id}/sequence`, {
    method: 'POST',
    body: JSON.stringify({ steps }),
  }),
};
