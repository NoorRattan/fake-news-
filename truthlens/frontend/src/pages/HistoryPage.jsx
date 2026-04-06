import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, ChevronRight, RefreshCw } from 'lucide-react';
import clsx from 'clsx';
import { isToday, isYesterday, format } from 'date-fns';

import { useAnalysis } from '../context/AnalysisContext';
import { clearServerHistory, getServerHistory } from '../services/api';
import PageTransition from '../components/PageTransition';
import HistoryCard from '../components/HistoryCard';

export default function HistoryPage() {
  const { history, clearHistory, setCurrentResult } = useAnalysis();
  const navigate = useNavigate();
  const [serverHistory, setServerHistory] = useState([]);
  const [loadingServer, setLoadingServer] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [clearingHistory, setClearingHistory] = useState(false);

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
      // Silent fail for server history as requested
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

  const handleClearConfirm = async () => {
    setClearingHistory(true);
    clearHistory();
    setServerHistory([]);

    try {
      await clearServerHistory();
    } catch (e) {
      // Keep the UI cleared even if the server request fails.
    } finally {
      setConfirmClear(false);
      setClearingHistory(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-20 px-6 max-w-4xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end flex-wrap gap-4 mb-8 border-b border-border pb-6">
          <div>
            <p className="font-mono text-xs text-muted tracking-widest uppercase mb-2">/// Session History</p>
            <h1 className="font-bebas text-5xl md:text-6xl text-text tracking-wide uppercase mt-1">Recent Analyses</h1>
            <p className="font-mono text-xs text-muted mt-2 uppercase">
              Your analysis history for this session. Closes when you close the tab.
            </p>
          </div>
          
          <div className="flex gap-3 items-center">
            <span className="font-mono text-sm text-text bg-border/20 px-2 py-1 uppercase">
              {allHistory.length} analyses
            </span>
            
            <button 
              onClick={fetchServerHistory} 
              title="Refresh from server"
              className={clsx("p-2 text-muted hover:text-text transition-colors border border-transparent hover:border-border", loadingServer && "animate-spin border-border")}
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
                      disabled={clearingHistory}
                      onClick={() => setConfirmClear(true)}
                      className="editorial-btn text-xs text-[var(--red)] border-[var(--red)] hover:bg-[var(--red)] hover:text-bg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={12} /> CLEAR ALL
                    </motion.button>
                  ) : (
                    <motion.div
                      key="btn-confirm"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center gap-2 border border-[var(--red)] bg-surface px-3 py-1.5"
                    >
                      <span className="font-mono text-[10px] text-[var(--red)] mr-2 uppercase">Are you sure?</span>
                      <button
                        onClick={handleClearConfirm}
                        disabled={clearingHistory}
                        className="font-mono font-bold text-[10px] text-[var(--red)] px-2 hover:underline uppercase disabled:opacity-50 disabled:no-underline"
                      >
                        {clearingHistory ? 'CLEARING...' : 'YES, CLEAR'}
                      </button>
                      <span className="text-[var(--red)]/30">|</span>
                      <button
                        onClick={() => setConfirmClear(false)}
                        disabled={clearingHistory}
                        className="font-mono text-[10px] text-muted hover:text-text px-2 transition-colors uppercase disabled:opacity-50"
                      >
                        CANCEL
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
            className="editorial-card max-w-md mx-auto p-12 mt-16 text-center flex flex-col items-center"
          >
            <div className="w-16 h-16 border border-muted flex items-center justify-center mb-6">
               <Clock size={24} className="text-muted" />
            </div>
            <h2 className="font-bebas text-3xl text-muted mt-2 uppercase tracking-wide">No Analyses Yet</h2>
            <p className="font-mono text-xs text-muted mt-3 max-w-xs mx-auto uppercase leading-relaxed">
              Paste an article, enter a URL, or type a claim to get your first verdict.
            </p>
            <button 
              onClick={() => navigate("/")}
              className="editorial-btn-primary text-xs px-6 py-3 mt-8 flex items-center gap-2"
            >
              START ANALYZING <ChevronRight size={14} />
            </button>
          </motion.div>
        ) : (
          /* HISTORY LIST */
          <div className="flex flex-col">
            <AnimatePresence>
              {Object.keys(groupedHistory).map((groupName, groupIdx) => (
                <motion.div key={groupName} className="mb-8">
                  <div className={clsx("flex items-center gap-4 mb-4", groupIdx > 0 ? "mt-8" : "")}>
                    <h3 className="font-bebas text-xl text-text tracking-wide uppercase">
                      {groupName}
                    </h3>
                    <div className="flex-grow h-[1px] bg-border" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            navigate("/");
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
