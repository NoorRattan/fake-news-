import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, ChevronRight, RefreshCw } from 'lucide-react';
import clsx from 'clsx';
import { isToday, isYesterday, format } from 'date-fns';

import { useAnalysis } from '../context/AnalysisContext';
import { getServerHistory } from '../services/api';
import PageTransition from '../components/PageTransition';
import HistoryCard from '../components/HistoryCard';
import MiniGlobe from '../components/three/MiniGlobe';

export default function HistoryPage() {
  const { history, clearHistory, setCurrentResult } = useAnalysis();
  const navigate = useNavigate();
  const [serverHistory, setServerHistory] = useState([]);
  const [loadingServer, setLoadingServer] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    document.title = "History — TruthLens";
    fetchServerHistory();
  }, []);

  const fetchServerHistory = async () => {
    setLoadingServer(true);
    try {
      const data = await getServerHistory();
      if (Array.isArray(data)) {
        setServerHistory(data);
      }
    } catch (e) {
      // Slient fail for server history as requested
    } finally {
      setLoadingServer(false);
    }
  };

  const allHistory = useMemo(() => {
    const map = new Map();
    // Prioritize local session history (newer state or edits if any)
    history.forEach(item => {
      if (item && item.analysis_id) {
        map.set(item.analysis_id, item);
      }
    });
    // Add server history if not present
    serverHistory.forEach(item => {
      if (item && item.analysis_id && !map.has(item.analysis_id)) {
        map.set(item.analysis_id, item);
      }
    });
    
    return Array.from(map.values()).sort((a, b) => {
      const tA = new Date(a.timestamp).getTime() || 0;
      const tB = new Date(b.timestamp).getTime() || 0;
      return tB - tA; // Newest first
    });
  }, [history, serverHistory]);

  const getDateGroup = (isoString) => {
    if (!isoString) return "Past";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Past";
    
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM d, yyyy");
  };

  const groupedHistory = useMemo(() => {
    const groups = {};
    allHistory.forEach(item => {
      const group = getDateGroup(item.timestamp);
      if (!groups[group]) groups[group] = [];
      groups[group].push(item);
    });
    return groups;
  }, [allHistory]);

  const handleClearConfirm = () => {
    clearHistory();
    setConfirmClear(false);
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-20 px-6 max-w-4xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end flex-wrap gap-4 mb-8">
          <div>
            <p className="font-mono text-xs text-accent-purple tracking-widest uppercase">Session History</p>
            <h1 className="font-syne font-extrabold text-4xl text-text-primary mt-1">Recent Analyses</h1>
            <p className="font-dm text-sm text-text-muted mt-2">
              Your analysis history for this session. Closes when you close the tab.
            </p>
          </div>
          
          <div className="flex gap-3 items-center">
            <span className="font-mono text-sm text-text-muted">
              {allHistory.length} analyses
            </span>
            
            <button 
              onClick={fetchServerHistory} 
              title="Refresh from server"
              className={clsx("p-2 text-text-muted hover:text-text-primary transition-colors", loadingServer && "animate-spin")}
            >
              <RefreshCw size={16} />
            </button>
            
            {allHistory.length > 0 && (
              <div className="relative">
                <AnimatePresence mode="wait">
                  {!confirmClear ? (
                    <motion.button
                      key="btn-clear"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setConfirmClear(true)}
                      className="clay-btn-outline font-dm text-sm text-accent-red px-4 py-2 border-accent-red/30 hover:bg-accent-red/10 flex items-center gap-2"
                    >
                      <Trash2 size={14} /> Clear All
                    </motion.button>
                  ) : (
                    <motion.div
                      key="btn-confirm"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center gap-2 bg-accent-red/10 border border-accent-red/20 rounded-full px-3 py-1.5"
                    >
                      <span className="font-dm text-xs text-accent-red mr-2">Are you sure?</span>
                      <button onClick={handleClearConfirm} className="font-dm font-bold text-xs text-accent-red px-2 hover:underline">
                        Yes, Clear
                      </button>
                      <span className="text-accent-red/30">|</span>
                      <button onClick={() => setConfirmClear(false)} className="font-dm text-xs text-text-muted hover:text-text-primary px-2 transition-colors">
                        Cancel
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* EMPTY STATE */}
        {allHistory.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="clay-card max-w-md mx-auto p-12 mt-16 text-center flex flex-col items-center"
          >
            <MiniGlobe size={180} opacity={0.4} />
            <h2 className="font-syne font-bold text-2xl text-text-muted mt-6">No Analyses Yet</h2>
            <p className="font-dm text-sm text-text-muted mt-2 max-w-xs mx-auto">
              Paste an article, enter a URL, or type a claim to get your first verdict.
            </p>
            <button 
              onClick={() => navigate("/analyze")}
              className="clay-btn-primary font-dm text-sm px-6 py-3 mt-6 flex items-center gap-2 hover:scale-105 transition-transform"
            >
              Start Analyzing <ChevronRight size={16} />
            </button>
          </motion.div>
        ) : (
          /* HISTORY LIST */
          <div className="flex flex-col">
            <AnimatePresence>
              {Object.keys(groupedHistory).map((groupName, groupIdx) => (
                <motion.div key={groupName} className="mb-6">
                  <h3 className={clsx("font-mono text-xs text-text-muted mb-3", groupIdx > 0 ? "mt-6" : "")}>
                    {groupName}
                  </h3>
                  <div className="flex flex-col gap-1">
                    {groupedHistory[groupName].map((item, itemIdx) => (
                      <motion.div
                        key={item.analysis_id || `${item.timestamp}-${itemIdx}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                        transition={{ delay: itemIdx * 0.06 }}
                      >
                        <HistoryCard 
                          item={item} 
                          onClick={() => {
                            setCurrentResult(item);
                            navigate("/analyze");
                          }} 
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

      </div>
    </PageTransition>
  );
}
