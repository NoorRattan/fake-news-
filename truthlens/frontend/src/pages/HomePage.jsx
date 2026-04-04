import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { useAnalysis } from '../context/AnalysisContext';
import { getVerdictColor, formatTimestamp, formatDuration, truncateText } from '../utils/helpers';
import { Copy, Share2, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import PageTransition from '../components/PageTransition';
import LoadingOrb from '../components/three/LoadingOrb';

import VerdictBanner from '../components/results/VerdictBanner';
import SummaryCard from '../components/results/SummaryCard';
import FlagsAndTactics from '../components/results/FlagsAndTactics';
import ReasoningCard from '../components/results/ReasoningCard';
import CorroborationCard from '../components/results/CorroborationCard';
// import SourcesCard from '../components/results/SourcesCard'; // Handled inline if simple or created separate

const TopHeaderBar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        borderBottom: '1px solid #222222',
        padding: '24px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}
    >
      <div style={{ marginBottom: 0 }}>
        <h1 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '42px', letterSpacing: '3px', margin: 0, lineHeight: 1 }}>
          <span style={{ color: '#f0ede8' }}>TRUTH</span>
          <span style={{ color: '#47ff8f' }}>LENS</span>
        </h1>
      </div>
      <div style={{ alignSelf: 'center' }}>
        <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '11px', color: '#666666', letterSpacing: '1px', textTransform: 'uppercase' }}>
          See Through the Noise
        </span>
      </div>
    </motion.div>
  );
};

const InputForm = ({ setView }) => {
  const [textValue, setTextValue] = useState('');
  const [urlValue, setUrlValue] = useState('');
  const [urlError, setUrlError] = useState('');
  const [submitError, setSubmitError] = useState('');

  const { analyzeContent, error, clearResult } = useAnalysis();

  const handleTextChange = (e) => {
    const val = e.target.value;
    if (val.length <= 50000) {
      setTextValue(val);
    } else {
      setTextValue(val.slice(0, 50000));
      toast('Truncated to 50,000 characters', { icon: '✂️', style: { borderRadius: 0, background: '#141414', color: '#f0ede8', border: '1px solid #222222' } });
    }
  };

  const handleUrlChange = (e) => {
    setUrlValue(e.target.value);
    setUrlError('');
  };

  const validateUrl = (val) => {
    if (val.length > 0 && !val.startsWith('http')) {
      setUrlError('URL must start with http:// or https://');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    let inputToSend = '';
    
    if (urlValue.trim().length > 0) {
      if (!urlValue.trim().startsWith('http://') && !urlValue.trim().startsWith('https://')) {
        setUrlError('URL must start with http:// or https://');
        return;
      }
      inputToSend = urlValue.trim();
    } else if (textValue.trim().length > 0) {
      if (textValue.trim().length < 30) {
        setSubmitError('Please enter at least 30 characters.');
        return;
      }
      inputToSend = textValue.trim();
    } else {
      setSubmitError('Please enter a URL or paste some text to analyze.');
      return;
    }
    
    setSubmitError('');
    setView('loading');
    analyzeContent(inputToSend);
  };

  const handleExample = (text) => {
    setTextValue(text);
    setUrlValue('');
    setSubmitError('');
  };

  const examples = [
    { label: "Fake News", text: "URGENT!!! Scientists BANNED from telling you this secret — Big Pharma doesn't want you to know that drinking bleach mixed with apple cider vinegar CURES all diseases including cancer!! Share before they delete this!! The government is hiding the TRUTH about natural cures that work 100% of the time with NO side effects!!! SHARE IMMEDIATELY before this post gets deleted by the deep state operatives!!" },
    { label: "Real News", text: "A comprehensive peer-reviewed study published in the journal Nature Medicine, involving 8,200 participants across 22 countries, has confirmed that regular moderate exercise reduces the risk of cardiovascular disease by 35 percent. The 10-year longitudinal research, led by Dr. Priya Sharma at Stanford Medical School, was funded by the National Institutes of Health and has been independently replicated by researchers in Germany and South Korea." },
    { label: "Misleading", text: "Scientists have confirmed that coffee dramatically increases cancer risk according to a major new study. The research, which involved laboratory mice, showed a significant correlation between caffeine consumption and tumor growth. Health officials are urging people to reconsider their morning coffee habit immediately." },
    { label: "Short Claim", text: "5G towers cause cancer and are being used to control the population" }
  ];

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 40px 60px 40px' }} className="px-[16px] md:px-[40px]">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', color: '#666666', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>
          PASTE ARTICLE / URL / CLAIM
        </div>
      </motion.div>

      <textarea
        className="analyze-textarea"
        value={textValue}
        onChange={handleTextChange}
        placeholder="Paste any news article, social media post, or claim here..."
        style={{
          width: '100%',
          minHeight: '200px',
          maxHeight: '420px',
          resize: 'vertical',
          background: '#141414',
          border: '1px solid #222222',
          borderRadius: 0,
          color: '#f0ede8',
          fontFamily: '"DM Mono", monospace',
          fontSize: '13px',
          lineHeight: 1.7,
          padding: '16px',
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'border-color 0.15s ease'
        }}
        onFocus={(e) => e.target.style.borderColor = '#444444'}
        onBlur={(e) => e.target.style.borderColor = '#222222'}
      />

      <div style={{ textAlign: 'right', fontFamily: '"DM Mono", monospace', fontSize: '10px', marginTop: '6px', color: textValue.length >= 50000 ? '#ff4747' : textValue.length >= 40000 ? '#ff9147' : '#666666' }}>
        {textValue.length} / 50,000 characters
      </div>

      <AnimatePresence>
        {textValue.length > 0 && textValue.trim().length < 150 && !textValue.startsWith('http') && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ display: 'inline-block', marginTop: '6px', border: '1px solid #ff9147', color: '#ff9147', fontFamily: '"DM Mono", monospace', fontSize: '10px', padding: '3px 8px', borderRadius: 0, textTransform: 'uppercase', letterSpacing: '1px' }}
          >
            ✦ ANALYZING AS SHORT CLAIM
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ margin: '20px 0', borderTop: '1px solid #222222' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={urlValue}
          onChange={handleUrlChange}
          onBlur={() => validateUrl(urlValue)}
          placeholder="Or enter a URL — https://..."
          style={{
            flex: 1,
            minWidth: '200px',
            height: '44px',
            background: '#141414',
            border: `1px solid ${urlError ? '#ff4747' : '#222222'}`,
            borderRadius: 0,
            color: '#f0ede8',
            fontFamily: '"DM Mono", monospace',
            fontSize: '12px',
            padding: '0 14px',
            outline: 'none'
          }}
          onFocus={(e) => { if (!urlError) e.target.style.borderColor = '#444444' }}
        />
        
        <motion.button
          onClick={handleSubmit}
          whileHover={{ scale: 1.02, backgroundColor: '#47ff8f', color: '#0d0d0d' }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15 }}
          style={{
            height: '44px',
            padding: '0 24px',
            background: '#f0ede8',
            color: '#0d0d0d',
            border: 'none',
            borderRadius: 0,
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: '18px',
            letterSpacing: '2px',
            cursor: 'pointer',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap'
          }}
        >
          ANALYZE
        </motion.button>
      </div>

      {urlError && <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', color: '#ff4747', marginTop: '6px' }}>{urlError}</div>}
      {submitError && <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '11px', color: '#ff4747', marginTop: '8px' }}>{submitError}</div>}

      <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', color: '#666666', marginRight: '4px' }}>Try:</span>
        {examples.map((ex, i) => (
          <button
            key={i}
            onClick={() => handleExample(ex.text)}
            style={{
              border: '1px solid #333333',
              background: 'transparent',
              color: '#666666',
              fontFamily: '"DM Mono", monospace',
              fontSize: '10px',
              padding: '5px 12px',
              borderRadius: 0,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => { e.target.style.borderColor = '#f0ede8'; e.target.style.color = '#f0ede8'; }}
            onMouseOut={(e) => { e.target.style.borderColor = '#333333'; e.target.style.color = '#666666'; }}
          >
            {ex.label}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ marginTop: '20px', borderLeft: '3px solid #ff4747', padding: '12px 16px', background: 'rgba(255,71,71,0.06)' }}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '12px', color: '#ff4747' }}>{error}</div>
          <button
            onClick={clearResult}
            style={{ marginTop: '8px', background: 'transparent', border: 'none', fontFamily: '"DM Mono", monospace', fontSize: '10px', color: '#666666', cursor: 'pointer', padding: 0 }}
          >
            ✕ Dismiss
          </button>
        </div>
      )}
    </div>
  );
};

const LoadingView = ({ stage, clearResult, setView }) => {
  const cancelAnalysis = () => {
    clearResult();
    setView('input');
  };

  const steps = [
    { id: 'idle', label: 'INPUT' },
    { id: 'fetching_url', label: 'EXTRACT' },
    { id: 'analyzing', label: 'ANALYZE' },
    { id: 'corroborating', label: 'SEARCH' },
    { id: 'finalizing', label: 'VERDICT' }
  ];

  const stageKeys = steps.map(s => s.id);
  const activeIndex = Math.max(0, stageKeys.indexOf(stage || 'idle'));

  const messages = {
    'idle': 'PREPARING ANALYSIS...',
    'fetching_url': 'FETCHING ARTICLE FROM URL...',
    'analyzing': 'AI IS READING THE CONTENT...',
    'corroborating': 'SEARCHING THE WEB FOR EVIDENCE...',
    'finalizing': 'GENERATING YOUR VERDICT...'
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '60px 40px', display: 'flex', flexDirection: 'col', alignItems: 'center', textAlign: 'center', gap: '32px' }} className="px-[16px] md:px-[40px] flex-col">
      <LoadingOrb />
      
      <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '28px', color: '#f0ede8', letterSpacing: '3px' }}
          >
            {messages[stage || 'idle']}
          </motion.div>
        </AnimatePresence>
      </div>

      <div style={{ display: 'flex', width: '100%', maxWidth: '480px', margin: '0 auto', alignItems: 'center', gap: 0 }}>
        {steps.map((step, i) => {
          const isCompleted = i < activeIndex;
          const isActive = i === activeIndex;
          const isFuture = i > activeIndex;

          return (
            <React.Fragment key={step.id}>
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div 
                  className={isActive ? 'step-active' : ''}
                  style={{
                    width: '8px', height: '8px', flexShrink: 0,
                    background: isCompleted ? '#47ff8f' : isActive ? '#f0ede8' : '#333333',
                    marginBottom: '8px'
                  }}
                />
                <div style={{
                  position: 'absolute', top: '16px',
                  fontFamily: '"DM Mono", monospace', fontSize: '9px', textTransform: 'uppercase',
                  color: isCompleted || isActive ? '#f0ede8' : '#444444'
                }}>
                  {step.label}
                </div>
              </div>
              
              {i < steps.length - 1 && (
                <div style={{ flex: 1, height: '1px', background: isFuture || isActive ? '#333333' : '#47ff8f', position: 'relative' }}>
                   {i === activeIndex && (
                     <motion.div
                       initial={{ width: '0%' }}
                       animate={{ width: '100%' }}
                       transition={{ duration: 10, ease: "linear" }}
                       style={{ position: 'absolute', left: 0, top: 0, bottom: 0, background: '#47ff8f' }}
                     />
                   )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div style={{ marginTop: '24px' }}>
        <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '11px', color: '#666666' }}>
          Analysis takes 8–15 seconds. Complex articles may take longer.
        </div>
      </div>

      <div style={{ marginTop: '16px' }}>
        <button
          onClick={cancelAnalysis}
          style={{
            background: 'transparent',
            border: 'none',
            fontFamily: '"DM Mono", monospace',
            fontSize: '11px',
            color: '#666666',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            cursor: 'pointer',
            transition: 'color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.color = '#f0ede8'}
          onMouseOut={(e) => e.target.style.color = '#666666'}
        >
          ✕ CANCEL ANALYSIS
        </button>
      </div>
    </div>
  );
};

const ResultsView = ({ result, clearResult, setView }) => {
  const { history, setCurrentResult } = useAnalysis();

  const handleCopy = () => {
    const text = "TruthLens Analysis\n" +
      "═".repeat(40) + "\n" +
      "Verdict: " + result?.verdict + "\n" +
      "Credibility Score: " + result?.credibility_score + "/100\n" +
      "Confidence: " + result?.confidence + "\n\n" +
      "Summary:\n" + result?.summary + "\n\n" +
      "Red Flags: " + (result?.red_flags?.join(', ') || 'None') + "\n\n" +
      "Manipulation Tactics: " + (result?.manipulation_tactics?.join(', ') || 'None') + "\n\n" +
      "Reasoning:\n" + result?.reasoning + "\n\n" +
      "Advice:\n" + result?.advice + "\n\n" +
      "Analyzed: " + formatTimestamp(result?.timestamp);
    
    navigator.clipboard.writeText(text);
    toast('Copied!', { icon: '📋', style: { borderRadius: 0, background: '#141414', color: '#f0ede8', border: '1px solid #222222' } });
  };

  const recentHistory = history?.slice(0, 5) || [];

  return (
    <motion.div
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } }
      }}
      initial="hidden"
      animate="visible"
      style={{ overflow: 'hidden' }}
    >
      {/* HISTORY TABS */}
      {recentHistory.length > 1 && (
        <motion.div 
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          style={{ maxWidth: 960, margin: '0 auto', paddingTop: '32px' }} 
          className="px-[16px] md:px-[40px]"
        >
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', color: '#666666', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>
            ANALYSIS RESULTS
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 0, borderBottom: '1px solid #222222' }} className="overflow-x-auto no-scrollbar">
            {recentHistory.map(tab => {
              const isActive = tab.analysis_id === result?.analysis_id;
              const vColor = getVerdictColor(tab.verdict);
              return (
                <button
                  key={tab.analysis_id}
                  onClick={() => setCurrentResult(tab)}
                  style={{
                    padding: '8px 20px',
                    border: 'none',
                    borderBottom: isActive ? `2px solid ${vColor}` : '2px solid transparent',
                    background: isActive ? `${vColor}11` : 'transparent',
                    cursor: 'pointer',
                    fontFamily: '"DM Mono", monospace',
                    fontSize: '11px',
                    letterSpacing: '0.5px',
                    whiteSpace: 'nowrap',
                    color: isActive ? vColor : '#666666',
                    transition: 'color 0.2s',
                  }}
                  onMouseOver={(e) => { if (!isActive) e.target.style.color = '#f0ede8' }}
                  onMouseOut={(e) => { if (!isActive) e.target.style.color = '#666666' }}
                >
                  {tab.verdict}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ACTION BAR */}
      <motion.div 
        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
        style={{ maxWidth: 960, margin: '0 auto', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222222' }}
        className="px-[16px] md:px-[40px]"
      >
        <motion.button
          whileHover={{ x: -3 }}
          onClick={() => { clearResult(); setView('input'); window.scrollTo(0, 0); }}
          style={{ fontFamily: '"DM Mono", monospace', fontSize: '11px', color: '#666666', background: 'transparent', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}
          onMouseOver={(e) => e.target.style.color = '#f0ede8'}
          onMouseOut={(e) => e.target.style.color = '#666666'}
        >
          ← NEW ANALYSIS
        </motion.button>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleCopy}
            style={{
              border: '1px solid #333333', background: 'transparent', color: '#666666',
              fontFamily: '"DM Mono", monospace', fontSize: '10px', padding: '6px 14px', borderRadius: 0,
              textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.target.style.borderColor = '#f0ede8'; e.target.style.color = '#f0ede8'; }}
            onMouseOut={(e) => { e.target.style.borderColor = '#333333'; e.target.style.color = '#666666'; }}
          >
            COPY RESULT
          </button>
          <button
            style={{
              border: '1px solid #333333', background: 'transparent', color: '#666666',
              fontFamily: '"DM Mono", monospace', fontSize: '10px', padding: '6px 14px', borderRadius: 0,
              textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.target.style.borderColor = '#f0ede8'; e.target.style.color = '#f0ede8'; }}
            onMouseOut={(e) => { e.target.style.borderColor = '#333333'; e.target.style.color = '#666666'; }}
          >
            SHARE
          </button>
        </div>
      </motion.div>

      <VerdictBanner result={result} />
      <SummaryCard summary={result?.summary} domain_info={result?.domain_info} article_metadata={result?.article_metadata} />
      <FlagsAndTactics red_flags={result?.red_flags} credible_signals={result?.credible_signals} manipulation_tactics={result?.manipulation_tactics} verdict={result?.verdict} />
      <ReasoningCard reasoning={result?.reasoning} advice={result?.advice} />
      <CorroborationCard corroboration_results={result?.corroboration_results} />
      
      {/* Cited Sources Inline */}
      {result?.cited_sources?.length > 0 && (
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } }} style={{ maxWidth: 960, margin: '20px auto 0', padding: '0 40px' }} className="px-[16px] md:px-[40px]">
          <div style={{ background: '#141414', border: '1px solid #222222', borderRadius: 0, padding: '20px 24px' }}>
            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', color: '#666666', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px' }}>
              SOURCES CITED IN ARTICLE ({result.cited_sources.length})
            </div>
            {result.cited_sources.map((src, i) => (
              <div key={i} style={{ borderTop: i === 0 ? 'none' : '1px solid #222222', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '12px', fontWeight: 700, color: '#f0ede8' }}>{src.domain || src}</span>
                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '9px', border: '1px solid #333333', color: '#666666', padding: '2px 8px', borderRadius: 0 }}>CITED SOURCE</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

    </motion.div>
  );
};

export default function HomePage() {
  const [view, setView] = useState('input');
  const { currentResult, isLoading, loadingStage, error, analyzeContent, clearResult, history } = useAnalysis();

  useEffect(() => {
    if (!isLoading && currentResult && !error) setView('results');
    if (!isLoading && error && !currentResult) setView('input');
  }, [isLoading, currentResult, error]);

  useEffect(() => {
    if (view === 'input') document.title = "TruthLens — See Through the Noise";
    else if (view === 'loading') document.title = "Analyzing... — TruthLens";
    else if (view === 'results') document.title = `${currentResult?.verdict || "Result"} — TruthLens`;
  }, [view, currentResult]);

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', background: '#0d0d0d', paddingBottom: 80 }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 40px' }} className="px-[16px] md:px-[40px]">
          <TopHeaderBar />
        </div>
        
        <AnimatePresence mode="wait">
          {view === 'input' && (
            <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} transition={{ duration: 0.3 }}>
              <InputForm setView={setView} />
            </motion.div>
          )}
          {view === 'loading' && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} transition={{ duration: 0.3 }}>
              <LoadingView stage={loadingStage} clearResult={clearResult} setView={setView} />
            </motion.div>
          )}
          {view === 'results' && currentResult && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} transition={{ duration: 0.3 }}>
              <ResultsView result={currentResult} clearResult={clearResult} setView={setView} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
