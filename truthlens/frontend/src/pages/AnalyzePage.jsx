import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Share2, AlertOctagon } from 'lucide-react';
import { toast } from 'react-hot-toast';

import PageTransition from '../components/PageTransition';
import LoadingOrb from '../components/three/LoadingOrb';
import { useAnalysis } from '../context/AnalysisContext';

const VerdictBanner = lazy(() => import('../components/results/VerdictBanner'));
const SummaryCard = lazy(() => import('../components/results/SummaryCard'));
const SignalsRow = lazy(() => import('../components/results/SignalsRow'));
const TacticsCard = lazy(() => import('../components/results/TacticsCard'));
const ReasoningCard = lazy(() => import('../components/results/ReasoningCard'));
const CorroborationCard = lazy(() => import('../components/results/CorroborationCard'));
const SourcesCard = lazy(() => import('../components/results/SourcesCard'));

export default function AnalyzePage() {
  const [view, setView] = useState("input");
  
  const { currentResult, isLoading, loadingStage, error, analyzeContent, clearResult } = useAnalysis();

  useEffect(() => {
    if (!isLoading && currentResult && !error) setView("results");
    else if (!isLoading && error) setView("input");
  }, [isLoading, currentResult, error]);

  useEffect(() => {
    if (view === "input") document.title = "Analyze — TruthLens";
    else if (view === "loading") document.title = "Analyzing... — TruthLens";
    else if (view === "results") document.title = `${currentResult?.verdict || "Result"} — TruthLens`;
  }, [view, currentResult]);

  return (
    <PageTransition>
      <AnimatePresence mode="wait">
        {view === "input" && <InputView key="input" analyze={analyzeContent} contextError={error} clearResult={clearResult} />}
        {view === "loading" && <LoadingView key="loading" stage={loadingStage} clearResult={clearResult} setView={setView} />}
        {view === "results" && <ResultsView key="results" result={currentResult} clearResult={clearResult} setView={setView} />}
      </AnimatePresence>
    </PageTransition>
  );
}

function InputView({ analyze, contextError, clearResult }) {
  const [urlValue, setUrlValue] = useState("");
  const [urlError, setUrlError] = useState("");
  const [textValue, setTextValue] = useState("");
  const [submitError, setSubmitError] = useState("");

  const handleUrlChange = (e) => {
    setUrlValue(e.target.value);
    setUrlError("");
  };

  const handleUrlBlur = () => {
    if (urlValue.trim() && !urlValue.trim().startsWith("http://") && !urlValue.trim().startsWith("https://")) {
      setUrlError("URL must start with http:// or https://");
    }
  };

  const handleTextChange = (e) => {
    const val = e.target.value;
    if (val.length <= 50000) {
      setTextValue(val);
    } else {
      setTextValue(val.slice(0, 50000));
      toast("Truncated to 50,000 characters", { icon: '✂️' });
    }
  };

  const handleSubmit = async () => {
    setSubmitError("");
    let inputToSend = "";

    if (urlValue.trim()) {
      if (!urlValue.trim().startsWith("http://") && !urlValue.trim().startsWith("https://")) {
        setUrlError("URL must start with http:// or https://");
        return;
      }
      inputToSend = urlValue.trim();
    } else if (textValue.trim()) {
      if (textValue.trim().length < 30) {
        setSubmitError("Please enter at least 30 characters for a reliable analysis.");
        return;
      }
      inputToSend = textValue.trim();
    } else {
      setSubmitError("Please enter a URL or paste some text");
      return;
    }

    await analyze(inputToSend);
  };

  const setExample = (text) => {
    setTextValue(text);
    setUrlValue("");
    setUrlError("");
    setSubmitError("");
  };

  const charCount = textValue.length;
  const isShortClaim = textValue.trim().length > 0 && textValue.trim().length < 150 && !textValue.trim().startsWith("http");

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen pt-24 pb-20 flex flex-col items-center"
    >
      <div className="max-w-[720px] w-full mx-auto px-6">
        
        {/* HEADER */}
        <div className="text-center mb-10 text-left md:text-center">
          <motion.p 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-mono text-xs text-accent-purple tracking-widest uppercase"
          >
            Analyze Content
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="font-syne font-extrabold text-4xl md:text-5xl text-text-primary mt-2"
          >
            What Do You Want to Verify?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="font-dm text-text-secondary mt-3"
          >
            Enter a URL, paste an article, or type a short claim.
          </motion.p>
        </div>

        {/* URL INPUT */}
        <div className="mb-2">
          <label className="font-dm text-sm text-text-secondary mb-2 block">Article URL</label>
          <input
            type="text"
            aria-label="Article URL input"
            className="w-full bg-transparent border border-[rgba(255,255,255,0.12)] rounded-pill px-5 py-3.5 font-mono text-sm text-text-primary placeholder-text-muted outline-none focus:border-accent-purple focus:shadow-clayPurple transition-all"
            placeholder="https://example.com/news-article"
            value={urlValue}
            onChange={handleUrlChange}
            onBlur={handleUrlBlur}
          />
          {urlError && <p className="text-accent-red font-mono text-xs mt-1.5">{urlError}</p>}
          <p className="font-dm text-xs text-text-muted mt-2">
            Leave blank if pasting text directly. URL takes priority if both are filled.
          </p>
        </div>

        {/* DIVIDER */}
        <div className="flex items-center my-5">
          <div className="flex-grow h-[1px] bg-white/10" />
          <span className="font-mono text-xs text-text-muted mx-4">OR</span>
          <div className="flex-grow h-[1px] bg-white/10" />
        </div>

        {/* TEXTAREA */}
        <div className="mb-4">
          <textarea
            aria-label="Article text input"
            className="w-full min-h-[220px] max-h-[480px] resize-y bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.10)] rounded-clay p-5 font-dm text-sm text-text-primary placeholder-text-muted leading-relaxed outline-none focus:border-accent-purple focus:bg-[rgba(168,85,247,0.04)] transition-all scrollbar-thin"
            placeholder="Or paste any news article, social media post, WhatsApp forward, or short claim here..."
            value={textValue}
            onChange={handleTextChange}
          />
          
          <div className="flex justify-between items-center mt-2 h-6">
            <div className="flex-1">
              <AnimatePresence>
                {isShortClaim && (
                  <motion.div 
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -10, opacity: 0 }}
                    className="clay-pill bg-accent-amber/10 border border-accent-amber/20 shadow-none text-accent-amber font-mono text-xs inline-flex px-2 py-0.5"
                  >
                    ✦ Short Claim Mode
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className={`font-mono text-xs ${charCount >= 50000 ? 'text-accent-red' : charCount >= 40000 ? 'text-accent-amber' : 'text-text-muted'}`}>
              {charCount.toLocaleString()} / 50,000
            </div>
          </div>
        </div>

        {/* EXAMPLES */}
        <div className="mb-6">
          <label className="font-dm text-xs text-text-muted mb-2 block">Try an example:</label>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setExample("A comprehensive peer-reviewed study published in the journal 'The Lancet' involving 8,200 participants across 22 countries has confirmed that regular moderate exercise reduces the risk of cardiovascular disease by 35 percent. The 10-year longitudinal research, led by Dr. Priya Sharma at Stanford Medical School, was funded by the National Institutes of Health and has been independently replicated by researchers in Germany and South Korea.")}
              className="clay-pill bg-white/5 border border-white/10 text-text-secondary font-mono text-xs opacity-70 hover:opacity-100 hover:scale-102 transition-all cursor-pointer shadow-none"
            >
              ✅ Real Article
            </button>
            <button 
              onClick={() => setExample("SHOCKING TRUTH THEY'RE HIDING FROM YOU!!! 5G towers are secretly beaming mind control signals that cause cancer and make people comply with government orders!! Bill Gates personally funded this technology to track every person on earth!! Doctors and scientists who expose this TRUTH are being silenced!! SHARE THIS BEFORE IT GETS DELETED!!! The mainstream media REFUSES to cover this because they are paid to keep you ignorant!!!")}
              className="clay-pill bg-white/5 border border-white/10 text-text-secondary font-mono text-xs opacity-70 hover:opacity-100 hover:scale-102 transition-all cursor-pointer shadow-none"
            >
              ❌ Fake Claim
            </button>
            <button 
              onClick={() => setExample("Scientists Confirm Coffee Causes Cancer — Study Shows 300% Risk Increase For Daily Drinkers")}
              className="clay-pill bg-white/5 border border-white/10 text-text-secondary font-mono text-xs opacity-70 hover:opacity-100 hover:scale-102 transition-all cursor-pointer shadow-none"
            >
              ⚠ Misleading Headline
            </button>
          </div>
        </div>

        {submitError && (
          <div aria-live="polite" aria-atomic="true">
            <p className="text-accent-red font-dm text-sm text-center mb-4">{submitError}</p>
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <motion.button
          onClick={handleSubmit}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full clay-btn-primary font-syne font-bold text-base py-4 mt-4"
        >
          Analyze Now →
        </motion.button>

        {/* ERROR DISPLAY */}
        {contextError && (
          <div aria-live="polite" aria-atomic="true" className="clay-card mt-6 p-4 flex items-start gap-3 bg-[rgba(248,113,113,0.05)] border-[rgba(248,113,113,0.15)] relative">
            <AlertOctagon className="text-accent-red shrink-0 mt-0.5" size={20} />
            <p className="font-dm text-sm text-accent-red leading-relaxed pr-6">{contextError}</p>
            <button 
              onClick={clearResult}
              className="absolute top-4 right-4 text-accent-red/50 hover:text-accent-red transition-colors"
            >
              ✕
            </button>
          </div>
        )}

      </div>
    </motion.div>
  );
}

function LoadingView({ stage, clearResult, setView }) {
  
  const getStageMessage = (st) => {
    switch(st) {
      case "idle": return "Preparing analysis...";
      case "fetching_url": return "Fetching article from URL...";
      case "analyzing": return "AI is reading the content...";
      case "corroborating": return "Searching the web for evidence...";
      case "finalizing": return "Generating your verdict...";
      default: return "Analyzing...";
    }
  };

  const getStageIndex = (st) => {
    switch(st) {
      case "idle": return 0;
      case "fetching_url": return 1;
      case "analyzing": return 2;
      case "corroborating": return 3;
      case "finalizing": return 4;
      default: return 0;
    }
  };

  const stageIdx = getStageIndex(stage);
  const labels = ["Input", "Extract", "Analyze", "Search", "Verdict"];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
    >
      <div className="max-w-sm w-full mx-auto flex flex-col items-center">
        
        <LoadingOrb />

        <div className="mt-6 h-8 relative flex justify-center w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              role="status"
              aria-live="polite"
              className="absolute font-syne font-bold text-xl text-text-primary"
            >
              {getStageMessage(stage)}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="w-full mt-10">
          <div className="flex items-center justify-between relative px-2">
            {labels.map((lbl, i) => {
              const active = i === stageIdx;
              const completed = i < stageIdx;
              const pending = i > stageIdx;
              
              return (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center relative z-10 w-8">
                    {completed && <div className="w-3 h-3 rounded-full bg-accent-green" />}
                    {active && <div className="w-4 h-4 rounded-full bg-accent-purple animate-pulse-glow" />}
                    {pending && <div className="w-3 h-3 rounded-full bg-[rgba(255,255,255,0.15)]" />}
                    <span className="absolute top-6 font-mono text-[10px] text-text-muted">{lbl}</span>
                  </div>
                  
                  {i < labels.length - 1 && (
                    <div className="flex-1 h-0.5 mx-2 relative z-0">
                      <div className={`w-full h-full ${i < stageIdx ? 'bg-accent-green' : 'bg-[rgba(255,255,255,0.1)]'}`} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <p className="mt-14 font-dm text-sm text-text-muted">
          Usually takes 8–15 seconds. Complex articles may take longer.
        </p>

        <button 
          onClick={() => { clearResult(); setView("input"); }}
          className="mt-8 font-dm text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          ✕ Cancel
        </button>

      </div>
    </motion.div>
  );
}

function ResultsView({ result, clearResult, setView }) {
  
  const handleCopy = () => {
    const r = result;
    const text = `TruthLens Analysis\n${'='.repeat(40)}\nVerdict: ${r?.verdict}\nScore: ${r?.credibility_score}/100\nConfidence: ${r?.confidence}\n\nSummary:\n${r?.summary}\n\nRed Flags: ${r?.red_flags?.join(', ')}\n\nReasoning:\n${r?.reasoning}\n\nAdvice:\n${r?.advice}\n\nAnalyzed: ${r?.timestamp}`;
    navigator.clipboard.writeText(text);
    toast("Copied result to clipboard!", { icon: '📋' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 pb-20 px-4 md:px-6"
    >
      <div className="max-w-[960px] mx-auto flex flex-col">
        
        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-8">
          <motion.button 
            whileHover={{ x: -3 }}
            onClick={() => { clearResult(); setView("input"); window.scrollTo(0,0); }}
            className="font-dm text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            ← New Analysis
          </motion.button>
          
          <div className="flex gap-3">
            <button 
              onClick={handleCopy}
              className="clay-btn-outline font-dm text-sm px-4 py-2 flex items-center gap-2"
            >
              <Copy size={14} /> Copy Result
            </button>
            <button 
              onClick={handleCopy}
              className="clay-btn-outline font-dm text-sm px-4 py-2 flex items-center gap-2"
            >
              <Share2 size={14} /> Share
            </button>
          </div>
        </div>

        {/* RESULTS CARDS */}
        <Suspense fallback={<div className="flex justify-center py-20"><div className="clay-pill bg-white/5 font-mono text-xs text-text-muted shadow-none border-transparent">Loading results...</div></div>}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="flex flex-col"
          >
            <VerdictBanner result={result} />
            
            <SummaryCard 
              summary={result?.summary} 
              domain_info={result?.domain_info} 
              article_metadata={result?.article_metadata} 
            />
            
            <SignalsRow 
              red_flags={result?.red_flags} 
              credible_signals={result?.credible_signals} 
            />
            
            <TacticsCard 
              manipulation_tactics={result?.manipulation_tactics} 
            />
            
            <ReasoningCard 
              reasoning={result?.reasoning} 
              advice={result?.advice} 
            />
            
            <CorroborationCard 
              corroboration_results={result?.corroboration_results} 
            />
            
            <SourcesCard 
              cited_sources={result?.cited_sources} 
            />
          </motion.div>
        </Suspense>

      </div>
    </motion.div>
  );
}
