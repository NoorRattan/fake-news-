import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -56, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
        style={{
          background: 'var(--bg)',
          borderBottom: '1px solid var(--border)',
          borderRadius: '0px',
          height: '56px',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
        }}
      >
        <div style={{
          maxWidth: '960px',
          margin: '0 auto',
          height: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 16px' // Will use CSS classes for desktop/mobile padding
        }}
        className="md:px-[40px] px-[16px]"
        >
          {/* LEFT — Brand */}
          <NavLink to="/" style={{ cursor: 'pointer', textDecoration: 'none' }}>
            <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '22px', letterSpacing: '2px' }}>
              <span style={{ color: 'var(--text)' }}>TRUTH</span>
              <span style={{ color: 'var(--green)' }}>LENS</span>
            </span>
          </NavLink>

          {/* RIGHT — Navigation links + CTA */}
          <div className="hidden sm:flex items-center" style={{ gap: '32px' }}>
            <NavLink 
              to="/" 
              style={({ isActive }) => ({
                fontFamily: '"DM Mono", monospace',
                fontSize: '11px',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: isActive ? 'var(--text)' : 'var(--muted)',
                textDecoration: isActive ? 'underline' : 'none'
              })}
              className="hover:text-[var(--text)] transition-colors"
            >
              Home
            </NavLink>
            <NavLink 
              to="/about" 
              style={({ isActive }) => ({
                fontFamily: '"DM Mono", monospace',
                fontSize: '11px',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: isActive ? 'var(--text)' : 'var(--muted)',
                textDecoration: isActive ? 'underline' : 'none'
              })}
              className="hover:text-[var(--text)] transition-colors"
            >
              About
            </NavLink>
            <NavLink 
              to="/history" 
              style={({ isActive }) => ({
                fontFamily: '"DM Mono", monospace',
                fontSize: '11px',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: isActive ? 'var(--text)' : 'var(--muted)',
                textDecoration: isActive ? 'underline' : 'none'
              })}
              className="hover:text-[var(--text)] transition-colors"
            >
              History
            </NavLink>
          </div>

          {/* Mobile hamburger */}
          <button 
            className="sm:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ fontFamily: '"DM Mono", monospace', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}
          >
            {menuOpen ? 'CLOSE' : 'MENU'}
          </button>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            style={{
              position: 'fixed',
              top: '56px',
              left: 0,
              right: 0,
              background: 'var(--bg)',
              borderBottom: '1px solid var(--border)',
              padding: '24px 16px',
              zIndex: 90
            }}
          >
            <NavLink 
              to="/"
              style={{
                fontFamily: '"DM Mono", monospace',
                fontSize: '14px',
                color: 'var(--muted)',
                display: 'block',
                paddingTop: '12px',
                paddingBottom: '12px',
                borderBottom: '1px solid var(--border)',
                textDecoration: 'none'
              }}
              className="hover:text-[var(--text)]"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink 
              to="/about"
              style={{
                fontFamily: '"DM Mono", monospace',
                fontSize: '14px',
                color: 'var(--muted)',
                display: 'block',
                paddingTop: '12px',
                paddingBottom: '12px',
                borderBottom: '1px solid var(--border)',
                textDecoration: 'none'
              }}
              className="hover:text-[var(--text)]"
              onClick={() => setMenuOpen(false)}
            >
              About
            </NavLink>
            <NavLink 
              to="/history"
              style={{
                fontFamily: '"DM Mono", monospace',
                fontSize: '14px',
                color: 'var(--muted)',
                display: 'block',
                paddingTop: '12px',
                paddingBottom: '12px',
                borderBottom: '1px solid var(--border)',
                textDecoration: 'none'
              }}
              className="hover:text-[var(--text)]"
              onClick={() => setMenuOpen(false)}
            >
              History
            </NavLink>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
