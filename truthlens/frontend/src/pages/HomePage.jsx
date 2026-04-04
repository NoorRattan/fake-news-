import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Brain, Shield, Globe, Zap, Database, BarChart3, 
  ArrowRight, ArrowDown, CheckCircle, Sparkles, 
  AlertTriangle, ChevronDown, FileText, XCircle, 
  Shuffle, HelpCircle
} from 'lucide-react';
import clsx from 'clsx';

import HeroGlobe from '../components/three/HeroGlobe';
import FloatingParticles from '../components/three/FloatingParticles';
import PageTransition from '../components/PageTransition';

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "TruthLens — See Through the Noise";
  }, []);

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <PageTransition>
      <FloatingParticles />
      
      {/* SECTION 1: HERO */}
      <section className="relative min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* LEFT COLUMN */}
          <div className="flex flex-col justify-center gap-6 py-20 lg:py-0">
            {/* Top Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="clay-pill self-start flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-accent-purple animate-pulse" />
              <span className="font-mono text-xs text-text-secondary">AI-Powered · Real-Time · Explainable</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col gap-2"
            >
              <span className="font-syne font-extrabold text-5xl md:text-6xl lg:text-7xl text-text-primary">
                See Through
              </span>
              <span className="font-syne font-extrabold text-5xl md:text-6xl lg:text-7xl gradient-text">
                The Noise.
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-dm text-base md:text-lg text-text-secondary leading-relaxed max-w-lg"
            >
              Paste any news article, URL, or headline. Our multi-layer AI pipeline — powered by Google Gemini and real-time web search — delivers an instant, explainable verdict on any piece of content.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4 mt-2"
            >
              <motion.button 
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/analyze')}
                className="clay-btn-primary font-dm font-medium text-sm px-7 py-3.5 flex items-center gap-2"
              >
                Start Analyzing <ArrowRight size={16} />
              </motion.button>
              
              <button 
                onClick={scrollToHowItWorks}
                className="clay-btn-outline font-dm font-medium text-sm px-7 py-3.5 text-text-secondary transition-colors hover:text-text-primary"
              >
                How It Works
              </button>
            </motion.div>

            {/* Trust Signals */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="flex flex-wrap gap-4 md:gap-6 mt-4"
            >
              <div className="flex items-center gap-1.5 font-mono text-xs text-text-muted">
                <span>🔒</span> No data stored
              </div>
              <div className="flex items-center gap-1.5 font-mono text-xs text-text-muted">
                <span>⚡</span> Verdict in ~10s
              </div>
              <div className="flex items-center gap-1.5 font-mono text-xs text-text-muted">
                <span>🌐</span> Real-time web check
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="hidden md:flex lg:flex items-center justify-center relative"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.12)_0%,transparent_70%)] pointer-events-none" />
            <div className="relative w-full h-[420px] lg:h-[520px] hidden md:block">
              <HeroGlobe />
            </div>
          </motion.div>
          
        </div>

        {/* Scroll Indicator */}
        <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 opacity-60">
          <span className="font-mono text-xs text-text-muted">Scroll to explore</span>
          <ChevronDown size={20} className="text-text-muted animate-bounce" />
        </div>
      </section>

      {/* SECTION 2: STATS BAR */}
      <section id="stats" className="w-full bg-bg-surface border-y border-[rgba(255,255,255,0.07)] py-10 px-6 md:px-10">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative">
          
          {[
            { num: "7", label: "Pipeline Stages" },
            { num: "< 10s", label: "Avg. Verdict Time" },
            { num: "500+", label: "Domains Rated" },
            { num: "3 Types", label: "Text, URL & Headline" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center relative"
            >
              <div className="font-syne font-extrabold text-3xl md:text-4xl gradient-text">
                {stat.num}
              </div>
              <div className="font-dm text-sm text-text-muted mt-1">
                {stat.label}
              </div>
              
              {/* Divider (except last) */}
              {i < 3 && (
                <div className="hidden md:block absolute right-[-2rem] top-1/2 -translate-y-1/2 w-[1px] h-10 bg-white/5" />
              )}
            </motion.div>
          ))}

        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-mono text-xs text-accent-purple tracking-widest mb-3">THE PIPELINE</p>
          <h2 className="font-syne font-extrabold text-4xl md:text-5xl text-text-primary">
            What Happens When You Analyze
          </h2>
          <p className="font-dm text-text-secondary mt-4 max-w-xl mx-auto">
            Seven intelligent steps run in sequence to produce a comprehensive verdict.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {useMemo(() => [
            {
              icon: <FileText className="text-accent-blue" size={20} />,
              iconBg: "bg-[rgba(56,189,248,0.12)] border-[rgba(56,189,248,0.2)]",
              title: "Smart Input Detection",
              body: "Accepts full articles, URLs (auto-fetched), or short claims. Automatically classifies your input and routes it through the right pipeline path.",
              tagLabel: "Text · URL · Headline",
              tagClass: "text-accent-blue bg-accent-blue/10 border border-accent-blue/20"
            },
            {
              icon: <Brain className="text-accent-purple" size={20} />,
              iconBg: "bg-accent-purple/10 border-accent-purple/20",
              title: "AI Analysis",
              body: "Google Gemini 1.5 Pro performs deep linguistic analysis — detecting logical inconsistencies, emotional manipulation, and factual implausibility. Groq Llama 3 provides instant fallback if needed.",
              tagLabel: "Gemini 1.5 Pro · Groq Fallback",
              tagClass: "text-accent-purple bg-accent-purple/10 border border-accent-purple/20"
            },
            {
              icon: <BarChart3 className="text-accent-violet" size={20} />,
              iconBg: "bg-accent-violet/10 border-accent-violet/20",
              title: "Credibility Score",
              body: "Every analysis produces a 0–100 credibility score. Aggregates AI confidence, domain reputation, source quality, and corroboration results into a single, instantly readable number.",
              tagLabel: "0–100 Score · Confidence Level",
              tagClass: "text-accent-violet bg-accent-violet/10 border border-accent-violet/20"
            },
            {
              icon: <AlertTriangle className="text-accent-red" size={20} />,
              iconBg: "bg-accent-red/10 border-accent-red/20",
              title: "Red Flag Detection",
              body: "Identifies 10+ categories of warning signals: sensational language, missing sources, anonymous citations, unverifiable statistics, misleading headlines, and logical contradictions.",
              tagLabel: "10+ Flag Types",
              tagClass: "text-accent-red bg-accent-red/10 border border-accent-red/20"
            },
            {
              icon: <Globe className="text-accent-green" size={20} />,
              iconBg: "bg-accent-green/10 border-accent-green/20",
              title: "Live Web Corroboration",
              body: "Key claims are extracted and searched in real-time via the Serper Google Search API. Supporting and contradicting sources surface instantly alongside the verdict.",
              tagLabel: "Serper API · Live Search",
              tagClass: "text-accent-green bg-accent-green/10 border border-accent-green/20"
            },
            {
              icon: <Database className="text-accent-amber" size={20} />,
              iconBg: "bg-accent-amber/10 border-accent-amber/20",
              title: "Source Credibility DB",
              body: "500+ news domains rated for credibility, reliability, and political bias. Known misinformation domains trigger an immediate flag regardless of content quality.",
              tagLabel: "500+ Domains · Bias Ratings",
              tagClass: "text-accent-amber bg-accent-amber/10 border border-accent-amber/20"
            }
          ], []).map((card, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="clay-card p-7 flex flex-col gap-4"
            >
              <div className={clsx("w-10 h-10 rounded-claySm flex items-center justify-center border", card.iconBg)}>
                {card.icon}
              </div>
              <h3 className="font-syne font-bold text-lg text-text-primary">
                {card.title}
              </h3>
              <p className="font-dm text-sm text-text-secondary leading-relaxed flex-grow">
                {card.body}
              </p>
              <div className={clsx("clay-pill font-mono text-xs self-start mt-2 border-transparent shadow-none", card.tagClass)}>
                {card.tagLabel}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 4: DEMO TEASER */}
      <section className="py-20 bg-bg-surface border-y border-[rgba(255,255,255,0.07)]">
        <div className="max-w-5xl mx-auto px-6">
          
          <div className="text-center mb-16">
            <h2 className="font-syne font-extrabold text-3xl md:text-4xl text-text-primary">
              From Paste to Verdict in Seconds
            </h2>
            <p className="font-dm text-text-secondary mt-2">
              No account needed. No subscription. Paste your content and see.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center relative">
            
            {/* Left: Input */}
            <div className="flex flex-col gap-2 relative z-10">
              <span className="font-mono text-xs text-text-muted">PASTE ANY ARTICLE &darr;</span>
              <div className="bg-bg-deep border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="bg-white/5 px-4 py-2 flex gap-2 items-center border-b border-white/5">
                  <div className="w-2.5 h-2.5 rounded-full bg-accent-red/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-accent-amber/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-accent-green/60" />
                  <span className="font-mono text-[10px] text-text-muted/70 ml-2">article.txt</span>
                </div>
                <div className="p-5 font-mono text-sm text-text-secondary leading-relaxed min-h-[160px]">
                  Breaking: New peer-reviewed study published in Nature Medicine confirms 
                  that the proposed treatment shows 67% efficacy in clinical trials involving 
                  2,400 participants across 12 countries. Lead researcher Dr. Amara Singh 
                  of Johns Hopkins said...
                  <span className="inline-block w-1.5 h-4 bg-text-secondary ml-1 align-middle animate-[blink_1s_step-end_infinite]">
                    <style>{`@keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0; } }`}</style>
                  </span>
                </div>
              </div>
            </div>

            {/* Middle Divider */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center z-20">
              <motion.div 
                animate={{ x: [0, 8, 0] }} 
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="bg-bg-surface rounded-full p-2"
              >
                <ArrowRight size={32} className="text-accent-purple" />
              </motion.div>
            </div>
            
            <div className="flex justify-center my-2 lg:hidden w-full">
              <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <ArrowDown size={24} className="text-accent-purple" />
              </motion.div>
            </div>

            {/* Right: Result */}
            <div className="flex flex-col gap-2 relative z-10">
              <span className="font-mono text-xs text-text-muted">&darr; TRUTHLENS VERDICT</span>
              <div 
                className="clay-card rounded-2xl p-6"
                style={{
                  background: 'rgba(74,222,128,0.06)',
                  border: '1px solid rgba(74,222,128,0.25)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                  <span className="font-mono text-[10px] text-accent-green tracking-widest uppercase">Verdict</span>
                </div>
                <h3 className="font-syne font-extrabold text-4xl text-accent-green mb-6">
                  Likely Real
                </h3>
                
                <div className="mb-6">
                  <div className="flex justify-between font-mono text-xs text-text-secondary mb-2">
                    <span>Credibility Score:</span>
                    <span className="text-accent-green font-bold">82/100</span>
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-accent-green h-1.5 rounded-full" style={{ width: '82%' }} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="clay-pill bg-accent-green/10 border-transparent text-accent-green text-[11px] px-3 py-1 font-mono hover:scale-105 transition-transform cursor-default">Named sources cited</div>
                  <div className="clay-pill bg-accent-green/10 border-transparent text-accent-green text-[11px] px-3 py-1 font-mono hover:scale-105 transition-transform cursor-default">Peer-reviewed study</div>
                  <div className="clay-pill bg-accent-green/10 border-transparent text-accent-green text-[11px] px-3 py-1 font-mono hover:scale-105 transition-transform cursor-default">Neutral tone</div>
                </div>

                <div className="mt-4 pt-4 border-t border-accent-green/20">
                  <span className="font-mono text-[10px] text-text-muted block text-center">
                    This is a visual example — results vary by content
                  </span>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-16 flex justify-center">
            <button 
              onClick={() => navigate('/analyze')}
              className="clay-btn-primary font-dm font-medium text-sm px-8 py-4 flex items-center gap-2 hover:scale-105 transition-transform"
            >
              Try It Now <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </section>

      {/* SECTION 5: VERDICT TYPES */}
      <section className="py-20 px-6 md:px-10 max-w-5xl mx-auto text-center">
        <h2 className="font-syne font-bold text-3xl text-text-primary">Five Possible Verdicts</h2>
        <p className="font-dm text-sm text-text-secondary mt-2 mb-10">
          The AI returns one of these classifications based on its multi-layer analysis.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          {[
            {
              name: "Likely Real",
              color: "text-accent-green",
              border: "border-l-accent-green",
              bg: "bg-[rgba(74,222,128,0.06)]",
              Icon: CheckCircle,
              desc: "Content is factual with credible sources."
            },
            {
              name: "Likely Fake",
              color: "text-accent-red",
              border: "border-l-accent-red",
              bg: "bg-[rgba(248,113,113,0.06)]",
              Icon: XCircle,
              desc: "Demonstrably false, fabricated, or deceptive."
            },
            {
              name: "Misleading",
              color: "text-accent-amber",
              border: "border-l-accent-amber",
              bg: "bg-[rgba(251,146,60,0.06)]",
              Icon: AlertTriangle,
              desc: "Contains factual elements but strips context."
            },
            {
              name: "Mixed",
              color: "text-accent-yellow",
              border: "border-l-accent-yellow",
              bg: "bg-[rgba(250,204,21,0.06)]",
              Icon: Shuffle,
              desc: "Combines true claims with falsehoods."
            },
            {
              name: "Unverifiable",
              color: "text-accent-teal",
              border: "border-l-accent-teal",
              bg: "bg-[rgba(45,212,191,0.06)]",
              Icon: HelpCircle,
              desc: "Lacks enough evidence to make a conclusion."
            }
          ].map((verdict, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`clay-card-sm border-l-4 p-5 text-left flex flex-col gap-3 w-full sm:w-[calc(50%-8px)] lg:w-[calc(20%-13px)] min-h-[140px] ${verdict.border} ${verdict.bg}`}
            >
              <div className="flex items-center gap-2">
                <verdict.Icon className={verdict.color} size={18} />
                <h4 className={`font-syne font-bold text-base ${verdict.color}`}>
                  {verdict.name}
                </h4>
              </div>
              <p className="font-dm text-xs text-text-muted leading-relaxed">
                {verdict.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 6: FINAL CTA BANNER */}
      <section className="relative py-24 px-6 text-center max-w-3xl mx-auto overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse,rgba(168,85,247,0.15),transparent_70%)] pointer-events-none -z-10" />
        
        <h2 className="font-syne font-extrabold text-4xl md:text-5xl gradient-text mb-4">
          Ready to Detect Misinformation?
        </h2>
        <p className="font-dm text-text-secondary mt-4 mb-8 text-lg">
          Paste an article, enter a URL, or type a headline. Get your verdict in seconds.
        </p>
        
        <motion.button
          onClick={() => navigate('/analyze')}
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(168,85,247,0.4)' }}
          whileTap={{ scale: 0.97 }}
          className="clay-btn-primary font-dm font-medium text-base px-10 py-4 mx-auto flex items-center gap-2"
        >
          Analyze Something Now <ArrowRight size={18} />
        </motion.button>
      </section>

    </PageTransition>
  );
}
