import React from 'react';
import { BookOpen } from 'lucide-react';
import clsx from 'clsx';

export default function SummaryCard({ summary, domain_info, article_metadata }) {
  const showSourceInfo = domain_info?.domain || article_metadata?.title;

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
    <div className={`grid grid-cols-1 ${showSourceInfo ? 'md:grid-cols-2' : ''} gap-5 mt-5`}>
      
      {/* LEFT: SUMMARY */}
      <div className="clay-card p-6">
        <div className="flex items-center gap-2 mb-3 cursor-default">
          <BookOpen size={16} className="text-accent-violet" />
          <span className="font-mono text-xs text-text-muted tracking-widest uppercase">What This Claims</span>
        </div>
        {summary ? (
          <p className="font-dm text-base text-text-primary leading-relaxed">
            {summary}
          </p>
        ) : (
          <p className="font-dm text-sm text-text-muted italic">
            No summary available.
          </p>
        )}
      </div>

      {/* RIGHT: SOURCE INFO */}
      {showSourceInfo && (
        <div className="clay-card p-6 flex flex-col gap-4">
          {article_metadata?.title && (
            <div>
              <div className="font-mono text-xs text-text-muted tracking-widest uppercase mb-2">Article Info</div>
              <h4 className="font-dm font-medium text-sm text-text-primary line-clamp-2">
                {article_metadata.title}
              </h4>
              <div className="font-mono text-xs text-text-muted mt-1 ">{article_metadata.date}</div>
              <div className="font-mono text-xs text-accent-blue mt-1.5">{article_metadata.domain}</div>
            </div>
          )}

          {domain_info?.domain && (
            <div className={article_metadata?.title ? 'mt-auto pt-4 border-t border-white/5' : ''}>
              {!article_metadata?.title && (
                <div className="font-mono text-xs text-text-muted tracking-widest uppercase mb-2">Domain Credibility</div>
              )}
              <div className="font-mono font-bold text-sm text-text-primary mb-3">
                {domain_info.domain}
              </div>
              <div className="flex flex-wrap gap-2">
                {domain_info.rating && (
                  <span className={clsx("clay-pill font-mono text-[10px] px-3 py-1 border-transparent", getRatingBadge(domain_info.rating))}>
                    {domain_info.rating}
                  </span>
                )}
                {domain_info.bias && (
                  <span className="clay-pill font-mono text-[10px] px-3 py-1 bg-white/5 text-text-secondary border-transparent">
                    {domain_info.bias} Bias
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
