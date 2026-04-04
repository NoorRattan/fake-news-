// Change this to your live Render/Railway URL later:
const API_BASE = 'http://localhost:8000';

async function analyzeContent(inputText) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 35000); // 35 seconds timeout
  
  try {
    const response = await fetch(`${API_BASE}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ input: inputText }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      let errorMsg = 'An unexpected error occurred.';
      if (response.status === 400) {
        try {
          const errData = await response.json();
          if (errData.detail) errorMsg = errData.detail;
          else errorMsg = 'Invalid input. Please check your data and try again.';
        } catch {
          errorMsg = 'Invalid input. Please check your data and try again.';
        }
      } else if (response.status === 422) {
        errorMsg = 'Invalid request format.';
      } else if (response.status === 503) {
        errorMsg = 'AI analysis temporarily unavailable. Please try again.';
      } else if (response.status === 504) {
        errorMsg = 'Analysis timed out. Please try with a shorter text.';
      }
      throw new Error(errorMsg);
    }
    
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Analysis timed out. Please try with a shorter text.');
    }
    // If it's our custom thrown error, rethrow
    if (error.message !== 'Failed to fetch' && error.message !== 'NetworkError when attempting to fetch resource.') {
      throw error;
    }
    throw new Error('No internet connection detected or server is unreachable.');
  }
}

async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE}/api/health`);
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    return null;
  }
}

async function getHistory() {
  try {
    const response = await fetch(`${API_BASE}/api/history`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.analyses || [];
  } catch (err) {
    return [];
  }
}

window.TruthLensAPI = {
  analyzeContent,
  checkHealth,
  getHistory
};
