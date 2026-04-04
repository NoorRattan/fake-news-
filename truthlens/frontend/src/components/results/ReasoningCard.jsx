import React from 'react';
import { MessageSquare, Lightbulb } from 'lucide-react';

export default function ReasoningCard({ reasoning, advice }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
      
      {/* LEFT: REASONING */}
      <div className="clay-card p-6 border-l-4 border-l-accent-violet">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare size={16} className="text-accent-violet" />
          <span className="font-mono text-xs text-text-muted tracking-widest uppercase">Why This Verdict?</span>
        </div>
        <p className="font-mono text-[13px] leading-[1.9] text-text-secondary">
          {reasoning || "Reasoning not available."}
        </p>
      </div>

      {/* RIGHT: ADVICE */}
      <div 
        className="clay-card p-6 border-l-4 border-l-accent-yellow"
        style={{ background: 'rgba(250,204,21,0.04)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={16} className="text-accent-yellow" />
          <span className="font-mono text-xs text-text-muted tracking-widest uppercase">What Should You Do?</span>
        </div>
        <p className="font-dm text-sm leading-relaxed text-text-primary">
          {advice || "No specific advice available."}
        </p>
      </div>

    </div>
  );
}
