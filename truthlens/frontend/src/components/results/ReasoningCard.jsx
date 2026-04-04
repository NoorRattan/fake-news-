import React from 'react';
import { motion } from 'framer-motion';

export default function ReasoningCard({ reasoning, advice }) {
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } }}
      style={{ maxWidth: 960, margin: '20px auto 0', padding: '0 40px', display: 'grid', gap: '16px' }}
      className="px-[16px] md:px-[40px] grid-cols-1 md:grid-cols-2"
    >
      <div style={{ background: '#141414', border: '1px solid #222222', borderRadius: 0, padding: '20px 24px' }}>
        <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', color: '#666666', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px' }}>
          WHY THIS VERDICT?
        </div>
        <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '12px', lineHeight: 2, color: reasoning ? '#f0ede8' : '#666666', fontStyle: reasoning ? 'normal' : 'italic' }}>
          {reasoning || 'Reasoning not available.'}
        </div>
      </div>

      <div style={{ background: '#141414', border: '1px solid #222222', borderRadius: 0, padding: '20px 24px' }}>
        <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', color: '#666666', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px' }}>
          WHAT SHOULD YOU DO?
        </div>
        <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '12px', lineHeight: 2, color: advice ? '#f0ede8' : '#666666', fontStyle: advice ? 'normal' : 'italic' }}>
          {advice || 'No specific advice available.'}
        </div>
      </div>
    </motion.div>
  );
}
