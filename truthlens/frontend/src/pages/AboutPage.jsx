import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Shield, Github, Layers, Cpu, Globe, Database, Code2, Zap, ArrowRight } from 'lucide-react';

import PageTransition from '../components/PageTransition';
import FloatingParticles from '../components/three/FloatingParticles';
import MiniGlobe from '../components/three/MiniGlobe';

export default function AboutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "About — TruthLens";
  }, []);

  const pipelineSteps = [
    {
      title: "Input Handler",
      file: "input_handler.py",
      color: "accent-blue",
      desc: "Classifies the user's input as a full article, URL, or short headline/claim. Validates length limits, strips whitespace, and routes to the correct pipeline branch.",
      tags: ["URL Detection", "Text Classification", "Sanitization"]
    },
    {
      title: "Content Extraction",
      file: "content_extractor.py",
      color: "accent-purple",
      desc: "Fetches and cleans article text from a URL using Trafilatura with BeautifulSoup4 as fallback. Extracts article title, domain, and publish date automatically.",
      tags: ["Trafilatura", "BeautifulSoup4", "Metadata Extraction"]
    },
    {
      title: "Pre-Analysis",
      file: "orchestrator.py",
      color: "accent-amber",
      desc: "Cross-references the source domain against a known fake-news domain list and a credibility database of 500+ outlets. Known misinformation sources are flagged before AI analysis even begins.",
      tags: ["Domain Blocklist", "Credibility DB", "Fast-Path Flagging"]
    },
    {
      title: "AI Analysis",
      file: "ai_analyzer.py",
      color: "accent-purple",
      desc: "Gemini 1.5 Pro performs deep analysis of linguistic patterns, logical consistency, factual plausibility, and emotional manipulation. Returns a structured JSON verdict including score, red flags, tactics, and reasoning. Groq Llama 3 is on standby as fallback.",
      tags: ["Gemini 1.5 Pro", "Groq Fallback", "JSON Mode", "Temp 0.2"],
      emphasize: true
    },
    {
      title: "Web Corroboration",
      file: "web_searcher.py",
      color: "accent-green",
      desc: "Key claims extracted by the AI are searched in real-time via Serper (Google Search API). Parallel async HTTP requests retrieve top results. DuckDuckGo serves as fallback. Target: under 2 seconds added latency.",
      tags: ["Serper API", "asyncio.gather()", "DuckDuckGo Fallback"]
    },
    {
      title: "Source Credibility",
      file: "source_checker.py",
      color: "accent-blue",
      desc: "All URLs cited within the article body are extracted via regex and their domains are checked against the credibility database. Each source receives a credibility rating and political bias label.",
      tags: ["500+ Domains", "Regex Extraction", "Bias Detection"]
    },
    {
      title: "Result Aggregation",
      file: "orchestrator.py",
      color: "accent-green",
      desc: "All pipeline outputs are merged and validated. If the source domain is on the fake-news blocklist, credibility score is hard-capped at 20. A UUID and timestamp are added. Result is cached in session memory.",
      tags: ["Score Override", "UUID", "Session Cache", "Schema Validation"]
    }
  ];

  const getColorClasses = (colorName) => {
    switch (colorName) {
      case 'accent-blue': return 'bg-accent-blue/10 border-accent-blue/30 text-accent-blue';
      case 'accent-purple': return 'bg-accent-purple/10 border-accent-purple/30 text-accent-purple';
      case 'accent-amber': return 'bg-accent-amber/10 border-accent-amber/30 text-accent-amber';
      case 'accent-green': return 'bg-accent-green/10 border-accent-green/30 text-accent-green';
      default: return 'bg-white/10 border-white/30 text-white';
    }
  };

  const techStack = [
    { icon: <Code2 className="text-accent-violet" />, name: "React 18 + Vite", role: "Frontend Framework" },
    { icon: <Layers className="text-accent-purple" />, name: "Three.js + R3F", role: "3D Rendering" },
    { icon: <Zap className="text-accent-amber" />, name: "Framer Motion", role: "Animations" },
    { icon: <span className="font-syne font-bold text-accent-blue">CSS</span>, name: "Tailwind CSS", role: "Styling" },
    { icon: <Cpu className="text-accent-green" />, name: "FastAPI", role: "Backend API" },
    { icon: <Cpu className="text-accent-purple" />, name: "Gemini 1.5 Pro", role: "Primary AI" },
    { icon: <Globe className="text-accent-blue" />, name: "Serper API", role: "Web Search" },
    { icon: <Shield className="text-accent-green" />, name: "Pydantic v2", role: "Data Validation" },
  ];

  return (
    <PageTransition>
      <FloatingParticles />
      <div className="min-h-screen pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* SECTION 1: HERO */}
          <div className="text-center mb-20">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-mono text-xs text-accent-purple tracking-widest uppercase mb-2"
            >
              About TruthLens
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-syne font-extrabold text-5xl gradient-text mt-2 block"
            >
              Fighting Misinformation with AI
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-dm text-lg text-text-secondary mt-4 max-w-2xl mx-auto leading-relaxed text-center"
            >
              TruthLens is a multi-layer AI fact-checking platform built in 24 hours 
              for a competitive hackathon. It combines large language models, real-time 
              web search, and source credibility analysis to give users an instant, 
              explainable verdict on any piece of content.
            </motion.p>
          </div>

          {/* SECTION 2: THE PROBLEM + SOLUTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-24">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="clay-card p-8 border-l-4 border-l-accent-red"
            >
              <AlertTriangle size={32} className="text-accent-red" />
              <h3 className="font-syne font-bold text-xl mt-4 text-text-primary">The Misinformation Crisis</h3>
              <p className="font-dm text-sm text-text-secondary leading-relaxed mt-3">
                Fake news, manipulated media, and misleading headlines spread faster than 
                truth. Existing fact-checking sites require manual searching and only cover 
                already-viral stories. The average person has no fast, free tool to verify 
                content in real time before sharing.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="clay-card p-8 border-l-4 border-l-accent-green"
            >
              <Shield size={32} className="text-accent-green" />
              <h3 className="font-syne font-bold text-xl mt-4 text-text-primary">A One-Stop Verification Tool</h3>
              <p className="font-dm text-sm text-text-secondary leading-relaxed mt-3">
                TruthLens lets you paste any content and receive an instant, 
                explainable verdict. Our seven-step pipeline combines AI linguistic 
                analysis, live web search corroboration, domain credibility lookup, 
                and manipulation tactic detection — all in under 15 seconds.
              </p>
            </motion.div>
          </div>

          {/* SECTION 3: TECHNICAL PIPELINE */}
          <div className="mb-24">
            <h2 className="font-syne font-bold text-3xl text-center text-text-primary mb-12">
              The 7-Step Pipeline
            </h2>
            <div className="flex flex-col">
              {pipelineSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.12 }}
                  className="flex items-start gap-5 mb-8 last:mb-0"
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center border font-syne font-extrabold text-sm ${getColorClasses(step.color)}`}>
                      {index + 1}
                    </div>
                    {index < pipelineSteps.length - 1 && (
                      <div className={`w-px h-full min-h-[60px] opacity-30 mt-2 bg-${step.color}`} />
                    )}
                  </div>
                  
                  <div className={`clay-card-sm p-5 flex-1 ${step.emphasize ? 'border border-accent-purple/30 bg-accent-purple/5' : ''}`}>
                    <h4 className="font-syne font-bold text-base text-text-primary">
                      {step.title}
                    </h4>
                    <div className="font-mono text-xs clay-pill text-text-muted mt-1 self-start inline-block shadow-none border-transparent bg-white/5 px-2 py-0.5">
                      {step.file}
                    </div>
                    <p className="font-dm text-sm text-text-secondary leading-relaxed mt-2">
                      {step.desc}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {step.tags.map((tag, tIndex) => (
                        <div key={tIndex} className={`font-mono text-[10px] clay-pill px-2 py-0.5 shadow-none border-transparent ${getColorClasses(step.color)}`}>
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* SECTION 4: TECH STACK GRID */}
          <div className="mb-24">
            <h2 className="font-syne font-bold text-3xl text-center text-text-primary mt-20 mb-10">
              Built With
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {techStack.map((tech, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -3 }}
                  className="clay-card-sm p-5 text-center flex flex-col items-center transition-all cursor-default"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full mb-2">
                    {tech.icon}
                  </div>
                  <div className="font-syne font-bold text-sm text-text-primary mt-2">
                    {tech.name}
                  </div>
                  <div className="font-dm text-xs text-text-muted mt-1">
                    {tech.role}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* SECTION 5: TEAM */}
          <div className="mb-24">
            <h2 className="font-syne font-bold text-3xl text-center text-text-primary mt-20 mb-4">
              Team O(1) Gang
            </h2>
            <p className="font-dm text-text-muted text-center mb-10">
              Built in 24 hours at a competitive hackathon.
            </p>
            <div className="clay-card max-w-sm mx-auto p-8 text-center flex flex-col items-center">
              <MiniGlobe size={120} opacity={0.6} />
              <div className="font-syne font-extrabold text-2xl gradient-text mt-4">
                O(1) Gang
              </div>
              <div className="font-dm text-sm text-text-muted mt-2">
                Full-Stack · AI Pipeline · Frontend · Backend · Deployment
              </div>
              <div className="font-dm text-xs text-text-muted/60 mt-4 italic">
                Building tools that make truth accessible.
              </div>
            </div>
          </div>

          {/* SECTION 6: FINAL CTA */}
          <div className="text-center py-16">
            <p className="font-syne font-bold text-2xl text-text-primary">
              See TruthLens in action.
            </p>
            <button
              onClick={() => navigate('/analyze')}
              className="clay-btn-primary mt-4 px-8 py-4 flex items-center gap-2 mx-auto hover:scale-105 transition-transform"
            >
              Try Analyzing Now <ArrowRight size={18} />
            </button>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
