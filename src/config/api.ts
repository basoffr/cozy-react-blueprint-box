
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.mydomain.com';

export const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
  },
};
