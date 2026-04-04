import React from 'react';
import { Database } from 'lucide-react';
import clsx from 'clsx';

export default function SourcesCard({ cited_sources }) {
  if (!cited_sources || cited_sources.length === 0) return null;

  const getRatingBadge = (rating) => {
    switch (rating) {
      case "Highly Credible": return "text-accent-green bg-accent-green/10";
      case "Generally Credible": return "text-accent-violet bg-accent-violet/10";
      case "Mixed": return "text-accent-amber bg-accent-amber/10";
      case "Questionable": return "text-accent-red bg-accent-red/10";
      case "Known Misinformation": return "text-red-900 bg-red-900/20 border border-red-900";
      default: return "text-text-muted bg-white/5";
    }
  };

  return (
    <div className="clay-card p-6 mt-5">
      <div className="flex items-center gap-2 mb-4">
        <Database size={18} className="text-accent-blue" />
        <span className="font-mono text-xs text-text-muted tracking-widest uppercase">Sources Cited in Article</span>
        <span className="bg-accent-blue text-bg-deep font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto">
          {cited_sources.length}
        </span>
      </div>

      <div className="divide-y divide-[rgba(255,255,255,0.06)]">
        {cited_sources.map((source, i) => (
          <div key={i} className="flex justify-between items-center py-3">
            <span className="font-mono text-sm font-bold text-text-primary">
              {source.domain}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              {source.rating && (
                <span className={clsx("clay-pill font-mono text-[10px] px-3 py-1 border-transparent", getRatingBadge(source.rating))}>
                  {source.rating}
                </span>
              )}
              {source.bias && (
                <span className="clay-pill font-mono text-[10px] px-3 py-1 bg-white/5 text-text-secondary border-transparent">
                  {source.bias}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
