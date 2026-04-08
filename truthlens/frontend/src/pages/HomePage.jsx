import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';

import PageTransition from '../components/PageTransition';
import CorroborationCard from '../components/results/CorroborationCard';
import FlagsAndTactics from '../components/results/FlagsAndTactics';
import ImageAnalysisCard from '../components/results/ImageAnalysisCard';
import ReasoningCard from '../components/results/ReasoningCard';
import SourcesCard from '../components/results/SourcesCard';
import SummaryCard from '../components/results/SummaryCard';
import VerdictBanner from '../components/results/VerdictBanner';
import LoadingOrb from '../components/three/LoadingOrb';
import { useAnalysis } from '../context/AnalysisContext';
import { buildResultSummary } from '../utils/helpers';

const SAMPLE_FAKE = {
  analysis_id: 'sample-fake',
  verdict: 'Likely Fake',
  credibility_score: 8,
  confidence: 'High',
  summary:
    'This content claims that COVID-19 vaccines contain microchips designed to track people and permanently alter human DNA through 5G networks, citing anonymous informants.',
  red_flags: [
    'No sources cited',
    'Anonymous sources only',
    'Contradicts medical consensus',
    'Emotional headline',
  ],
  credible_signals: [],
  manipulation_tactics: ['Appeal to Fear', 'Conspiracy Framing', 'False Urgency'],
  key_claims: [
    'Vaccines contain microchips',
    '5G activates the microchips',
    'Governments are hiding the truth',
  ],
  reasoning:
    'This text exhibits classic hallmarks of medical disinformation. It relies entirely on anonymous whistleblowers and lacks peer-reviewed evidence. The claims directly contradict global scientific consensus and use emotional manipulation to push urgency.',
  advice:
    'Do not share this content. Verify medical claims through the CDC or WHO. Avoid content that relies on fear-based language or anonymous rumors.',
  processing_time_ms: 1890,
  input_type: 'SHORT_CLAIM',
  timestamp: new Date().toISOString(),
  domain_info: {
    domain: 'anon-news-network.com',
    rating: 'Known Misinformation',
    bias: 'Extreme',
  },
  article_metadata: {
    domain: 'anon-news-network.com',
    title: 'Secret Leak: Vaccine Microchips Activated by 5G Towers',
  },
  cited_sources: [],
  corroboration_results: [],
};

const SAMPLE_REAL = {
  analysis_id: 'sample-real',
  verdict: 'Likely Real',
  credibility_score: 91,
  confidence: 'High',
  summary:
    'The IPCC released an assessment confirming global temperatures have risen 1.1 C above pre-industrial levels, based on 14,000 peer-reviewed studies authored by 234 scientists across 66 countries.',
  red_flags: [],
  credible_signals: [
    'Named expert sources',
    'Peer-reviewed study cited',
    'Neutral measured tone',
    'Verifiable statistics',
  ],
  manipulation_tactics: [],
  key_claims: [
    'The IPCC published the assessment',
    'Global temperatures have risen 1.1 C',
    'The report cites 14,000 peer-reviewed studies',
  ],
  reasoning:
    'The article cites a highly credible scientific body, includes specific and verifiable statistics, and maintains an objective tone. The claims are corroborated by multiple reputable institutions and are presented with clear sourcing.',
  advice:
    'This appears to be credible scientific reporting. You can verify the data directly on the official IPCC website or through multiple global news agencies.',
  processing_time_ms: 1325,
  input_type: 'ARTICLE',
  timestamp: new Date().toISOString(),
  domain_info: {
    domain: 'reuters.com',
    rating: 'Highly Credible',
    bias: 'Minimal',
  },
  article_metadata: {
    domain: 'reuters.com',
    title: 'IPCC Report Confirms 1.1 C Global Temperature Rise',
  },
  cited_sources: [
    { domain: 'ipcc.ch', rating: 'Highly Credible', bias: 'Minimal' },
    { domain: 'reuters.com', rating: 'Highly Credible', bias: 'Minimal' },
  ],
  corroboration_results: [],
};

const SAMPLE_MISLEADING = {
  analysis_id: 'sample-misleading',
  verdict: 'Misleading',
  credibility_score: 44,
  confidence: 'High',
  summary:
    "While the underlying statistic may be technically accurate, the framing is highly distorted. A single week's fluctuation is being used to portray an economic collapse, which is classic cherry-picking.",
  red_flags: ['Misleading headline', 'Missing context', 'Loaded language'],
  credible_signals: ['Uses a real export statistic'],
  manipulation_tactics: ['Cherry-Picking', 'False Equivalence'],
  key_claims: [
    'Exports dipped by 0.5 percent in one week',
    'The economy is collapsing',
  ],
  reasoning:
    "The article takes a legitimate 0.5 percent dip in weekly exports and uses loaded language like 'economic collapse' to create a false narrative of crisis. This is a common tactic where a technically true data point is used to support an exaggerated conclusion.",
  advice:
    'Verify the same data against non-partisan financial reporting agencies. Look for long-term charts instead of single-point comparisons.',
  processing_time_ms: 1545,
  input_type: 'ARTICLE',
  timestamp: new Date().toISOString(),
  domain_info: {
    domain: 'market-insider-daily.com',
    rating: 'Mixed',
    bias: 'High',
  },
  article_metadata: {
    domain: 'market-insider-daily.com',
    title: 'Economic Collapse: New Data Shows 0.5 Percent Dip In Weekly Exports',
  },
  cited_sources: [],
  corroboration_results: [],
};

const STAGE_LABELS = {
  idle: 'PREPARING ANALYSIS...',
  fetching_url: 'FETCHING ARTICLE FROM URL...',
  analyzing: 'AI IS READING THE CONTENT...',
  corroborating: 'SEARCHING THE WEB FOR EVIDENCE...',
  finalizing: 'GENERATING YOUR VERDICT...',
};

const STAGE_STEPS = ['INPUT', 'EXTRACT', 'ANALYZE', 'SEARCH', 'VERDICT'];
const STAGE_INDEX = { idle: 0, fetching_url: 1, analyzing: 2, corroborating: 3, finalizing: 4 };

const RESULT_TABS = [
  { label: 'Likely Fake', result: SAMPLE_FAKE },
  { label: 'Likely Real', result: SAMPLE_REAL },
  { label: 'Misleading', result: SAMPLE_MISLEADING },
];

const actionButtonStyle = {
  background: 'transparent',
  border: '1px solid #222222',
  color: '#f0ede8',
  fontFamily: "'DM Mono', monospace",
  fontSize: 10,
  cursor: 'pointer',
  textTransform: 'uppercase',
  letterSpacing: 1,
  padding: '8px 14px',
  transition: 'border-color 0.15s ease, color 0.15s ease',
};

function PageHeader({ backendStatus }) {
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
        alignItems: 'center',
        gap: 16,
      }}
    >
      <div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, letterSpacing: 3 }}>
          <span style={{ color: '#f0ede8' }}>TRUTH</span>
          <span style={{ color: '#47ff8f' }}>LENS</span>
        </div>

        {backendStatus === 'starting' && (
          <div className="backend-status starting">
            Connecting to analysis server... (first load may take 30-40 seconds)
          </div>
        )}
        {backendStatus === 'offline' && (
          <div className="backend-status offline">
            Analysis server unavailable. First load can take a bit; if this persists, verify the backend URL.
          </div>
        )}
      </div>

      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: '#666666',
          letterSpacing: 1,
          textTransform: 'uppercase',
        }}
      >
        See Through the Noise
      </div>
    </motion.div>
  );
}

function InputView({
  textValue,
  urlValue,
  urlError,
  handleSubmit,
  inputType,
  isLoading,
  submitError,
  error,
  onTextChange,
  onUrlChange,
}) {
  const onFormSubmit = (event) => {
    event.preventDefault();
    handleSubmit();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ paddingTop: 32, paddingBottom: 24 }}>
      <form onSubmit={onFormSubmit}>
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            color: '#666666',
            letterSpacing: 2,
            textTransform: 'uppercase',
            marginBottom: 10,
          }}
        >
          PASTE ARTICLE / URL / CLAIM
        </div>

        <textarea
          value={textValue}
          onChange={(event) => onTextChange(event.target.value)}
          placeholder="Paste any news article, social media post, or claim here..."
          style={{
            width: '100%',
            minHeight: 120,
            maxHeight: 300,
            resize: 'vertical',
            background: '#141414',
            border: '1px solid #222222',
            borderRadius: 0,
            color: '#f0ede8',
            fontFamily: "'DM Mono', monospace",
            fontSize: 13,
            lineHeight: 1.7,
            padding: 16,
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.15s ease',
            display: 'block',
          }}
          onFocus={(event) => {
            event.target.style.borderColor = '#444444';
          }}
          onBlur={(event) => {
            event.target.style.borderColor = '#222222';
          }}
        />

        {inputType === 'SHORT_CLAIM' && (
          <span className="input-type-badge short-claim">Analyzing as: Short Claim</span>
        )}

        <div style={{ borderTop: '1px solid #222222', margin: '20px 0' }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }} className="url-row">
          <div style={{ flex: 1 }}>
            <input
              type="text"
              value={urlValue}
              onChange={(event) => onUrlChange(event.target.value)}
              placeholder="Or enter a URL - https://..."
              style={{
                width: '100%',
                height: 44,
                background: '#141414',
                border: `1px solid ${urlError ? '#ff4747' : '#222222'}`,
                borderRadius: 0,
                color: '#f0ede8',
                fontFamily: "'DM Mono', monospace",
                fontSize: 12,
                padding: '0 14px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s ease',
              }}
              onFocus={(event) => {
                if (!urlError) event.target.style.borderColor = '#444444';
              }}
              onBlur={(event) => {
                if (!urlError) event.target.style.borderColor = '#222222';
              }}
            />

            {inputType === 'URL' && <span className="input-type-badge url">Analyzing as: URL</span>}

            {urlError && (
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  color: '#ff4747',
                  marginTop: 5,
                }}
              >
                {urlError}
              </div>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={!isLoading ? { backgroundColor: '#47ff8f' } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
            style={{
              height: 44,
              padding: '0 28px',
              background: isLoading ? '#333333' : '#f0ede8',
              color: '#0d0d0d',
              border: 'none',
              borderRadius: 0,
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 18,
              letterSpacing: 2,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'background 0.15s ease',
            }}
          >
            {isLoading ? 'ANALYZING...' : 'ANALYZE'}
          </motion.button>
        </div>
      </form>

      {submitError && (
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: '#ff4747',
            marginTop: 8,
          }}
        >
          {submitError}
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: 20,
            borderLeft: '3px solid #ff4747',
            padding: '12px 16px',
            background: 'rgba(255,71,71,0.06)',
          }}
        >
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#ff4747' }}>
            {error}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function LoadingView({ loadingStage }) {
  const activeIndex = STAGE_INDEX[loadingStage] ?? STAGE_STEPS.length - 1;
  const stageLabel = STAGE_LABELS[loadingStage] || loadingStage || 'PROCESSING...';

  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 32,
        padding: '40px 0',
        borderTop: '1px solid #222222',
      }}
    >
      <LoadingOrb />
      <div
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 28,
          letterSpacing: 3,
          color: '#f0ede8',
        }}
      >
        {stageLabel}
      </div>
      <div style={{ display: 'flex', width: '100%', maxWidth: 400 }}>
        {STAGE_STEPS.map((label, index) => (
          <div
            key={label}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                background:
                  index < activeIndex ? '#47ff8f' : index === activeIndex ? '#f0ede8' : '#333333',
                animation: index === activeIndex ? 'step-pulse-ring 1.5s infinite' : 'none',
              }}
            />
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 8,
                color: index <= activeIndex ? '#f0ede8' : '#333333',
                marginTop: 8,
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ResultsDashboard({ result, isSample = false, copyLabel, shareLabel, onCopy, onClear }) {
  if (!result) return null;

  const accentColor = isSample ? '#ff9147' : '#47ff8f';
  const accentBackground = isSample ? 'rgba(255,145,71,0.08)' : 'rgba(71,255,143,0.08)';
  const accentBorder = isSample ? 'rgba(255,145,71,0.3)' : 'rgba(71,255,143,0.3)';

  return (
    <div style={{ paddingBottom: 80 }}>
      <div
        style={{
          maxWidth: 960,
          margin: '0 auto',
          padding: '20px 40px 0',
        }}
        className="results-container-padding"
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            paddingBottom: 20,
            borderBottom: '1px solid #222222',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 16,
              color: accentColor,
              textTransform: 'uppercase',
              letterSpacing: 2,
              background: accentBackground,
              padding: '10px 20px',
              border: `1px solid ${accentBorder}`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              fontWeight: 700,
            }}
          >
            {isSample ? 'GUIDED EXAMPLE' : 'LIVE ANALYSIS RESULT'}
          </div>

          {!isSample && (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginLeft: 'auto' }}>
              <button onClick={onCopy} style={actionButtonStyle} type="button">
                {copyLabel}
              </button>
              <button onClick={onCopy} style={actionButtonStyle} type="button">
                {shareLabel}
              </button>
              <button
                onClick={onClear}
                style={{ ...actionButtonStyle, color: '#666666' }}
                type="button"
              >
                [ CLEAR RESULT ]
              </button>
            </div>
          )}
        </div>
      </div>

      <VerdictBanner result={result} />
      <SummaryCard
        summary={result.summary}
        domain_info={result.domain_info}
        article_metadata={result.article_metadata}
      />
      <FlagsAndTactics
        red_flags={result.red_flags}
        credible_signals={result.credible_signals}
        manipulation_tactics={result.manipulation_tactics}
        verdict={result.verdict}
      />
      <ReasoningCard reasoning={result.reasoning} advice={result.advice} />

      {result.cited_sources?.length > 0 && (
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 40px' }} className="px-[16px] md:px-[40px]">
          <SourcesCard cited_sources={result.cited_sources} />
        </div>
      )}

      <CorroborationCard corroboration_results={result.corroboration_results} />
      <ImageAnalysisCard image_analysis={result.image_analysis} />
    </div>
  );
}

export default function HomePage() {
  const [view, setView] = useState('input');
  const [textValue, setTextValue] = useState('');
  const [urlValue, setUrlValue] = useState('');
  const [urlError, setUrlError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [copyLabel, setCopyLabel] = useState('Copy Result');
  const [shareLabel, setShareLabel] = useState('Share');
  const [inputType, setInputType] = useState(null);
  const [activeSample, setActiveSample] = useState(SAMPLE_MISLEADING);
  const [showSamples, setShowSamples] = useState(true);

  const copyResetTimer = useRef(null);

  const {
    currentResult,
    history,
    isLoading,
    loadingStage,
    error,
    backendStatus,
    analyzeContent,
    clearResult,
  } = useAnalysis();

  const resetCopyFeedback = useCallback(() => {
    setCopyLabel('Copy Result');
    setShareLabel('Share');
  }, []);

  const detectInputType = useCallback((value) => {
    const trimmed = value.trim();

    if (!trimmed) {
      setInputType(null);
    } else if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      setInputType('URL');
    } else if (trimmed.length < 150) {
      setInputType('SHORT_CLAIM');
    } else {
      setInputType('ARTICLE');
    }
  }, []);

  const updateDetectedInputType = useCallback(
    (nextText, nextUrl) => {
      if (nextUrl.trim()) {
        detectInputType(nextUrl);
        return;
      }

      detectInputType(nextText);
    },
    [detectInputType]
  );

  const handleTextChange = useCallback(
    (value) => {
      const nextValue = value.length <= 50000 ? value : value.slice(0, 50000);
      setTextValue(nextValue);

      if (value.length > 50000) {
        toast('Truncated to 50,000 characters');
      }

      updateDetectedInputType(nextValue, urlValue);
    },
    [updateDetectedInputType, urlValue]
  );

  const handleUrlChange = useCallback(
    (value) => {
      setUrlValue(value);
      setUrlError('');
      updateDetectedInputType(textValue, value);
    },
    [textValue, updateDetectedInputType]
  );

  useEffect(() => {
    if (!currentResult && !isLoading && history.length === 0) {
      setShowSamples(true);
      setView('results');
    }
  }, [currentResult, history, isLoading]);

  useEffect(() => {
    if (isLoading) {
      setView('loading');
      setShowSamples(false);
    } else if (currentResult && !error) {
      setView('results');
      setShowSamples(false);
    } else if (error && !currentResult) {
      setView('input');
      setShowSamples(false);
    }
  }, [isLoading, currentResult, error]);

  useEffect(() => {
    return () => {
      if (copyResetTimer.current) {
        window.clearTimeout(copyResetTimer.current);
      }
    };
  }, []);

  const handleSubmit = useCallback(() => {
    setSubmitError('');
    setUrlError('');

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

    analyzeContent(inputToSend);
  }, [analyzeContent, textValue, urlValue]);

  const handleCopy = useCallback(async () => {
    if (!currentResult) return;

    const text = buildResultSummary(currentResult);

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard API unavailable');
      }

      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    setCopyLabel('Copied!');
    setShareLabel('Copied!');

    if (copyResetTimer.current) {
      window.clearTimeout(copyResetTimer.current);
    }

    copyResetTimer.current = window.setTimeout(() => {
      resetCopyFeedback();
    }, 2000);
  }, [currentResult, resetCopyFeedback]);

  const handleNewAnalysis = useCallback(() => {
    clearResult();
    setView('input');
    setShowSamples(true);
    setTextValue('');
    setUrlValue('');
    setSubmitError('');
    setUrlError('');
    setInputType(null);
    resetCopyFeedback();

    if (copyResetTimer.current) {
      window.clearTimeout(copyResetTimer.current);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [clearResult, resetCopyFeedback]);

  const handleSampleSelect = useCallback(
    (sample) => {
      clearResult();
      setActiveSample(sample);
      setShowSamples(true);
      setView('results');
      resetCopyFeedback();
    },
    [clearResult, resetCopyFeedback]
  );

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', background: '#0d0d0d', color: '#f0ede8' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 40px' }} className="editorial-container">
          <PageHeader backendStatus={backendStatus} />

          <InputView
            textValue={textValue}
            urlValue={urlValue}
            urlError={urlError}
            handleSubmit={handleSubmit}
            inputType={inputType}
            isLoading={isLoading}
            submitError={submitError}
            error={error}
            onTextChange={handleTextChange}
            onUrlChange={handleUrlChange}
          />

          <div style={{ marginTop: 24, paddingTop: 12, borderTop: '2px solid #1a1a1a' }}>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                color: '#444444',
                textTransform: 'uppercase',
                letterSpacing: 2,
                marginBottom: 14,
              }}
            >
              ANALYSIS RESULTS
            </div>

            <div style={{ display: 'flex', borderBottom: '1px solid #1a1a1a', gap: 4, flexWrap: 'wrap' }}>
              {RESULT_TABS.map((tab) => {
                const isSelected = showSamples && activeSample.analysis_id === tab.result.analysis_id;

                return (
                  <button
                    key={tab.label}
                    onClick={() => handleSampleSelect(tab.result)}
                    style={{
                      padding: '10px 24px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 11,
                      color: isSelected ? '#f0ede8' : '#555555',
                      borderBottom: isSelected ? '2px solid #f0ede8' : '2px solid transparent',
                      transition: 'all 0.2s',
                      marginBottom: -1,
                    }}
                    type="button"
                  >
                    {tab.label}
                  </button>
                );
              })}

              {!showSamples && !isLoading && currentResult && (
                <button
                  style={{
                    padding: '10px 24px',
                    background: 'transparent',
                    border: 'none',
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 11,
                    color: '#47ff8f',
                    borderBottom: '2px solid #47ff8f',
                    marginBottom: -1,
                  }}
                  type="button"
                >
                  LIVE ANALYSIS
                </button>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {view === 'loading' && <LoadingView key="loading" loadingStage={loadingStage} />}

            {view === 'results' && showSamples && (
              <motion.div key="samples" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ResultsDashboard result={activeSample} isSample={true} />
              </motion.div>
            )}

            {view === 'results' && !showSamples && currentResult && (
              <motion.div key="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ResultsDashboard
                  result={currentResult}
                  copyLabel={copyLabel}
                  shareLabel={shareLabel}
                  onCopy={handleCopy}
                  onClear={handleNewAnalysis}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
