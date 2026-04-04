import { format } from 'date-fns';

export function getVerdictColor(verdict) {
  switch (verdict) {
    case "Likely Real": return "#4ade80";
    case "Likely Fake": return "#f87171";
    case "Misleading":  return "#fb923c";
    case "Mixed":       return "#facc15";
    case "Unverifiable":return "#2dd4bf";
    default:            return "#7a7890";
  }
}

export function getVerdictShadow(verdict) {
  switch (verdict) {
    case "Likely Real": return { boxShadow: "0 8px 32px rgba(0,0,0,0.45), 0 0 28px rgba(74,222,128,0.18), inset 0 1px 0 rgba(255,255,255,0.18)" };
    case "Likely Fake": return { boxShadow: "0 8px 32px rgba(0,0,0,0.45), 0 0 28px rgba(248,113,113,0.18), inset 0 1px 0 rgba(255,255,255,0.18)" };
    case "Misleading":  return { boxShadow: "0 8px 32px rgba(0,0,0,0.45), 0 0 28px rgba(251,146,60,0.18), inset 0 1px 0 rgba(255,255,255,0.18)" };
    case "Mixed":       return { boxShadow: "0 8px 32px rgba(0,0,0,0.45), 0 0 28px rgba(250,204,21,0.18), inset 0 1px 0 rgba(255,255,255,0.18)" };
    case "Unverifiable":return { boxShadow: "0 8px 32px rgba(0,0,0,0.45), 0 0 28px rgba(45,212,191,0.18), inset 0 1px 0 rgba(255,255,255,0.18)" };
    default:            return { boxShadow: "0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.18)" };
  }
}

export function getVerdictBg(verdict) {
  switch (verdict) {
    case "Likely Real": return "rgba(74,222,128,0.06)";
    case "Likely Fake": return "rgba(248,113,113,0.06)";
    case "Misleading":  return "rgba(251,146,60,0.06)";
    case "Mixed":       return "rgba(250,204,21,0.06)";
    case "Unverifiable":return "rgba(45,212,191,0.06)";
    default:            return "rgba(255,255,255,0.03)";
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
