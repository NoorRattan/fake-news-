import React from 'react';
import { motion } from 'framer-motion';

const LIKELIHOOD_STYLES = {
  Low: {
    color: '#47ff8f',
    border: '1px solid #47ff8f',
    background: 'rgba(71,255,143,0.08)',
  },
  Medium: {
    color: '#ff9147',
    border: '1px solid #ff9147',
    background: 'rgba(255,145,71,0.08)',
  },
  High: {
    color: '#ff4747',
    border: '1px solid #ff4747',
    background: 'rgba(255,71,71,0.08)',
  },
};

function getLikelihoodStyle(likelihood) {
  return LIKELIHOOD_STYLES[likelihood] || {
    color: '#666666',
    border: '1px solid #444444',
    background: 'rgba(255,255,255,0.03)',
  };
}

export default function ImageAnalysisCard({ image_analysis }) {
  if (!image_analysis || image_analysis.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
      }}
      style={{ maxWidth: 960, margin: '20px auto 0', padding: '0 40px' }}
      className="px-[16px] md:px-[40px]"
    >
      <div
        style={{
          background: '#141414',
          border: '1px solid #222222',
          borderRadius: 0,
          padding: '20px 24px',
        }}
      >
        <div
          style={{
            fontFamily: '"DM Mono", monospace',
            fontSize: '10px',
            color: '#666666',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '14px',
          }}
        >
          IMAGE ANALYSIS
        </div>

        <div style={{ display: 'grid', gap: '14px' }}>
          {image_analysis.map((image, index) => {
            const likelihood = image?.manipulation_likelihood || 'Low';
            const likelihoodStyle = getLikelihoodStyle(likelihood);
            const credibilityFlags = Array.isArray(image?.credibility_flags)
              ? image.credibility_flags
              : [];
            const credibleSignals = Array.isArray(image?.credible_signals)
              ? image.credible_signals
              : [];

            return (
              <div
                key={`${image?.image_url || 'image'}-${index}`}
                style={{
                  border: '1px solid #222222',
                  background: '#101010',
                  padding: '16px',
                  display: 'grid',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '16px',
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                  }}
                >
                  {image?.image_url && (
                    <img
                      src={image.image_url}
                      alt={image?.image_type || `Article image ${index + 1}`}
                      style={{
                        maxWidth: 180,
                        width: '100%',
                        borderRadius: 0,
                        border: likelihoodStyle.border,
                        display: 'block',
                        objectFit: 'cover',
                      }}
                      onError={(event) => {
                        event.currentTarget.style.display = 'none';
                      }}
                    />
                  )}

                  <div style={{ flex: '1 1 260px', minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        marginBottom: '10px',
                      }}
                    >
                      <span
                        style={{
                          ...likelihoodStyle,
                          fontFamily: '"DM Mono", monospace',
                          fontSize: '9px',
                          padding: '3px 8px',
                          borderRadius: 0,
                          textTransform: 'uppercase',
                        }}
                      >
                        {likelihood}
                      </span>

                      {image?.image_type && (
                        <span
                          style={{
                            border: '1px solid #222222',
                            padding: '3px 8px',
                            fontFamily: '"DM Mono", monospace',
                            fontSize: '9px',
                            color: '#666666',
                            textTransform: 'uppercase',
                          }}
                        >
                          {image.image_type}
                        </span>
                      )}
                    </div>

                    <div
                      style={{
                        fontFamily: '"Instrument Serif", serif',
                        fontStyle: 'italic',
                        fontSize: '15px',
                        lineHeight: 1.7,
                        color: '#f0ede8',
                      }}
                    >
                      {image?.summary || 'No image summary available.'}
                    </div>
                  </div>
                </div>

                {credibilityFlags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {credibilityFlags.map((flag, flagIndex) => (
                      <div
                        key={`flag-${index}-${flagIndex}`}
                        style={{
                          background: 'rgba(255,71,71,0.08)',
                          border: '1px solid rgba(255,71,71,0.35)',
                          color: '#ff4747',
                          fontFamily: '"DM Mono", monospace',
                          fontSize: '10px',
                          padding: '5px 10px',
                          borderRadius: 0,
                        }}
                      >
                        {flag}
                      </div>
                    ))}
                  </div>
                )}

                {credibleSignals.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {credibleSignals.map((signal, signalIndex) => (
                      <div
                        key={`signal-${index}-${signalIndex}`}
                        style={{
                          background: 'rgba(71,255,143,0.08)',
                          border: '1px solid rgba(71,255,143,0.35)',
                          color: '#47ff8f',
                          fontFamily: '"DM Mono", monospace',
                          fontSize: '10px',
                          padding: '5px 10px',
                          borderRadius: 0,
                        }}
                      >
                        {signal}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
