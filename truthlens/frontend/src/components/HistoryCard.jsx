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
      whileHover={{ y: -3, boxShadow: "0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.25)" }}
      whileTap={{ scale: 0.99 }}
      className="clay-card-sm p-5 cursor-pointer mb-4 text-left w-full"
    >
      {/* ROW 1 */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2.5">
          <div 
            className={`w-3 h-3 rounded-full ${isFake ? 'animate-pulse-glow' : ''}`}
            style={{ backgroundColor: color }}
          />
          <h3 className="font-syne font-bold text-base" style={{ color }}>
            {item.verdict}
          </h3>
        </div>
        {item.input_type && (
          <div className="clay-pill font-mono text-[10px] text-text-muted px-2 py-0.5 border-transparent shadow-none">
            {item.input_type}
          </div>
        )}
      </div>

      {/* ROW 2 (Credibility Bar) */}
      <div className="mt-3">
        <div className="font-mono text-[10px] text-text-muted mb-1.5">
          Credibility: {item.credibility_score}/100
        </div>
        <div className="w-full h-1.5 bg-[rgba(255,255,255,0.08)] rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: "0%" }}
            whileInView={{ width: `${item.credibility_score}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>

      {/* ROW 3 (Summary) */}
      <div className="mt-3">
        <p className="font-dm text-xs text-text-secondary line-clamp-2 leading-relaxed">
          {item.summary || "No summary available."}
        </p>
      </div>

      {/* ROW 4 (Footer info) */}
      <div className="mt-3 flex justify-between items-center">
        <div className="font-mono text-[10px] text-text-muted">
          {item.processing_time_ms ? formatDuration(item.processing_time_ms) : ""}
        </div>
        <div className="font-mono text-[10px] text-text-muted">
          {item.timestamp ? formatTimestamp(item.timestamp) : ""}
        </div>
      </div>
    </motion.div>
  );
}
