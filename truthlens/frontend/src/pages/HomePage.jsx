import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'
import { useAnalysis } from '../context/AnalysisContext'
import {
  getVerdictColor, getVerdictBg,
  formatTimestamp, formatDuration, extractDomain
} from '../utils/helpers'
import toast from 'react-hot-toast'
import PageTransition from '../components/PageTransition'
import LoadingOrb from '../components/three/LoadingOrb'

/**
 * TRUTHLENS — AI-Powered Fake News & Misinformation Detector
 * PHASE 3: GUIDED TUTORIAL DASHBOARD (3 Sample Categories + Live Results)
 */

const SAMPLE_FAKE = {
  analysis_id: 'sample-fake',
  verdict: 'Likely Fake',
  credibility_score: 8,
  confidence: 'High',
  summary: "This content claims that COVID-19 vaccines contain microchips designed to track individuals and permanently alter human DNA through 5G networks, citing anonymous informants.",
  red_flags: ['No sources cited', 'Anonymous sources only', 'Contradicts medical consensus', 'Emotional headline'],
  manipulation_tactics: ['Appeal to Fear', 'Conspiracy Framing', 'False Urgency'],
  reasoning: "This text exhibits classic hallmarks of medical disinformation. It relies entirely on anonymous whistleblowers and lacks any peer-reviewed evidence. The assertion about vaccine microchips directly contradicts global scientific consensus. Language uses emotional manipulation and manufactured urgency typical of known disinformation campaigns.",
  advice: "Do not share this content. Verify medical claims through the CDC or WHO. Avoid sharing content that uses fear-based language or anonymous rumors.",
  timestamp: new Date().toISOString(),
  article_metadata: { domain: 'anon-news-network.com', title: 'SECRET LEAK: Vaccine Microchips Activated by 5G Towers' }
}

const SAMPLE_REAL = {
  analysis_id: 'sample-real',
  verdict: 'Likely Real',
  credibility_score: 91,
  confidence: 'High',
  summary: "The IPCC released an assessment confirming global temperatures have risen 1.1°C above pre-industrial levels, based on 14,000 peer-reviewed studies authored by 234 scientists across 66 countries.",
  credible_signals: ['Named expert sources', 'Peer-reviewed study cited', 'Neutral measured tone', 'Verifiable statistics'],
  red_flags: [],
  manipulation_tactics: [],
  reasoning: "The article presents data from the Intergovernmental Panel on Climate Change (IPCC), a highly credible scientific body. It cites specific, verifiable statistics and a massive volume of peer-reviewed research. The tone is objective and reportorial, avoiding emotional manipulation or sensationalist framing.",
  advice: "This appears to be highly credible scientific reporting. You can verify the data directly on the official IPCC website or through multiple global news agencies.",
  timestamp: new Date().toISOString(),
  article_metadata: { domain: 'reuters.com', title: 'IPCC Report Confirming 1.1°C Global Temperature Rise' }
}

const SAMPLE_MISLEADING = {
  analysis_id: 'sample-misleading',
  verdict: 'Misleading',
  credibility_score: 44,
  confidence: 'High',
  summary: "While the underlying statistic may be technically accurate, the framing is highly distorted. Taking a single week's minor fluctuation and using catastrophic language to portray it as an economic collapse is classic cherry-picking. The narrative intent heavily outweighs the raw data.",
  red_flags: ['Misleading headline', 'Missing context', 'Loaded language'],
  manipulation_tactics: ['Cherry-Picking', 'False Equivalence'],
  reasoning: "The article takes a legitimate 0.5% dip in weekly exports and uses loaded terms like 'Economic Collapse' to create a narrative of crisis. This is a common manipulation tactic where technically true data is used to support a false or exaggerated conclusion.",
  advice: "Verify the same data against non-partisan financial reporting agencies. Look for longitudinal charts instead of single-point comparisons.",
  timestamp: new Date().toISOString(),
  article_metadata: { domain: 'market-insider-daily.com', title: 'ECONOMIC COLLAPSE: New Data Shows 0.5% Dip In Weekly Exports' }
}

const EXAMPLE_FAKE_TXT = "URGENT!!! Scientists BANNED from telling you this secret — Big Pharma doesn't want you to know that drinking bleach mixed with apple cider vinegar CURES all diseases including cancer!! Share before they delete this!! The government is hiding the TRUTH about natural cures that work 100% of the time with NO side effects!!! SHARE IMMEDIATELY before this post gets deleted by the deep state operatives!! Forward to everyone you know!!!"

const EXAMPLE_REAL_TXT = "A comprehensive peer-reviewed study published in the journal Nature Medicine, involving 8,200 participants across 22 countries, has confirmed that regular moderate exercise reduces the risk of cardiovascular disease by 35 percent. The 10-year longitudinal research, led by Dr. Priya Sharma at Stanford Medical School, was funded by the National Institutes of Health and has been independently replicated by researchers in Germany and South Korea."

const STAGE_LABELS = {
  idle:          'PREPARING ANALYSIS...',
  fetching_url:  'FETCHING ARTICLE FROM URL...',
  analyzing:     'AI IS READING THE CONTENT...',
  corroborating: 'SEARCHING THE WEB FOR EVIDENCE...',
  finalizing:    'GENERATING YOUR VERDICT...',
}

const STAGE_STEPS = ['INPUT', 'EXTRACT', 'ANALYZE', 'SEARCH', 'VERDICT']
const STAGE_INDEX = { idle: 0, fetching_url: 1, analyzing: 2, corroborating: 3, finalizing: 4 }

export default function HomePage() {
  const [view, setView] = useState('input')
  const [textValue, setTextValue] = useState('')
  const [urlValue, setUrlValue] = useState('')
  const [urlError, setUrlError] = useState('')
  const [submitError, setSubmitError] = useState('')

  // State for Guided Tutorial Samples
  const [activeSample, setActiveSample] = useState(SAMPLE_MISLEADING)
  const [showSamples, setShowSamples] = useState(true)

  const {
    currentResult, history, isLoading, loadingStage,
    error, analyzeContent, clearResult, setCurrentResult
  } = useAnalysis()

  // On mount, ensure we show samples if no history
  useEffect(() => {
    if (!currentResult && !isLoading && history.length === 0) {
      setShowSamples(true)
      setView('results')
    }
  }, [currentResult, history, isLoading])

  // Sync view state with context
  useEffect(() => {
    if (isLoading) {
      setView('loading')
      setShowSamples(false)
    } else if (currentResult && !error) {
      setView('results')
      setShowSamples(false)
    } else if (error && !currentResult) {
      setView('input')
      setShowSamples(false)
    }
  }, [isLoading, currentResult, error])

  // Submit Handler
  const handleSubmit = useCallback(() => {
    setSubmitError('')
    setUrlError('')

    let inputToSend = ''

    if (urlValue.trim().length > 0) {
      if (!urlValue.trim().startsWith('http://') && !urlValue.trim().startsWith('https://')) {
        setUrlError('URL must start with http:// or https://')
        return
      }
      inputToSend = urlValue.trim()
    } else if (textValue.trim().length > 0) {
      if (textValue.trim().length < 30) {
        setSubmitError('Please enter at least 30 characters.')
        return
      }
      inputToSend = textValue.trim()
    } else {
      setSubmitError('Please enter a URL or paste some text to analyze.')
      return
    }

    analyzeContent(inputToSend)
  }, [urlValue, textValue, analyzeContent])

  const handleExampleTxt = useCallback((text) => {
    setTextValue(text)
    setUrlValue('')
    setSubmitError('')
    setUrlError('')
  }, [])

  const handleCopy = useCallback(async (res) => {
    if (!res) return
    const text = [
      'TruthLens Analysis',
      '='.repeat(40),
      `Verdict: ${res.verdict}`,
      `Credibility Score: ${res.credibility_score}/100`,
      `Confidence: ${res.confidence}`,
      '',
      'Summary:',
      res.summary || 'N/A',
      '',
      `Red Flags: ${res.red_flags?.join(', ') || 'None'}`,
      `Manipulation Tactics: ${res.manipulation_tactics?.join(', ') || 'None'}`,
      '',
      'Reasoning:',
      res.reasoning || 'N/A',
      '',
      'Advice:',
      res.advice || 'N/A',
      '',
      `Analyzed: ${formatTimestamp(res.timestamp)}`,
    ].join('\n')

    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard!')
    } catch {
      toast.error('Could not copy to clipboard.')
    }
  }, [])

  const handleNewAnalysis = useCallback(() => {
    clearResult()
    setView('input')
    setShowSamples(true) // Show samples again for guidance if cleared
    setTextValue('')
    setUrlValue('')
    setSubmitError('')
    setUrlError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [clearResult])

  // SUB-COMPONENTS ───────────────────────────────────────────

  const PageHeader = () => (
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
      }}
    >
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, letterSpacing: 3 }}>
        <span style={{ color: '#f0ede8' }}>TRUTH</span>
        <span style={{ color: '#47ff8f' }}>LENS</span>
      </div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#666666', letterSpacing: 1, textTransform: 'uppercase' }}>
        See Through the Noise
      </div>
    </motion.div>
  )

  const InputView = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ paddingTop: 32, paddingBottom: 24 }}
    >
      <div style={{ fontFamily: "'DM Mono'", fontSize: 10, color: '#666666', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
        PASTE ARTICLE / URL / CLAIM
      </div>

      <textarea
        value={textValue}
        onChange={(e) => {
          const val = e.target.value
          if (val.length <= 50000) {
            setTextValue(val)
          } else {
            setTextValue(val.slice(0, 50000))
            toast('Truncated to 50,000 characters', { icon: '✂️' })
          }
        }}
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
        onFocus={(e) => { e.target.style.borderColor = '#444444' }}
        onBlur={(e) => { e.target.style.borderColor = '#222222' }}
      />

      <div style={{ borderTop: '1px solid #222222', margin: '20px 0' }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }} className="url-row-flex">
        <div style={{ flex: 1 }}>
          <input
            type="text"
            value={urlValue}
            onChange={(e) => { setUrlValue(e.target.value); setUrlError('') }}
            placeholder="Or enter a URL — https://..."
            style={{
              width: '100%',
              height: 44,
              background: '#141414',
              border: `1px solid ${urlError ? '#ff4747' : '#222222'}`,
              borderRadius: 0,
              color: '#f0ede8',
              fontFamily: "'DM Mono'",
              fontSize: 12,
              padding: '0 14px',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s ease',
            }}
            onFocus={(e) => { if (!urlError) e.target.style.borderColor = '#444444' }}
            onBlur={(e) => { if (!urlError) e.target.style.borderColor = '#222222' }}
          />
          {urlError && (
            <div style={{ fontFamily: "'DM Mono'", fontSize: 10, color: '#ff4747', marginTop: 5 }}>
              {urlError}
            </div>
          )}
        </div>

        <motion.button
          onClick={handleSubmit}
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
            fontFamily: "'Bebas Neue'",
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

      {submitError && (
        <div style={{ fontFamily: "'DM Mono'", fontSize: 11, color: '#ff4747', marginTop: 8 }}>
          {submitError}
        </div>
      )}

      {error && (
        <div style={{ marginTop: 20, borderLeft: '3px solid #ff4747', padding: '12px 16px', background: 'rgba(255,71,71,0.06)' }}>
          <div style={{ fontFamily: "'DM Mono'", fontSize: 12, color: '#ff4747' }}>{error}</div>
        </div>
      )}
    </motion.div>
  )

  const LoadingView = () => {
    const activeIndex = STAGE_INDEX[loadingStage] ?? 0

    return (
      <motion.div
        key="loading"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          gap: 32, padding: '40px 0', borderTop: '1px solid #222222',
        }}
      >
        <LoadingOrb />
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: 28, letterSpacing: 3, color: '#f0ede8' }}>
          {STAGE_LABELS[loadingStage] || 'PROCESSING...'}
        </div>
        <div style={{ display: 'flex', width: '100%', maxWidth: 400 }}>
          {STAGE_STEPS.map((label, i) => (
            <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 10, height: 10, background: i < activeIndex ? '#47ff8f' : i === activeIndex ? '#f0ede8' : '#333333',
                animation: i === activeIndex ? 'step-pulse-ring 1.5s infinite' : 'none'
              }} />
              <div style={{ fontFamily: "'DM Mono'", fontSize: 8, color: i <= activeIndex ? '#f0ede8' : '#333333', marginTop: 8 }}>{label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    )
  }

  // RESULTS COMPONENT (DYNAMIC SAMPLES OR LIVE REULT) ─────────────────────────

  const ResultsDashboard = ({ res, isSample = false }) => {
    if (!res) return null
    const verdictColor = getVerdictColor(res.verdict)
    
    // Score Animation
    const count = useMotionValue(0)
    const rounded = useTransform(count, v => Math.round(v))
    useEffect(() => { count.set(0); animate(count, res.credibility_score || 0, { duration: 1.2 }) }, [res])

    return (
      <div style={{ paddingBottom: 80 }}>
        {/* ACTION BAR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #222222' }}>
          <div style={{ 
            fontFamily: "'DM Mono'", 
            fontSize: 16, 
            color: isSample ? '#ff9147' : '#47ff8f', 
            textTransform: 'uppercase', 
            letterSpacing: 2,
            background: isSample ? 'rgba(255,145,71,0.08)' : 'rgba(71,255,143,0.08)',
            padding: '10px 20px',
            border: `1px solid ${isSample ? 'rgba(255,145,71,0.3)' : 'rgba(71,255,143,0.3)'}`,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            fontWeight: 700
          }}>
            {isSample ? '✦ GUIDED EXAMPLE' : '✦ LIVE ANALYSIS RESULT'}
          </div>
          {!isSample && (
            <button
               onClick={handleNewAnalysis}
               style={{ background: 'none', border: 'none', color: '#666666', fontFamily: "'DM Mono'", fontSize: 10, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1 }}
            >
              [ CLEAR RESULT ]
            </button>
          )}
        </div>

        {/* VERDICT BANNER */}
        <motion.div
           initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
           style={{ background: '#141414', borderLeft: `5px solid ${verdictColor}`, padding: '24px 28px', marginTop: 24 }}
        >
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: 64, color: verdictColor, letterSpacing: 2, lineHeight: 1 }}>
            {(res.verdict || '').toUpperCase()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 20 }}>
            <div style={{ flex: 1, height: 4, background: '#222222' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${res.credibility_score}%` }} transition={{ duration: 1 }} style={{ height: '100%', background: verdictColor }} />
            </div>
            <div style={{ fontFamily: "'DM Mono'", fontSize: 14, color: verdictColor }}>
              <motion.span>{rounded}</motion.span> / 100
            </div>
            <div style={{ border: `1px solid ${verdictColor}`, color: verdictColor, padding: '3px 10px', fontSize: 10, fontFamily: "'DM Mono'" }}>
              {res.confidence} CONFIDENCE
            </div>
          </div>
        </motion.div>

        {/* WHAT THIS CLAIMS */}
        <div style={{ background: '#141414', border: '1px solid #222222', padding: '20px 24px', marginTop: 16 }}>
          <div className="label-editorial" style={{ marginBottom: 12 }}>WHAT THIS CLAIMS</div>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 16, lineHeight: 1.8, color: '#f0ede8' }}>
            {res.summary}
          </div>
        </div>

        {/* FLAGS & TACTICS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }} className="editorial-grid">
          <div style={{ background: '#141414', border: '1px solid #222222', padding: '20px 24px' }}>
            <div className="label-editorial" style={{ marginBottom: 14 }}>{res.verdict === 'Likely Real' ? 'CREDIBLE SIGNALS' : 'RED FLAGS'}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {res.verdict === 'Likely Real' 
                ? (res.credible_signals?.map((s, i) => <div key={i} className="tag-editorial tag-green">{s}</div>) || <div style={{ color: '#444' }}>-</div>)
                : (res.red_flags?.map((f, i) => <div key={i} className="tag-editorial tag-red">{f}</div>) || <div style={{ color: '#444' }}>-</div>)
              }
              {res.verdict === 'Likely Real' && res.red_flags?.length === 0 && <div className="tag-editorial tag-outline">NO RED FLAGS DETECTED</div>}
            </div>
          </div>
          <div style={{ background: '#141414', border: '1px solid #222222', padding: '20px 24px' }}>
            <div className="label-editorial" style={{ marginBottom: 14 }}>MANIPULATION TACTICS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {res.manipulation_tactics?.length > 0 
                ? res.manipulation_tactics.map((t, i) => <div key={i} className="tag-editorial tag-amber">{t}</div>)
                : <div className="tag-editorial tag-outline">NONE DETECTED</div>
              }
            </div>
          </div>
        </div>

        <div style={{ background: '#141414', border: '1px solid #222222', padding: '20px 24px', marginTop: 16 }}>
          <div className="label-editorial" style={{ marginBottom: 12 }}>WHY THIS VERDICT?</div>
          <div style={{ fontFamily: "'DM Mono'", fontSize: 13, lineHeight: 2, color: '#f0ede8' }}>{res.reasoning}</div>
        </div>

        <div style={{ background: '#141414', border: '1px solid #222222', padding: '20px 24px', marginTop: 16 }}>
          <div className="label-editorial" style={{ marginBottom: 12 }}>WHAT SHOULD YOU DO?</div>
          <div style={{ fontFamily: "'DM Mono'", fontSize: 13, lineHeight: 2, color: '#f0ede8' }}>{res.advice}</div>
        </div>
      </div>
    )
  }

  // ASSEMBLY ───────────────────────────────────────────────────────────────────

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', background: '#0d0d0d', color: '#f0ede8' }}>
        <style>{`
          .label-editorial { font-family: 'DM Mono'; font-size: 10px; color: #666; letter-spacing: 2px; text-transform: uppercase; }
          .tag-editorial { padding: 4px 10px; font-family: 'DM Mono'; font-size: 10px; text-transform: uppercase; }
          .tag-red   { border: 1px solid #ff4747; color: #ff4747; background: rgba(255,71,71,0.05); }
          .tag-green { border: 1px solid #47ff8f; color: #47ff8f; background: rgba(71,255,143,0.05); }
          .tag-amber { border: 1px solid #ff9147; color: #ff9147; background: rgba(255,145,71,0.05); }
          .tag-outline { border: 1px solid #333; color: #666; }
          @keyframes step-pulse-ring {
            0% { box-shadow: 0 0 0 0 rgba(240, 237, 232, 0.4); }
            70% { box-shadow: 0 0 0 8px rgba(240, 237, 232, 0); }
            100% { box-shadow: 0 0 0 0 rgba(240, 237, 232, 0); }
          }
          @media (max-width: 640px) {
            .editorial-grid { grid-template-columns: 1fr !important; }
            .url-row-flex { flex-direction: column !important; }
          }
        `}</style>

        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 40px' }} className="editorial-container">
          <PageHeader />
          <InputView />

          {/* ANALYSIS RESULTS TAB BAR (Guided vs Live) */}
          <div style={{ marginTop: 24, padding: '12px 0 0 0', borderTop: '2px solid #1a1a1a' }}>
            <div style={{ fontFamily: "'DM Mono'", fontSize: 10, color: '#444', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 14 }}>
              ANALYSIS RESULTS
            </div>

            <div style={{ display: 'flex', borderBottom: '1px solid #1a1a1a', gap: 4 }}>
              {[
                { label: 'Likely Fake', res: SAMPLE_FAKE },
                { label: 'Likely Real', res: SAMPLE_REAL },
                { label: 'Misleading', res: SAMPLE_MISLEADING }
              ].map((tab) => {
                const isSelected = showSamples && activeSample.analysis_id === tab.res.analysis_id
                return (
                  <button
                    key={tab.label}
                    onClick={() => { setActiveSample(tab.res); setShowSamples(true); clearResult(); }}
                    style={{
                      padding: '10px 24px', background: 'transparent', border: 'none', cursor: 'pointer',
                      fontFamily: "'DM Mono'", fontSize: 11,
                      color: isSelected ? '#f0ede8' : '#555',
                      borderBottom: isSelected ? '2px solid #f0ede8' : '2px solid transparent',
                      transition: 'all 0.2s', marginBottom: -1
                    }}
                  >
                    {tab.label}
                  </button>
                )
              })}
              
              {/* Live Result Tab (Only if exists) */}
              {!showSamples && !isLoading && currentResult && (
                <button
                  style={{
                    padding: '10px 24px', background: 'transparent', border: 'none',
                    fontFamily: "'DM Mono'", fontSize: 11, color: '#47ff8f',
                    borderBottom: '2px solid #47ff8f', marginBottom: -1
                  }}
                >
                  LIVE ANALYSIS
                </button>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {view === 'loading' && <LoadingView key="loading" />}
            
            {view === 'results' && showSamples && (
              <motion.div key="samples" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ResultsDashboard res={activeSample} isSample={true} />
              </motion.div>
            )}

            {view === 'results' && !showSamples && currentResult && (
              <motion.div key="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ResultsDashboard res={currentResult} isSample={false} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  )
}
