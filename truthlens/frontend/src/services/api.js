import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const CONFIGURATION_ERROR_MESSAGE =
  'Frontend configuration error: VITE_API_URL is not set. Please set it to your deployed Render.com backend URL.';
const TIMEOUT_ERROR_MESSAGE =
  'Analysis timed out after 45 seconds. The server may be starting up (this can take 30-40 seconds on first use). Please try again.';

if (!API_BASE_URL && import.meta.env.PROD) {
  console.error(
    '[TruthLens] CRITICAL: VITE_API_URL is not set. ' +
      'All API calls will fail. ' +
      'Set this in your Netlify/Vercel environment variables to your Render.com backend URL.'
  );
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000,
  headers: { 'Content-Type': 'application/json' },
});

function ensureApiBaseUrl() {
  if (!API_BASE_URL && import.meta.env.PROD) {
    throw new Error(CONFIGURATION_ERROR_MESSAGE);
  }
}

function normalizeApiError(error) {
  if (error?.message === CONFIGURATION_ERROR_MESSAGE) {
    return error;
  }

  if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
    return new Error(TIMEOUT_ERROR_MESSAGE);
  }

  if (error?.response?.status === 400) {
    return new Error('Invalid input. Please check your text or URL.');
  }

  if (error?.response?.status === 422) {
    return new Error('Input validation failed. Please check your text.');
  }

  if (error?.response?.status === 503) {
    return new Error('AI analysis service is temporarily unavailable. Please try again.');
  }

  if (error?.response?.status === 504) {
    return new Error(TIMEOUT_ERROR_MESSAGE);
  }

  if (error?.response === undefined) {
    return new Error(
      'Cannot reach the analysis server. Please check your connection or verify that the backend URL is configured correctly.'
    );
  }

  return new Error(error.response?.data?.detail || 'An unexpected error occurred.');
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    throw normalizeApiError(error);
  }
);

export async function analyzeContent(input) {
  ensureApiBaseUrl();
  const response = await api.post('/api/analyze', { input });
  return response.data;
}

export async function getHealth() {
  ensureApiBaseUrl();
  const response = await api.get('/api/health');
  return response.data;
}

export async function getServerHistory() {
  ensureApiBaseUrl();
  const response = await api.get('/api/history');
  return response.data.analyses;
}

export async function clearServerHistory() {
  ensureApiBaseUrl();
  await api.delete('/api/history');
}
