import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CorroborationCard({ corroboration_results }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!corroboration_results || corroboration_results.length === 0 || !corroboration_results.some(c => c.results?.length > 0)) {
    return null;
  }

  const extractDomain = (url) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } }}
      style={{ maxWidth: 960, margin: '20px auto 0', padding: '0 40px' }}
      className="px-[16px] md:px-[40px]"
    >
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: '#141414', border: '1px solid #222222', borderRadius: 0, padding: '16px 24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'
        }}
      >
        <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', color: '#666666', letterSpacing: '2px', textTransform: 'uppercase' }}>
          WHAT THE WEB SAYS
        </div>
        <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '9px', color: '#444444' }}>
          {isOpen ? '▲ COLLAPSE' : '▼ EXPAND'}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            {corroboration_results.slice(0, 2).map((claimData, idx) => {
              if (!claimData.results || claimData.results.length === 0) return null;
              
              return (
                <div key={idx}>
                  <div style={{ padding: '14px 24px', background: '#141414', border: '1px solid #222222', borderTop: 'none', borderRadius: 0 }}>
                    <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', color: '#666666' }}>SEARCHING: </span>
                    <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', color: '#f0ede8' }}>{claimData.claim}</span>
                  </div>
                  <div style={{ display: 'grid', gap: '1px' }} className="grid-cols-1 md:grid-cols-3">
                    {claimData.results.map((res, i) => (
                      <div key={i} style={{ background: '#141414', border: '1px solid #222222', borderRadius: 0, padding: '14px 16px' }}>
                        <a 
                          href={res.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ fontFamily: '"DM Mono", monospace', fontSize: '11px', color: '#f0ede8', textDecoration: 'none', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', transition: 'color 0.2s' }}
                          onMouseOver={(e) => { e.target.style.color = '#47ff8f'; e.target.style.textDecoration = 'underline'; }}
                          onMouseOut={(e) => { e.target.style.color = '#f0ede8'; e.target.style.textDecoration = 'none'; }}
                        >
                          {res.title}
                        </a>
                        <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', color: '#666666', marginTop: '6px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {res.snippet}
                        </div>
                        <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '9px', color: '#444444', marginTop: '8px', border: '1px solid #333333', padding: '2px 6px', display: 'inline-block' }}>
                          {extractDomain(res.url)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
