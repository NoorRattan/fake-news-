import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const ClayCard = ({ children, className, verdict, ...props }) => {
  const glowClass = verdict ? {
    'Likely Real': 'glow-green',
    'Likely Fake': 'glow-red',
    'Misleading': 'glow-amber',
    'Mixed': 'glow-yellow',
    'Unverifiable': 'glow-teal',
  }[verdict] : '';

  return (
    <div
      className={cn(
        "clay-card transition-all duration-300",
        glowClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
