import React from 'react';
import { Github, Twitter, Mail, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto py-12 px-6 border-t border-white/5 bg-bg-deep/50 backdrop-blur-sm relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="text-accent-purple" size={24} />
            <span className="font-display text-xl font-bold tracking-tight">TruthLens</span>
          </div>
          <p className="text-text-muted max-w-sm mb-6">
            Equipping users with AI-driven insights to navigate the digital landscape with confidence. 
            Stop misinformation in its tracks.
          </p>
          <div className="flex gap-4">
            <a href="https://github.com/NoorRattan/fake-news-" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-bg-clay flex items-center justify-center text-text-secondary hover:text-accent-purple hover:bg-white/5 transition-all">
              <Github size={20} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-bg-clay flex items-center justify-center text-text-secondary hover:text-accent-purple hover:bg-white/5 transition-all">
              <Twitter size={20} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-bg-clay flex items-center justify-center text-text-secondary hover:text-accent-purple hover:bg-white/5 transition-all">
              <Mail size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-display uppercase tracking-widest text-text-primary mb-6">Explore</h4>
          <ul className="space-y-4 text-text-secondary text-sm">
            <li><Link to="/" className="hover:text-accent-purple transition-colors">Home</Link></li>
            <li><Link to="/analyze" className="hover:text-accent-purple transition-colors">Analyze Content</Link></li>
            <li><Link to="/history" className="hover:text-accent-purple transition-colors">Search History</Link></li>
            <li><Link to="/about" className="hover:text-accent-purple transition-colors">About Team</Link></li>
          </ul>
        </div>

        {/* Status */}
        <div>
          <h4 className="text-sm font-display uppercase tracking-widest text-text-primary mb-6">Engine</h4>
          <div className="bg-bg-clay border border-border-clay rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-accent-green" />
              <span className="text-xs font-mono text-text-primary">v1.0.0 Stable</span>
            </div>
            <p className="text-[10px] text-text-muted uppercase tracking-tighter">
              Powered by Google Gemini & Llama 3
            </p>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-muted font-mono">
        <p>© 2026 O(1) GANG. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-text-primary transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
