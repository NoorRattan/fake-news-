import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';
import { extractDomain } from '../../utils/helpers';

export default function CorroborationCard({ corroboration_results }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!corroboration_results || corroboration_results.length === 0) return null;
  
  const hasResults = corroboration_results.some(c => c.results?.length > 0);
  if (!hasResults) return null;

  return (
    <div className="clay-card p-6 mt-5">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Globe size={18} className="text-accent-green" />
          <span className="font-mono text-xs text-text-muted tracking-widest uppercase">What the Web Says</span>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown size={18} className="text-text-muted" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-5 flex flex-col gap-6">
              {corroboration_results.slice(0, 2).map((item, i) => (
                <div key={i}>
                  <div className="flex gap-2 items-start mb-3">
                    <span className="clay-pill bg-accent-amber/10 text-accent-amber px-2 py-0.5 text-[10px] font-mono border-transparent shadow-none shrink-0 mt-0.5">
                      CLAIM
                    </span>
                    <span className="font-mono text-xs text-text-primary leading-relaxed">
                      {item.claim}
                    </span>
                  </div>
                  
                  {item.results && item.results.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {item.results.slice(0, 3).map((res, j) => (
                        <div key={j} className="clay-card-sm p-4 flex flex-col h-full">
                          <a 
                            href={res.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-dm font-medium text-sm text-text-primary hover:text-accent-blue line-clamp-2 transition-colors"
                          >
                            {res.title}
                          </a>
                          <p className="font-dm text-xs text-text-secondary mt-1.5 line-clamp-2 mb-3">
                            {res.snippet}
                          </p>
                          <div className="mt-auto">
                            <span className="font-mono text-[10px] clay-pill bg-white/5 border-transparent text-text-muted px-2 py-0.5 shadow-none truncate max-w-full inline-block">
                              {extractDomain(res.url)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
