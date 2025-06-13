const base = import.meta.env.DEV ? '/api' : 'https://api.mydomain.com';

// Add dev API key header in development mode
const devHeaders: HeadersInit = import.meta.env.DEV
  ? { 'X-API-Key': 'dev-secret' }   // matches .env in Flask backend
  : {};

// Campaign type definition
export interface Campaign {
  id: string;
  name: string;
  description: string | null;
  created_at: string;   // ISO
  updated_at: string;   // ISO
}

export async function apiRequest<T>(
  path: string,
  opts: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    credentials: 'include',        // keep for prod
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...devHeaders,
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  
  // For DELETE requests that return 204 No Content
  if (res.status === 204) return {} as T;
  
  return res.json();
}

export const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Campaign API helpers
export const getCampaigns = () => apiRequest<Campaign[]>('/campaigns');
export const getCampaign = (id: string) => apiRequest<Campaign>(`/campaigns/${id}`);
export const createCampaign = (body: Pick<Campaign, 'name' | 'description'>) =>
    apiRequest<Campaign>('/campaigns', { method: 'POST', body: JSON.stringify(body) });
export const updateCampaign = (id: string, body: Partial<Pick<Campaign, 'name' | 'description'>>) =>
    apiRequest<Campaign>(`/campaigns/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
export const deleteCampaign = (id: string) =>
    apiRequest<void>(`/campaigns/${id}`, { method: 'DELETE' });
