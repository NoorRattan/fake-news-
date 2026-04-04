import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const ClayTag = ({ children, className, variant = 'default', ...props }) => {
  const variants = {
    default: 'border-border-subtle text-text-secondary',
    success: 'border-accent-green/30 text-accent-green bg-accent-green/5',
    error: 'border-accent-red/30 text-accent-red bg-accent-red/5',
    warning: 'border-accent-amber/30 text-accent-amber bg-accent-amber/5',
    info: 'border-accent-blue/30 text-accent-blue bg-accent-blue/5',
  };

  return (
    <span
      className={cn(
        "clay-tag inline-flex items-center",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
