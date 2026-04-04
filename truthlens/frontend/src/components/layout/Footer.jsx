import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full">
      <div 
        className="w-full border-t py-10 px-6 md:px-10"
        style={{
          borderTopColor: 'rgba(255,255,255,0.07)',
          backgroundColor: 'var(--bg-deep)'
        }}
      >
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Column 1 */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2.5 mb-2">
              <svg
                className="w-[18px] h-[18px] rounded-full"
                viewBox="0 0 24 24"
                fill="none"
                stroke="url(#footerGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <defs>
                  <linearGradient id="footerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--accent-purple)" />
                    <stop offset="100%" stopColor="var(--accent-violet)" />
                  </linearGradient>
                </defs>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span className="font-syne font-bold text-lg text-text-primary">
                Truth<span className="gradient-text">Lens</span>
              </span>
            </div>
            <p className="font-dm text-sm text-text-muted mb-2">See Through the Noise</p>
            <p className="font-mono text-xs text-text-muted/60">Built with ♥ by O(1) Gang</p>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col md:items-center">
            <div className="flex flex-col items-start">
              <h3 className="font-dm text-xs font-medium text-text-muted uppercase tracking-widest mb-3">Navigate</h3>
              <div className="flex flex-col gap-2">
                <NavLink to="/" className="font-dm text-sm text-text-secondary hover:text-accent-purple transition-colors">Home</NavLink>
                <NavLink to="/analyze" className="font-dm text-sm text-text-secondary hover:text-accent-purple transition-colors">Analyze</NavLink>
                <NavLink to="/history" className="font-dm text-sm text-text-secondary hover:text-accent-purple transition-colors">History</NavLink>
                <NavLink to="/about" className="font-dm text-sm text-text-secondary hover:text-accent-purple transition-colors">About</NavLink>
              </div>
            </div>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col md:items-end">
            <div className="flex flex-col items-start md:items-end">
              <h3 className="font-dm text-xs font-medium text-text-muted uppercase tracking-widest mb-3">Tech Stack</h3>
              <div className="flex flex-col gap-1 md:items-end">
                <span className="font-mono text-xs text-text-muted">React 18</span>
                <span className="font-mono text-xs text-text-muted">Three.js</span>
                <span className="font-mono text-xs text-text-muted">FastAPI</span>
                <span className="font-mono text-xs text-text-muted">Gemini 1.5 Pro</span>
              </div>
            </div>
          </div>

        </div>

        {/* Divider & Copyright */}
        <div 
          className="max-w-[1200px] mx-auto mt-8 pt-6 border-t font-mono text-xs text-text-muted/50 text-center"
          style={{ borderTopColor: 'rgba(255,255,255,0.05)' }}
        >
          TruthLens © 2026 — Hackathon Project
        </div>

      </div>
    </footer>
  );
}
