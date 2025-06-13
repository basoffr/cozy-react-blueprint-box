
import { toast } from "@/components/ui/sonner";
import { apiRequest as baseApiRequest, getAuthHeaders } from "@/api/api";

const handleApiError = (error: any) => {
  console.error('Templates API Error:', error);
  const message = error.message || 'An error occurred';
  toast.error(message);
  throw error;
};

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  try {
    const response = await baseApiRequest(endpoint, config);
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
    apiRequest(`/templates/?page=${page}&limit=${limit}&fields=id,name,subject,created_at,char_length(html) as length`),
  
  // Lazy loading for full template data
  getPreview: (id: string): Promise<TemplatePreview> => 
    apiRequest(`/templates/${id}/preview/`),
  
  getById: (id: string) => apiRequest(`/templates/${id}/`),
  
  create: (data: any) => apiRequest('/templates/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: any) => apiRequest(`/templates/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => apiRequest(`/templates/${id}/`, { 
    method: 'DELETE' 
  }),
  
  getSequence: (id: string) => apiRequest(`/templates/${id}/sequence/`),
  
  saveSequence: (id: string, steps: any[]) => apiRequest(`/templates/${id}/sequence/`, {
    method: 'POST',
    body: JSON.stringify({ steps }),
  }),
};
