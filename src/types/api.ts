// API response types
export interface APIResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

// Paginated response interface
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
}

// Lead type definition
export interface Lead {
  id: string;
  email: string;
  bedrijf: string | null;
  website: string | null;
  linkedin: string | null;
  image_path: string | null;
  created_at: string;
}

// Lead list response type
export type LeadListResponse = PaginatedResponse<Lead>;

// Template type definition
export interface Template {
  id: string;
  name: string;
  subject: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// Template list response type
export type TemplateListResponse = PaginatedResponse<Template>;
