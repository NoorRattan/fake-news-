import React from 'react';
import { motion } from 'framer-motion';

export default function FlagsAndTactics({ red_flags, credible_signals, manipulation_tactics, verdict }) {
  const hasRedFlags = red_flags && red_flags.length > 0;
  const hasCredible = credible_signals && credible_signals.length > 0;
  const hasTactics = manipulation_tactics && manipulation_tactics.length > 0;

  if (!hasRedFlags && !hasTactics && !hasCredible) {
    return (
      <motion.div 
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } }}
        style={{ maxWidth: 960, margin: '20px auto 0', padding: '0 40px' }}
        className="px-[16px] md:px-[40px]"
      >
        <div style={{ background: '#141414', border: '1px solid #222222', borderRadius: 0, padding: '20px 24px' }}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '12px', color: '#666666', fontStyle: 'italic' }}>
            No significant issues detected in this content.
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } }}
      style={{ maxWidth: 960, margin: '20px auto 0', padding: '0 40px', display: 'grid', gap: '16px' }}
      className="px-[16px] md:px-[40px] grid-cols-1 md:grid-cols-2"
    >
      {/* RED FLAGS CARD */}
      <div style={{ background: '#141414', border: '1px solid #222222', borderRadius: 0, padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', color: '#666666', letterSpacing: '2px', textTransform: 'uppercase' }}>
            RED FLAGS
          </div>
          <div style={{ border: '1px solid #ff4747', color: '#ff4747', fontFamily: '"DM Mono", monospace', fontSize: '9px', padding: '2px 8px', borderRadius: 0 }}>
            {red_flags?.length || 0}
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {!hasRedFlags ? (
            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '11px', color: '#666666', fontStyle: 'italic' }}>
              No red flags detected.
            </div>
          ) : (
            red_flags.map((flag, i) => (
              <motion.div
                key={`rf-${i}`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                style={{ background: 'rgba(255,71,71,0.08)', border: '1px solid rgba(255,71,71,0.35)', borderRadius: 0, color: '#ff4747', fontFamily: '"DM Mono", monospace', fontSize: '10px', padding: '5px 10px', textTransform: 'none' }}
              >
                {flag}
              </motion.div>
            ))
          )}
        </div>

        {hasCredible && (
          <div style={{ borderTop: '1px solid #222222', paddingTop: '14px', marginTop: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', color: '#666666', letterSpacing: '2px', textTransform: 'uppercase' }}>
                CREDIBLE SIGNALS
              </div>
              <div style={{ border: '1px solid #47ff8f', color: '#47ff8f', fontFamily: '"DM Mono", monospace', fontSize: '9px', padding: '2px 8px', borderRadius: 0 }}>
                {credible_signals.length}
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {credible_signals.map((sig, i) => (
                <div key={`cs-${i}`} style={{ background: 'rgba(71,255,143,0.08)', border: '1px solid rgba(71,255,143,0.35)', color: '#47ff8f', fontFamily: '"DM Mono", monospace', fontSize: '10px', padding: '5px 10px', borderRadius: 0 }}>
                  {sig}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MANIPULATION TACTICS CARD */}
      {hasTactics && (
        <div style={{ background: '#141414', border: '1px solid #222222', borderRadius: 0, padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', color: '#666666', letterSpacing: '2px', textTransform: 'uppercase' }}>
              MANIPULATION TACTICS
            </div>
            <div style={{ border: '1px solid #ff9147', color: '#ff9147', fontFamily: '"DM Mono", monospace', fontSize: '9px', padding: '2px 8px', borderRadius: 0 }}>
              {manipulation_tactics.length}
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {manipulation_tactics.map((tactic, i) => (
              <motion.div
                key={`mt-${i}`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                style={{ background: 'rgba(255,145,71,0.08)', border: '1px solid rgba(255,145,71,0.35)', borderRadius: 0, color: '#ff9147', fontFamily: '"DM Mono", monospace', fontSize: '10px', padding: '5px 10px', textTransform: 'none' }}
              >
                {tactic}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
