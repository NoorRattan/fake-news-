import { format } from 'date-fns';

/**
 * Returns the hex code for a verdict in the editorial design system.
 * Updated to use explicit hex codes from Prompt 6.
 */
export function getVerdictColor(verdict) {
  switch (verdict) {
    case 'Likely Real':    return '#47ff8f'
    case 'Likely Fake':    return '#ff4747'
    case 'Misleading':     return '#ff9147'
    case 'Mixed':          return '#e8ff47'
    case 'Unverifiable':   return '#666666'
    default:               return '#666666'
  }
}

/**
 * Returns a transparent background color (tint) for verdict cards.
 * New in Phase 2 for VerdictBanner background decoration.
 */
export function getVerdictBg(verdict) {
  switch(verdict) {
    case 'Likely Real':    return 'rgba(71, 255, 143, 0.05)'
    case 'Likely Fake':    return 'rgba(255, 71, 71, 0.05)'
    case 'Misleading':     return 'rgba(255, 145, 71, 0.05)'
    case 'Mixed':          return 'rgba(232, 255, 71, 0.05)'
    case 'Unverifiable':   return 'rgba(102, 102, 102, 0.05)'
    default:               return 'rgba(255, 255, 255, 0.02)'
  }
}

export function formatTimestamp(isoString) {
  try {
    return format(new Date(isoString), "MMM d 'at' h:mm a");
  } catch {
    return "Unknown date";
  }
}

export function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function truncateText(text, maxChars) {
  if (!text) return "";
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars).trimEnd() + "...";
}

export function extractDomain(urlStr) {
  try {
    return new URL(urlStr).hostname;
  } catch {
    return urlStr;
  }
}

export function classifyInput(inputValue) {
  const t = inputValue.trim();
  if (t.startsWith("http://") || t.startsWith("https://")) return "URL";
  if (t.length < 150) return "HEADLINE";
  return "ARTICLE_TEXT";
}
