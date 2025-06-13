const base = import.meta.env.DEV ? '/api' : 'https://api.mydomain.com';

// Add dev API key header in development mode
const devHeaders: HeadersInit = import.meta.env.DEV
  ? { 'X-API-Key': 'dev-secret' }   // matches .env in Flask backend
  : {};

export async function apiRequest(
  path: string,
  opts: RequestInit = {}
): Promise<Response> {
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
  return res;
}

export const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};
