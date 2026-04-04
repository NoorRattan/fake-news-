import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Brain,
  ChevronDown,
  FileText,
} from 'lucide-react';

import HeroGlobe from '../components/three/HeroGlobe';
import FloatingParticles from '../components/three/FloatingParticles';
import PageTransition from '../components/PageTransition';

export default function AboutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'About - TruthLens';
  }, []);

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const pipelineCards = useMemo(
    () => [
      {
        icon: <FileText className="text-text" size={20} />,
        title: 'Smart Input Detection',
        body: 'Accepts full articles, URLs (auto-fetched), or short claims. Automatically classifies your input and routes it through the right pipeline path.',
        tagLabel: 'TEXT - URL - HEADLINE',
      },
      {
        icon: <Brain className="text-text" size={20} />,
        title: 'AI Analysis',
        body: 'Gemini performs the primary linguistic analysis, detecting logical inconsistencies, emotional manipulation, and factual implausibility, with Groq as the fast fallback provider.',
        tagLabel: 'GEMINI - GROQ',
      },
      {
        icon: <BarChart3 className="text-text" size={20} />,
        title: 'Credibility Score',
        body: 'Every analysis produces a 0-100 credibility score. It aggregates AI confidence, domain reputation, source quality, and corroboration results.',
        tagLabel: '0-100 SCORE',
      },
      {
        icon: <AlertTriangle className="text-text" size={20} />,
        title: 'Red Flag Detection',
        body: 'Identifies warning signals like sensational language, missing sources, anonymous citations, and logical contradictions.',
        tagLabel: 'NEWS DOMAINS',
      },
    ],
    []
  );

  const verdicts = [
    {
      name: 'Likely Real',
      color: 'text-[var(--green)]',
      border: 'border-[var(--green)]',
      desc: 'Content is factual with credible sources.',
    },
    {
      name: 'Likely Fake',
      color: 'text-[var(--red)]',
      border: 'border-[var(--red)]',
      desc: 'Demonstrably false, fabricated, or deceptive.',
    },
    {
      name: 'Misleading',
      color: 'text-[var(--amber)]',
      border: 'border-[var(--amber)]',
      desc: 'Contains factual elements but strips context.',
    },
    {
      name: 'Mixed',
      color: 'text-[var(--yellow)]',
      border: 'border-[var(--yellow)]',
      desc: 'Combines true claims with falsehoods.',
    },
    {
      name: 'Unverifiable',
      color: 'text-[var(--gray)]',
      border: 'border-[var(--gray)]',
      desc: 'Lacks enough evidence to make a conclusion.',
    },
  ];

  return (
    <PageTransition>
      <FloatingParticles />

      <section className="relative min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="flex flex-col justify-center gap-6 py-20 lg:py-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="editorial-tag self-start flex items-center gap-2 bg-bg text-muted uppercase tracking-widest"
            >
              <div className="w-2 h-2 bg-text animate-pulse" />
              <span>AI-Powered / Real-Time / Explainable</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col gap-2 font-bebas text-6xl md:text-8xl tracking-wide uppercase text-text leading-none"
            >
              <span>See Through</span>
              <span>The Noise.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-mono text-base md:text-lg text-text leading-relaxed max-w-lg"
            >
              Paste any news article, URL, or headline. Our multi-layer AI pipeline,
              powered by Gemini, Groq fallback, and real-time web search, delivers an
              instant, explainable verdict on any piece of content.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4 mt-2"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/')}
                className="editorial-btn-primary flex items-center gap-2"
              >
                Start Analyzing <ArrowRight size={16} />
              </motion.button>

              <button
                onClick={scrollToHowItWorks}
                className="editorial-btn transition-colors hover:bg-surface"
              >
                How It Works
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="flex flex-wrap gap-6 mt-4 uppercase border-t border-border pt-4"
            >
              <div className="flex items-center gap-2 font-mono text-xs text-muted">
                <span>[SECURE]</span> PIPELINE
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-muted">
                <span>[FAST]</span> VERDICT
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-muted">
                <span>[LIVE]</span> VERIFICATION
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="hidden lg:flex items-center justify-center relative"
          >
            <div className="relative w-full h-[420px] lg:h-[520px] hidden md:block">
              <HeroGlobe />
            </div>
          </motion.div>
        </div>

        <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 opacity-60">
          <span className="font-mono text-xs text-muted uppercase">Scroll to explore</span>
          <ChevronDown size={20} className="text-muted" />
        </div>
      </section>

      <section
        id="how-it-works"
        className="py-24 px-6 md:px-10 max-w-7xl mx-auto border-t border-border"
      >
        <div className="text-center mb-16">
          <p className="font-mono text-xs text-muted tracking-widest mb-3 uppercase">
            /// THE PIPELINE
          </p>
          <h2 className="font-bebas text-5xl md:text-6xl text-text uppercase tracking-wide">
            What Happens When You Analyze
          </h2>
          <p className="font-mono text-text mt-4 max-w-xl mx-auto">
            A precise multi-layered sequence runs to produce a comprehensive,
            explainable verdict.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pipelineCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1 }}
              className="editorial-card flex flex-col gap-4"
            >
              <div className="w-10 h-10 border border-border flex items-center justify-center">
                {card.icon}
              </div>
              <h3 className="font-bebas text-2xl text-text tracking-wide uppercase">
                {card.title}
              </h3>
              <p className="font-mono text-sm text-muted leading-relaxed flex-grow">
                {card.body}
              </p>
              <div className="editorial-tag self-start mt-2">{card.tagLabel}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 md:px-10 max-w-5xl mx-auto border-t border-border">
        <div className="text-center mb-16">
          <p className="font-mono text-xs text-muted tracking-widest mb-3 uppercase">
            /// CLASSIFICATION
          </p>
          <h2 className="font-bebas text-5xl text-text uppercase tracking-wide">
            Five Possible Verdicts
          </h2>
          <p className="font-mono text-text mt-4 max-w-xl mx-auto">
            The AI returns one of these classifications based on its multi-layer
            analysis.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          {verdicts.map((verdict, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{ borderTopColor: verdict.border.replace('border-', '') }}
              className="editorial-card border-t-2 w-full sm:w-[calc(50%-8px)] lg:w-[calc(20%-13px)] flex flex-col gap-3 min-h-[140px]"
            >
              <h4 className={`font-bebas text-2xl uppercase tracking-wide ${verdict.color}`}>
                {verdict.name}
              </h4>
              <p className="font-mono text-xs text-muted leading-relaxed">
                {verdict.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 md:px-10 max-w-4xl mx-auto text-center border-t border-border mb-20">
        <h2 className="font-bebas text-5xl md:text-6xl text-text tracking-wide uppercase mb-6">
          Ready to Detect Misinformation?
        </h2>
        <p className="font-mono text-text mb-10 max-w-2xl mx-auto">
          Paste an article, enter a URL, or type a headline. Get your verdict in
          seconds.
        </p>

        <motion.button
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="editorial-btn-primary text-xl px-12 py-5 mx-auto"
        >
          START ANALYSIS
        </motion.button>
      </section>
    </PageTransition>
  );
}
