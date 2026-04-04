import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export default function SignalsRow({ red_flags, credible_signals }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
      
      {/* LEFT: RED FLAGS */}
      <div className="clay-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={18} className="text-accent-red" />
          <span className="font-mono text-xs text-text-muted tracking-widest uppercase">Red Flags</span>
          {red_flags?.length > 0 && (
            <span className="bg-accent-red text-bg-deep font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto">
              {red_flags.length}
            </span>
          )}
        </div>

        {red_flags?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {red_flags.map((flag, i) => (
              <motion.div
                key={`red-${i}`}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-[rgba(248,113,113,0.10)] border border-[rgba(248,113,113,0.22)] text-accent-red font-dm text-xs rounded-full px-3 py-1.5"
              >
                {flag}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="font-dm text-sm text-text-muted italic mt-3">
            ✓ No red flags detected
          </div>
        )}
      </div>

      {/* RIGHT: CREDIBLE SIGNALS */}
      <div className="clay-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle size={18} className="text-accent-green" />
          <span className="font-mono text-xs text-text-muted tracking-widest uppercase">Credible Signals</span>
          {credible_signals?.length > 0 && (
            <span className="bg-accent-green text-bg-deep font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto">
              {credible_signals.length}
            </span>
          )}
        </div>

        {credible_signals?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {credible_signals.map((signal, i) => (
              <motion.div
                key={`green-${i}`}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-[rgba(74,222,128,0.10)] border border-[rgba(74,222,128,0.22)] text-accent-green font-dm text-xs rounded-full px-3 py-1.5"
              >
                {signal}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="font-dm text-sm text-text-muted italic mt-3">
            ✗ No credible signals detected
          </div>
        )}
      </div>

    </div>
  );
}
