import React from 'react';
import { Database } from 'lucide-react';
import clsx from 'clsx';

export default function SourcesCard({ cited_sources }) {
  if (!cited_sources || cited_sources.length === 0) return null;

  const getRatingBadge = (rating) => {
    switch (rating) {
      case "Highly Credible": return "text-[var(--green)] border-[var(--green)]";
      case "Generally Credible": return "text-text border-text";
      case "Mixed": return "text-[var(--amber)] border-[var(--amber)]";
      case "Questionable": return "text-[var(--red)] border-[var(--red)]";
      case "Known Misinformation": return "text-bg bg-[var(--red)] border-[var(--red)]";
      default: return "text-muted border-muted";
    }
  };

  return (
    <div className="editorial-card mt-5">
      <div className="flex items-center gap-2 mb-4 border-b border-border pb-3">
        <Database size={18} className="text-text" />
        <span className="font-bebas text-2xl text-text uppercase tracking-wide mt-1">Sources Cited in Article</span>
        <span className="bg-text text-bg font-mono text-xs font-bold px-2 py-0.5 ml-auto border border-text">
          {cited_sources.length}
        </span>
      </div>

      <div className="divide-y divide-border">
        {cited_sources.map((source, i) => (
          <div key={i} className="flex justify-between items-center py-4">
            <span className="font-mono text-sm font-bold text-text uppercase">
              {source.domain}
            </span>
            <div className="flex items-center gap-3 shrink-0">
              {source.rating && (
                <span className={clsx("editorial-tag", getRatingBadge(source.rating))}>
                  {source.rating}
                </span>
              )}
              {source.bias && (
                <span className="editorial-tag text-muted border-muted">
                  {source.bias} BIAS
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
