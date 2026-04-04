import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { analyzeContent } from '../services/api';

export const AnalysisContext = createContext(null);

export function AnalysisProvider({ children }) {
  const [currentResult, setCurrentResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('idle');
  const [error, setError] = useState(null);
  const mounted = useRef(true);

  // Timers to clean up
  const timers = useRef([]);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('tl_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse history from sessionStorage', e);
    }
    return () => {
      mounted.current = false;
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const updateHistory = useCallback((newResult) => {
    setHistory((prev) => {
      const updated = [newResult, ...prev].slice(0, 20);
      try {
        sessionStorage.setItem('tl_history', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save history', e);
      }
      return updated;
    });
  }, []);

  const analyze = useCallback(async (inputValue) => {
    setError(null);
    setIsLoading(true);
    timers.current.forEach(clearTimeout);
    timers.current = [];

    const isUrl = inputValue.trim().startsWith('http://') || inputValue.trim().startsWith('https://');
    setLoadingStage(isUrl ? 'fetching_url' : 'analyzing');

    // Simulate stage progression
    timers.current.push(setTimeout(() => { if (mounted.current && isLoading) setLoadingStage('analyzing'); }, 2000));
    timers.current.push(setTimeout(() => { if (mounted.current && isLoading) setLoadingStage('corroborating'); }, 6000));
    timers.current.push(setTimeout(() => { if (mounted.current && isLoading) setLoadingStage('finalizing'); }, 10000));

    try {
      const data = await analyzeContent(inputValue);
      if (mounted.current) {
        setCurrentResult(data);
        updateHistory(data);
        setIsLoading(false);
        setLoadingStage('idle');
        setError(null);
      }
    } catch (err) {
      if (mounted.current) {
        setError(err.message || 'Analysis failed. Please try again.');
        setIsLoading(false);
        setLoadingStage('idle');
      }
    }
  }, [isLoading, updateHistory]);

  const clearResult = useCallback(() => {
    setCurrentResult(null);
    setError(null);
    setLoadingStage('idle');
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    sessionStorage.removeItem('tl_history');
  }, []);

  return (
    <AnalysisContext.Provider value={{
      currentResult,
      setCurrentResult,
      history,
      isLoading,
      loadingStage,
      error,
      analyzeContent: analyze,
      clearResult,
      clearHistory
    }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error("useAnalysis must be used inside AnalysisProvider");
  return ctx;
}
