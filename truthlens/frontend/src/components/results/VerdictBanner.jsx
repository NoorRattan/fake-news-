import React from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { getVerdictColor, formatDuration, formatTimestamp } from '../../utils/helpers';

export default function VerdictBanner({ result }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, v => Math.round(v));

  React.useEffect(() => {
    if (result?.credibility_score !== undefined) {
      const controls = animate(count, result.credibility_score, { duration: 1.2, ease: 'easeOut' });
      return controls.stop;
    }
  }, [result?.credibility_score, count]);

  const vColor = getVerdictColor(result?.verdict);
  const verdictString = result?.verdict || "UNKNOWN";
  const chars = Array.from(verdictString);

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: 'easeOut', delay: 0.05 } }
      }}
      style={{ maxWidth: 960, margin: '0 auto', paddingTop: '32px' }}
      className="px-[16px] md:px-[40px]"
    >
      <div style={{
        background: '#141414',
        borderLeft: `5px solid ${vColor}`,
        padding: '24px 28px',
        borderRadius: 0,
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 2fr)',
        gap: '24px'
      }} className="grid-cols-1 md:grid-cols-[3fr_2fr]">
        
        {/* LEFT COLUMN */}
        <div>
          <div style={{ 
            fontFamily: '"Bebas Neue", sans-serif', 
            color: vColor, 
            lineHeight: 1, 
            letterSpacing: '2px' 
          }} className="text-[48px] md:text-[72px]">
            {chars.map((char, i) => (
              <motion.span 
                key={i} 
                initial={{ opacity: 0, y: 16 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.04, duration: 0.3, ease: 'easeOut' }} 
                style={{ display: 'inline-block' }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ border: '1px solid #222222', color: '#666666', fontFamily: '"DM Mono", monospace', fontSize: '9px', padding: '3px 8px', borderRadius: 0, textTransform: 'uppercase' }}>
              {result?.metadata?.input_type || 'URL'}
            </span>
            <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', color: '#666666' }}>
              ⚡ {formatDuration(result?.processing_time_ms || 0)}
            </span>
            <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', color: '#666666' }}>
              {formatTimestamp(result?.timestamp)}
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ textAlign: 'center', alignSelf: 'center' }}>
          <div style={{ fontFamily: '"Bebas Neue", sans-serif', color: vColor, lineHeight: 1 }} className="text-[56px] md:text-[80px]">
            <motion.span className="score-display">{rounded}</motion.span>
          </div>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '9px', color: '#444444', marginTop: '8px', border: '1px solid #222222', padding: '2px 6px', display: 'inline-block', borderRadius: 0 }}>
            CREDIBILITY SCORE
          </div>

          <div style={{ width: '100%', height: '4px', background: '#222222', borderRadius: 0, overflow: 'hidden', marginTop: '12px' }}>
            <motion.div 
              initial={{ width: '0%' }}
              animate={{ width: `${result?.credibility_score || 0}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{ height: '100%', background: vColor }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', alignItems: 'center' }}>
            <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '9px', color: '#666666' }}>0</span>
            <span style={{ border: `1px solid ${vColor}`, color: vColor, fontFamily: '"DM Mono", monospace', fontSize: '9px', padding: '2px 8px', borderRadius: 0, textTransform: 'uppercase' }}>
              {result?.confidence || 'High'} Confidence
            </span>
            <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '9px', color: '#666666' }}>100</span>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
