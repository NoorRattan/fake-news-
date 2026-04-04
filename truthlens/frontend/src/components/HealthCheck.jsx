import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { getHealth } from '../services/api';

export default function HealthCheck() {
  const [apiDown, setApiDown] = useState(false);
  const [checking, setChecking] = useState(false);

  const checkStatus = async () => {
    setChecking(true);
    try {
      await getHealth();
      setApiDown(false);
    } catch {
      setApiDown(true);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  if (!apiDown) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 w-full z-50 py-3 px-6 flex items-center justify-between"
      style={{
        background: 'rgba(251, 146, 60, 0.15)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(251, 146, 60, 0.3)'
      }}
    >
      <div className="flex items-center gap-2">
        <AlertTriangle size={16} color="var(--accent-amber)" />
        <span className="font-mono text-xs text-accent-amber hidden sm:inline">
          Backend API unreachable — make sure the server is running
        </span>
        <span className="font-mono text-xs text-accent-amber sm:hidden">
          Backend API offline
        </span>
      </div>
      
      <button 
        onClick={checkStatus}
        disabled={checking}
        className="font-dm text-xs text-accent-amber border border-accent-amber/30 px-3 py-1 rounded bg-transparent hover:bg-accent-amber/10 transition-colors disabled:opacity-50"
      >
        {checking ? 'Checking...' : 'Retry'}
      </button>
    </div>
  );
}
