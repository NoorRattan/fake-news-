import { format } from 'date-fns';

function formatList(items, fallback = 'None detected') {
  if (!Array.isArray(items) || items.length === 0) {
    return fallback;
  }

  return items
    .map((item) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object') {
        return item.claim || item.title || item.label || String(item);
      }
      return String(item);
    })
    .join(', ');
}

/**
 * Returns the hex code for a verdict in the editorial design system.
 * Updated to use explicit hex codes from Prompt 6.
 */
export function getVerdictColor(verdict) {
  switch (verdict) {
    case 'Likely Real':
      return '#47ff8f';
    case 'Likely Fake':
      return '#ff4747';
    case 'Misleading':
      return '#ff9147';
    case 'Mixed':
      return '#e8ff47';
    case 'Unverifiable':
      return '#666666';
    default:
      return '#666666';
  }
}

/**
 * Returns a transparent background color (tint) for verdict cards.
 * New in Phase 2 for VerdictBanner background decoration.
 */
export function getVerdictBg(verdict) {
  switch (verdict) {
    case 'Likely Real':
      return 'rgba(71, 255, 143, 0.05)';
    case 'Likely Fake':
      return 'rgba(255, 71, 71, 0.05)';
    case 'Misleading':
      return 'rgba(255, 145, 71, 0.05)';
    case 'Mixed':
      return 'rgba(232, 255, 71, 0.05)';
    case 'Unverifiable':
      return 'rgba(102, 102, 102, 0.05)';
    default:
      return 'rgba(255, 255, 255, 0.02)';
  }
}

export function buildResultSummary(result) {
  if (!result) return '';

  const redFlags = formatList(result.red_flags);
  const credibleSignals = formatList(result.credible_signals);
  const tactics = formatList(result.manipulation_tactics);
  const keyClaims = formatList(result.key_claims, 'None captured');

  return [
    'TruthLens Analysis',
    '==================',
    `Verdict:     ${result.verdict}`,
    `Score:       ${result.credibility_score} / 100`,
    `Confidence:  ${result.confidence}`,
    '',
    `Summary: ${result.summary}`,
    '',
    `Key Claims: ${keyClaims}`,
    `Red Flags: ${redFlags}`,
    `Credible Signals: ${credibleSignals}`,
    `Manipulation Tactics: ${tactics}`,
    '',
    `Reasoning: ${result.reasoning}`,
    '',
    `Advice: ${result.advice}`,
    '',
    `Analysis ID: ${result.analysis_id}`,
    `Processed in: ${result.processing_time_ms}ms`,
    '',
    'Analyzed by TruthLens - AI-Powered Misinformation Detector',
  ].join('\n');
}

export function formatTimestamp(isoString) {
  try {
    return format(new Date(isoString), "MMM d 'at' h:mm a");
  } catch {
    return 'Unknown date';
  }
}

export function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function truncateText(text, maxChars) {
  if (!text) return '';
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars).trimEnd()}...`;
}

export function extractDomain(urlStr) {
  try {
    return new URL(urlStr).hostname;
  } catch {
    return urlStr;
  }
}

export function classifyInput(inputValue) {
  const trimmedValue = inputValue.trim();
  if (trimmedValue.startsWith('http://') || trimmedValue.startsWith('https://')) {
    return 'URL';
  }
  if (trimmedValue.length < 150) return 'HEADLINE';
  return 'ARTICLE_TEXT';
}
