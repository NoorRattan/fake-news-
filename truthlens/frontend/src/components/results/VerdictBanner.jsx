import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { getVerdictColor, getVerdictBg, getVerdictShadow, formatDuration, formatTimestamp } from '../../utils/helpers';

export default function VerdictBanner({ result }) {
  const { verdict, credibility_score, confidence, input_type, processing_time_ms, timestamp } = result || {};
  
  const score = credibility_score || 0;
  const color = getVerdictColor(verdict);
  const bg = getVerdictBg(verdict);
  const shadow = getVerdictShadow(verdict);
  
  const animatedScore = useMotionValue(0);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const controls = animate(animatedScore, score, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (val) => setDisplayScore(Math.round(val))
    });
    return controls.stop;
  }, [score, animatedScore]);

  const chars = verdict ? Array.from(verdict) : [];

  const getConfidenceBadge = (conf) => {
    switch (conf) {
      case "High": return "text-accent-green bg-[rgba(74,222,128,0.1)] border-[rgba(74,222,128,0.2)]";
      case "Medium": return "text-accent-amber bg-[rgba(251,146,60,0.1)] border-[rgba(251,146,60,0.2)]";
      case "Low": return "text-accent-red bg-[rgba(248,113,113,0.1)] border-[rgba(248,113,113,0.2)]";
      default: return "text-text-muted bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]";
    }
  };

  return (
    <motion.div 
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.05 }}
      className="clay-card p-8 rounded-2xl border-l-[6px]"
      style={{
        borderLeftColor: color,
        background: bg,
        ...shadow
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-8 items-center">
        
        {/* LEFT */}
        <div>
          <div className="font-mono text-xs text-text-muted tracking-widest mb-2 uppercase">Verdict</div>
          <div className="font-syne font-extrabold text-5xl md:text-6xl flex flex-wrap" style={{ color }}>
            {chars.map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </div>
          
          <div className="flex gap-6 mt-4 flex-wrap items-center">
            {input_type && (
              <div className="font-mono text-xs clay-pill bg-white/5 border-transparent text-text-secondary shadow-none px-3 py-1">
                {input_type}
              </div>
            )}
            {processing_time_ms && (
              <div className="font-mono text-xs text-text-muted">
                ⚡ {formatDuration(processing_time_ms)}
              </div>
            )}
            {timestamp && (
              <div className="font-mono text-xs text-text-muted">
                {formatTimestamp(timestamp)}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col items-center">
          <div 
            className="w-[140px] h-[140px] rounded-full relative flex items-center justify-center"
            style={{
              background: `conic-gradient(${color} 0deg, ${color} ${displayScore * 3.6}deg, rgba(255,255,255,0.08) ${displayScore * 3.6}deg)`
            }}
          >
            <div className="absolute w-[110px] h-[110px] rounded-full bg-bg-surface flex flex-col items-center justify-center">
              <span className="font-syne font-extrabold text-3xl" style={{ color }}>
                {displayScore}
              </span>
              <span className="font-dm text-sm text-text-muted">/100</span>
            </div>
          </div>
          
          {confidence && (
            <div className={`mt-4 font-mono text-xs px-4 py-1.5 rounded-full border ${getConfidenceBadge(confidence)}`}>
              {confidence} Confidence
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
}
