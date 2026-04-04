import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <motion.nav
        aria-label="Main navigation"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-0 left-0 w-full z-[100] h-16 md:h-[72px] flex items-center justify-between px-6 md:px-10"
        style={{
          background: 'rgba(8, 8, 16, 0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* LEFT: Brand */}
        <motion.div whileHover={{ scale: 1.02 }} className="flex items-center">
          <NavLink to="/" className="flex items-center gap-2.5">
            <svg
              className="w-[18px] h-[18px] animate-pulse-glow rounded-full"
              viewBox="0 0 24 24"
              fill="none"
              stroke="url(#lensGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="lensGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--accent-purple)" />
                  <stop offset="100%" stopColor="var(--accent-violet)" />
                </linearGradient>
              </defs>
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span className="font-syne font-bold text-lg">
              <span className="text-text-primary">Truth</span>
              <span className="gradient-text">Lens</span>
            </span>
          </NavLink>
        </motion.div>

        {/* CENTER: Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { name: 'Home', path: '/' },
            { name: 'Analyze', path: '/analyze' },
            { name: 'History', path: '/history' },
            { name: 'About', path: '/about' },
          ].map((link) => (
            <motion.div key={link.name} whileHover={{ y: -1 }}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `relative font-dm text-sm font-medium transition-colors ${
                    isActive ? 'text-accent-purple' : 'text-text-secondary hover:text-text-primary'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    {isActive && (
                      <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent-purple" />
                    )}
                  </>
                )}
              </NavLink>
            </motion.div>
          ))}
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center">
          {/* Desktop CTA */}
          <div className="hidden md:block">
            <NavLink to="/analyze">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(168,85,247,0.35)' }}
                whileTap={{ scale: 0.97 }}
                className="clay-btn-primary font-dm font-medium text-sm px-5 py-2.5"
              >
                Analyze Now
              </motion.button>
            </NavLink>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-text-secondary w-10 h-10 flex flex-col items-end justify-center"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={menuOpen}
          >
            <Menu aria-hidden="true" size={22} color="currentColor" />
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
            transition={{ duration: 0.2 }}
            className="fixed top-16 md:top-[72px] left-0 w-full z-[90] flex flex-col pt-4 pb-6 px-6"
            style={{
              background: 'rgba(8, 8, 16, 0.97)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {[
              { name: 'Home', path: '/' },
              { name: 'Analyze', path: '/analyze' },
              { name: 'History', path: '/history' },
              { name: 'About', path: '/about' },
            ].map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `text-lg font-dm font-medium py-3 border-b transition-colors ${
                    isActive ? 'text-accent-purple border-accent-purple/20' : 'text-text-secondary border-white/5 hover:text-text-primary'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            
            <div className="mt-6">
              <NavLink to="/analyze" onClick={() => setMenuOpen(false)}>
                <button className="clay-btn-primary w-full py-3 font-dm text-base font-medium">
                  Analyze Now
                </button>
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
