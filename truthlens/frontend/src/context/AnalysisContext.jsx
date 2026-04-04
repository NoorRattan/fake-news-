import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { analyzeContent, getHealth } from '../services/api';

export const AnalysisContext = createContext(null);

export function AnalysisProvider({ children }) {
  const [currentResult, setCurrentResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('idle');
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('unknown');

  const mounted = useRef(true);
  const hasCheckedBackend = useRef(false);
  const backendRetryTimer = useRef(null);
  const timers = useRef([]);

  useEffect(() => {
    mounted.current = true;

    try {
      const stored = sessionStorage.getItem('tl_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (storageError) {
      console.error('Failed to parse history from sessionStorage', storageError);
    }

    return () => {
      mounted.current = false;
      if (backendRetryTimer.current) {
        clearTimeout(backendRetryTimer.current);
      }
      timers.current.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (hasCheckedBackend.current) return;
    hasCheckedBackend.current = true;

    async function checkBackend({ isRetry = false } = {}) {
      setBackendStatus('starting');
      const startTime = Date.now();

      try {
        const health = await getHealth();
        if (!mounted.current) return;

        const elapsed = Date.now() - startTime;

        if (health?.status === 'ok') {
          setBackendStatus('online');

          if (backendRetryTimer.current) {
            clearTimeout(backendRetryTimer.current);
            backendRetryTimer.current = null;
          }

          if (elapsed > 5000) {
            console.log(`[TruthLens] Backend was cold and responded in ${elapsed}ms.`);
          }

          return;
        }

        setBackendStatus('offline');
      } catch {
        if (!mounted.current) return;

        if (!isRetry) {
          if (backendRetryTimer.current) {
            clearTimeout(backendRetryTimer.current);
          }

          backendRetryTimer.current = setTimeout(() => {
            if (!mounted.current) return;
            checkBackend({ isRetry: true });
          }, 10000);
          return;
        }

        setBackendStatus('offline');
      }
    }

    checkBackend();
  }, []);

  const updateHistory = useCallback((newResult) => {
    setHistory((previousHistory) => {
      const updatedHistory = [newResult, ...previousHistory].slice(0, 20);
      try {
        sessionStorage.setItem('tl_history', JSON.stringify(updatedHistory));
      } catch (storageError) {
        console.error('Failed to save history', storageError);
      }
      return updatedHistory;
    });
  }, []);

  const analyze = useCallback(
    async (inputValue) => {
      setError(null);
      setCurrentResult(null);
      setIsLoading(true);

      timers.current.forEach(clearTimeout);

      const stageTimers = [];
      timers.current = stageTimers;

      const isUrl =
        inputValue.trim().startsWith('http://') || inputValue.trim().startsWith('https://');
      setLoadingStage(isUrl ? 'fetching_url' : 'analyzing');

      stageTimers.push(
        setTimeout(() => {
          if (mounted.current) setLoadingStage('analyzing');
        }, 2000)
      );
      stageTimers.push(
        setTimeout(() => {
          if (mounted.current) setLoadingStage('corroborating');
        }, 6000)
      );
      stageTimers.push(
        setTimeout(() => {
          if (mounted.current) setLoadingStage('finalizing');
        }, 10000)
      );

      const timeoutWarningTimer = setTimeout(() => {
        if (mounted.current) {
          setLoadingStage('This is taking longer than usual. Still working...');
        }
      }, 20000);

      stageTimers.push(timeoutWarningTimer);

      try {
        const data = await analyzeContent(inputValue);
        if (!mounted.current) return;

        setCurrentResult(data);
        updateHistory(data);
        setError(null);
      } catch (analysisError) {
        if (!mounted.current) return;
        setError(analysisError.message || 'Analysis failed. Please try again.');
      } finally {
        clearTimeout(timeoutWarningTimer);
        stageTimers.forEach(clearTimeout);
        timers.current = [];

        if (mounted.current) {
          setIsLoading(false);
          setLoadingStage('idle');
        }
      }
    },
    [updateHistory]
  );

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
    <AnalysisContext.Provider
      value={{
        currentResult,
        setCurrentResult,
        history,
        isLoading,
        loadingStage,
        error,
        backendStatus,
        analyzeContent: analyze,
        clearResult,
        clearHistory,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) throw new Error('useAnalysis must be used inside AnalysisProvider');
  return context;
}
