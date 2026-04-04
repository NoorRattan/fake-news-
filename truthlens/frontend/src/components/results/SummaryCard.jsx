import React from 'react';
import { motion } from 'framer-motion';

export default function SummaryCard({ summary, domain_info, article_metadata }) {
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
      }}
      style={{ maxWidth: 960, margin: '20px auto 0', padding: '0 40px' }}
      className="px-[16px] md:px-[40px]"
    >
      <div style={{ background: '#141414', border: '1px solid #222222', borderRadius: 0, padding: '20px 24px' }}>
        <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', color: '#666666', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px' }}>
          WHAT THIS CLAIMS
        </div>

        {summary ? (
          <div style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: '16px', lineHeight: 1.8, color: '#f0ede8' }}>
            {summary}
          </div>
        ) : (
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '12px', color: '#666666' }}>
            Summary not available.
          </div>
        )}

        {article_metadata?.title && (
          <div style={{ borderTop: '1px solid #222222', paddingTop: '12px', marginTop: '12px' }}>
            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', color: '#666666', letterSpacing: '1px', textTransform: 'uppercase' }}>
              SOURCE: {article_metadata.domain || 'UNKNOWN'}
            </div>
            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '12px', color: '#f0ede8', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {article_metadata.title}
            </div>
          </div>
        )}

        {domain_info?.domain && (
          <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ border: '1px solid #222222', padding: '2px 8px', fontFamily: '"DM Mono", monospace', fontSize: '9px', borderRadius: 0, color: '#f0ede8' }}>
              {domain_info.domain}
            </span>
            {domain_info.rating && (
              <span style={{ border: '1px solid #222222', padding: '2px 8px', fontFamily: '"DM Mono", monospace', fontSize: '9px', borderRadius: 0, color: '#666666' }}>
                {domain_info.rating}
              </span>
            )}
            {domain_info.bias && (
              <span style={{ border: '1px solid #222222', padding: '2px 8px', fontFamily: '"DM Mono", monospace', fontSize: '9px', borderRadius: 0, color: '#666666' }}>
                {domain_info.bias} Bias
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
