import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 35000,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 400) {
      throw new Error("Invalid input. Please check your text or URL.");
    }
    if (error.response?.status === 422) {
      throw new Error("Input validation failed. Please check your text.");
    }
    if (error.response?.status === 503) {
      throw new Error("AI analysis service is temporarily unavailable. Please try again.");
    }
    if (error.response?.status === 504) {
      throw new Error("Analysis timed out. Try with shorter text or a different URL.");
    }
    if (error.response === undefined) {
      throw new Error("Cannot reach the server. Please check your connection.");
    }
    throw new Error(error.response?.data?.detail || "An unexpected error occurred.");
  }
);

export async function analyzeContent(input) {
  const response = await api.post('/api/analyze', { input });
  return response.data;
}

export async function getHealth() {
  const response = await api.get('/api/health');
  return response.data;
}

export async function getServerHistory() {
  const response = await api.get('/api/history');
  return response.data.analyses;
}
