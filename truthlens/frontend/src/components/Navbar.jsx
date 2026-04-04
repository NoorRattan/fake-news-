import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Shield, BarChart2, History, Info, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClayButton } from './ui/ClayButton';
import { clsx } from 'clsx';

const NavItem = ({ to, icon: Icon, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) => clsx(
      "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
      isActive 
        ? "bg-accent-purple/15 text-accent-purple font-medium" 
        : "text-text-secondary hover:text-text-primary hover:bg-bg-clay"
    )}
  >
    <Icon size={18} />
    <span>{children}</span>
  </NavLink>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location]);

  return (
    <nav className={clsx(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4",
      scrolled ? "bg-bg-base/80 backdrop-blur-xl border-b border-white/5 py-3" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-accent-purple flex items-center justify-center shadow-clay group-hover:rotate-12 transition-transform duration-300">
            <Shield className="text-white" size={24} fill="currentColor" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-xl font-bold tracking-tight text-text-primary">TruthLens</span>
            <span className="text-[10px] uppercase tracking-widest text-accent-purple font-bold">O(1) Gang</span>
          </div>
        </NavLink>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2 glass px-2 py-1.5 rounded-full border-white/10 shadow-lg">
          <NavItem to="/" icon={Shield}>Home</NavItem>
          <NavItem to="/analyze" icon={BarChart2}>Analyze</NavItem>
          <NavItem to="/history" icon={History}>History</NavItem>
          <NavItem to="/about" icon={Info}>About</NavItem>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-bg-clay border border-border-clay text-text-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-6 right-6 md:hidden glass rounded-3xl p-6 border-white/10 shadow-2xl flex flex-col gap-4"
          >
            <NavItem to="/" icon={Shield}>Home</NavItem>
            <NavItem to="/analyze" icon={BarChart2}>Analyze</NavItem>
            <NavItem to="/history" icon={History}>History</NavItem>
            <NavItem to="/about" icon={Info}>About</NavItem>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
