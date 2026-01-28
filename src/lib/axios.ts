import axios from 'axios';

// Génère ou récupère l'ID de session guest pour le panier
const getGuestSessionId = (): string => {
  let sessionId = localStorage.getItem('cart_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('cart_session_id', sessionId);
  }
  return sessionId;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://tondise-api.test/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - ajoute le token ou la session guest
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');

    if (token) {
      // Utilisateur connecté: utiliser le Bearer token
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Guest: utiliser le session ID pour le panier
      config.headers['X-Cart-Session'] = getGuestSessionId();
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - gère les erreurs
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Only redirect on 401 for non-auth endpoints to avoid loops
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/')) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth-storage');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;
