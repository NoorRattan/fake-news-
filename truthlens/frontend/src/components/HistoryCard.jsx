import React from 'react';
import { motion } from 'framer-motion';
import { getVerdictColor, formatDuration, formatTimestamp } from '../utils/helpers';

export default function HistoryCard({ item, onClick }) {
  if (!item) return null;
  
  const color = getVerdictColor(item.verdict);
  const isFake = item.verdict === "Likely Fake";

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label={`View analysis: ${item.verdict}, score ${item.credibility_score}/100`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      whileHover={{ y: -3, boxShadow: "4px 4px 0px rgba(255,255,255,0.1)" }}
      whileTap={{ scale: 0.99 }}
      className="editorial-card cursor-pointer mb-4 text-left w-full hover:border-text transition-colors"
    >
      {/* ROW 1 */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2.5">
          <div 
            className={`w-3 h-3 border border-border ${isFake ? 'animate-pulse' : ''}`}
            style={{ backgroundColor: color, borderColor: color }}
          />
          <h3 className="font-bebas text-xl uppercase tracking-wide" style={{ color }}>
            {item.verdict}
          </h3>
        </div>
        {item.input_type && (
          <div className="editorial-tag text-muted">
            {item.input_type}
          </div>
        )}
      </div>

      {/* ROW 2 (Credibility Bar) */}
      <div className="mt-3">
        <div className="font-mono text-[10px] text-muted mb-1.5 uppercase">
          Credibility: {item.credibility_score}/100
        </div>
        <div className="w-full h-1.5 border border-border bg-surface overflow-hidden rounded-none">
          <motion.div 
            initial={{ width: "0%" }}
            whileInView={{ width: `${item.credibility_score}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>

      {/* ROW 3 (Summary) */}
      <div className="mt-3">
        <p className="font-mono text-xs text-text line-clamp-2 leading-relaxed uppercase">
          {item.summary || "No summary available."}
        </p>
      </div>

      {/* ROW 4 (Footer info) */}
      <div className="mt-3 pt-3 border-t border-border flex justify-between items-center">
        <div className="font-mono text-[10px] text-muted uppercase">
          {item.processing_time_ms ? formatDuration(item.processing_time_ms) : ""}
        </div>
        <div className="font-mono text-[10px] text-muted uppercase">
          {item.timestamp ? formatTimestamp(item.timestamp) : ""}
        </div>
      </div>
    </motion.div>
  );
}
