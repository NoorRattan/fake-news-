import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Footer() {
  return (
    <footer 
      style={{
        borderTop: '1px solid var(--border)',
        padding: '60px 0',
        background: 'var(--bg)',
        color: 'var(--text)',
        fontFamily: '"DM Mono", monospace',
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}
    >
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 40px' }} className="px-[16px] md:px-[40px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Column 1: Brand */}
          <div>
            <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '24px', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>
              TRUTH<span style={{ color: 'var(--green)' }}>LENS</span>
            </span>
            <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>
              AI-POWERED VERDICT PIPELINE.<br />
              SEE THROUGH THE NOISE.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 style={{ color: 'var(--muted)', marginBottom: '16px' }}>NAVIGATE</h4>
            <div className="flex flex-col gap-3">
              <NavLink to="/" className="hover:text-[var(--green)] transition-colors" style={{ textDecoration: 'none', color: 'inherit' }}>[⚡] ANALYZE</NavLink>
              <NavLink to="/history" className="hover:text-[var(--text)] transition-colors" style={{ textDecoration: 'none', color: 'inherit' }}>[🕰] HISTORY</NavLink>
              <NavLink to="/about" className="hover:text-[var(--text)] transition-colors" style={{ textDecoration: 'none', color: 'inherit' }}>[ℹ] ABOUT</NavLink>
            </div>
          </div>

          {/* Column 3: Stats/Info */}
          <div>
            <h4 style={{ color: 'var(--muted)', marginBottom: '16px' }}>SYSTEM</h4>
            <div style={{ color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span>STATUS: ONLINE</span>
              <span>ENGINE: GROQ + COHERE</span>
              <span>PHASE: 2.0 (EDITORIAL)</span>
            </div>
          </div>

        </div>

        <div style={{ marginTop: '60px', borderTop: '1px solid #222222', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', color: '#444444' }}>
          <span>© 2026 TRUTHLENS LABS</span>
          <span className="hidden sm:inline">HACKATHON EDITION</span>
        </div>
      </div>
    </footer>
  );
}
