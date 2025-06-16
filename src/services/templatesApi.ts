
import { toast } from "@/components/ui/sonner";
import { apiRequest as baseApiRequest, getAuthHeaders } from "@/api/api";

const handleApiError = (error: any) => {
  console.error('Templates API Error:', error);
  const message = error.message || 'An error occurred';
  toast.error(message);
  throw error;
};

const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
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
    throw error; // Ensure we always throw after handling
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
  getList: (page: number = 1, limit: number = 20): Promise<TemplateListItem[]> => 
    apiRequest<TemplateListItem[]>(`/templates/?page=${page}&limit=${limit}&fields=id,name,subject,created_at,char_length(html) as length`),
  
  // Lazy loading for full template data
  getPreview: (id: string): Promise<TemplatePreview> => 
    apiRequest<TemplatePreview>(`/templates/${id}/preview/`),
  
  getById: (id: string) => apiRequest<any>(`/templates/${id}/`),
  
  create: (data: any) => apiRequest<any>('/templates/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: any) => apiRequest<any>(`/templates/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => apiRequest<void>(`/templates/${id}/`, { 
    method: 'DELETE' 
  }),
  
  getSequence: (id: string) => apiRequest<any>(`/templates/${id}/sequence/`),
  
  saveSequence: (id: string, steps: any[]) => apiRequest<any>(`/templates/${id}/sequence/`, {
    method: 'POST',
    body: JSON.stringify({ steps }),
  }),
};
