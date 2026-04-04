import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const ClayButton = ({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md', 
  ...props 
}) => {
  const variants = {
    primary: 'clay-button text-white',
    secondary: 'bg-bg-surface border border-border-clay text-text-primary hover:bg-bg-clay',
    outline: 'bg-transparent border border-accent-purple text-accent-purple hover:bg-accent-purple/10',
    ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-clay',
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-xs',
    md: 'px-6 py-2.5 text-sm font-medium',
    lg: 'px-8 py-3.5 text-base font-semibold',
  };

  return (
    <button
      className={cn(
        "flex items-center justify-center gap-2 rounded-full transition-all duration-300",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
