/**
 * ShramAI Centralized API Configuration.
 * 
 * Unified Vercel Full-Stack Architecture:
 * Frontend and Backend are deployed together on Vercel.
 * API endpoints are served under the same origin at /api/v1 and /health.
 * All Render backend references have been removed per user specification.
 */

// Strip trailing slashes from configured base URL, ignoring obsolete Render URLs
const rawEnvUrl = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');
const isRenderUrl = rawEnvUrl.includes('onrender.com') || rawEnvUrl.includes('render');
const envBaseUrl = isRenderUrl ? '' : rawEnvUrl;

// Base URL for the backend server root (empty in unified Vercel deployment)
export const BACKEND_ROOT_URL = envBaseUrl;

// Full URL prefix for API v1 routes (defaults to '/api/v1')
export const API_BASE = envBaseUrl ? `${envBaseUrl}/api/v1` : '/api/v1';

/**
 * Builds an absolute or proxy-relative API URL.
 * Example: getApiUrl('/auth/login') -> '/api/v1/auth/login'
 */
export function getApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (cleanEndpoint.startsWith('/api/v1')) {
    return envBaseUrl ? `${envBaseUrl}${cleanEndpoint}` : cleanEndpoint;
  }
  return `${API_BASE}${cleanEndpoint}`;
}

