import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function TacticsCard({ manipulation_tactics }) {
  if (!manipulation_tactics || manipulation_tactics.length === 0) {
    return null;
  }

  return (
    <div className="clay-card p-6 mt-5">
      <div className="flex items-center gap-2 mb-1">
        <Zap size={18} className="text-accent-amber" />
        <span className="font-mono text-xs text-text-muted tracking-widest uppercase">Manipulation Tactics Detected</span>
        <span className="bg-accent-amber text-bg-deep font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto">
          {manipulation_tactics.length}
        </span>
      </div>
      <p className="font-dm text-xs text-text-muted mb-4">
        Recognized psychological manipulation patterns found in this content.
      </p>

      <div className="flex flex-wrap gap-2">
        {manipulation_tactics.map((tactic, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[rgba(251,146,60,0.10)] border border-[rgba(251,146,60,0.22)] text-accent-amber font-dm text-xs rounded-full px-3 py-1.5"
          >
            {tactic}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
