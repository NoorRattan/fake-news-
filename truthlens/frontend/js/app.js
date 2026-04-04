const AppState = {
  currentInput: '',
  inputMode: 'text',   // 'text' | 'url'
  isLoading: false,
  lastResult: null,
  sessionHistory: []
};

const EXAMPLES = {
  fake: {
    mode: 'text',
    text: `BREAKING: Scientists confirm 5G towers are secretly beaming mind-control signals directly into people's brains, causing mass confusion and compliance. Government insiders who spoke anonymously say the rollout was planned by the World Economic Forum years ago. Thousands are reporting headaches and strange thoughts after cell towers were installed near their homes. Share this NOW before they delete it!`
  },
  real: {
    mode: 'text',
    text: `A new peer-reviewed study published in The Lancet on April 2, 2026 found that regular physical activity of at least 150 minutes per week reduces the risk of cardiovascular disease by 35% in adults over 40. Researchers from Johns Hopkins University analyzed data from over 85,000 participants across 14 countries over a 10-year period. The findings are consistent with current WHO guidelines and previous meta-analyses on the subject.`
  },
  misleading: {
    mode: 'text',
    text: `Crime rates surge 300% in cities that adopted sanctuary policies, report finds. A newly released data report has found significant increases in reported incidents in several urban areas. Critics of sanctuary city policies have pointed to these numbers as evidence that limiting cooperation with federal immigration authorities leads to public safety consequences. City officials dispute the characterization of the data.`
  },
  claim: {
    mode: 'text',
    text: `NASA scientists confirmed that the moon is slowly drifting away from Earth and will completely leave Earth's orbit within 500 years.`
  }
};

let loadingInterval = null;
let phaseTimeouts = [];

function showLoadingState(inputMode) {
  document.getElementById('input-section').classList.add('hidden');
  document.getElementById('results-section').classList.add('hidden');
  document.getElementById('error-section').classList.add('hidden');
  document.getElementById('loading-section').classList.remove('hidden');

  const phaseFetch = document.getElementById('phase-fetch');
  const phaseAi = document.getElementById('phase-ai');
  const phaseSearch = document.getElementById('phase-search');
  
  const textMessages = [
    "Classifying input type...",
    "Running linguistic analysis...",
    "Detecting manipulation patterns...",
    "Generating AI verdict...",
    "Searching the web..."
  ];
  
  const urlMessages = [
    "Fetching article from URL...",
    "Extracting article text...",
    "Running AI analysis...",
    "Searching for corroboration..."
  ];
  
  const messages = inputMode === 'url' ? urlMessages : textMessages;
  let msgIdx = 0;
  
  document.getElementById('loading-phase-text').textContent = messages[msgIdx];
  
  loadingInterval = setInterval(() => {
    msgIdx = (msgIdx + 1) % messages.length;
    document.getElementById('loading-phase-text').textContent = messages[msgIdx];
  }, 2500);

  // Reset phases
  [phaseFetch, phaseAi, phaseSearch].forEach(el => {
    el.className = 'phase-item';
    el.querySelector('.phase-dot').textContent = '○';
  });

  const setPhaseState = (el, state) => {
    el.className = `phase-item ${state}`;
    const dot = el.querySelector('.phase-dot');
    if (state === 'active') dot.textContent = '⬤';
    else if (state === 'done') dot.textContent = '✓';
    else dot.textContent = '○';
  };

  if (inputMode === 'url') {
    setPhaseState(phaseFetch, 'active');
    
    phaseTimeouts.push(setTimeout(() => {
      setPhaseState(phaseFetch, 'done');
      setPhaseState(phaseAi, 'active');
    }, 2000));
    
    phaseTimeouts.push(setTimeout(() => {
      setPhaseState(phaseAi, 'done');
      setPhaseState(phaseSearch, 'active');
    }, 5000));
    
  } else {
    // text mode logic
    setPhaseState(phaseFetch, 'done'); // no fetching
    setPhaseState(phaseAi, 'active');
    
    phaseTimeouts.push(setTimeout(() => {
      setPhaseState(phaseAi, 'done');
      setPhaseState(phaseSearch, 'active');
    }, 3000));
  }
}

function hideLoadingState() {
  document.getElementById('loading-section').classList.add('hidden');
  if (loadingInterval) clearInterval(loadingInterval);
  phaseTimeouts.forEach(clearTimeout);
  phaseTimeouts = [];
}

function showError(message) {
  hideLoadingState();
  document.getElementById('input-section').classList.add('hidden');
  document.getElementById('results-section').classList.add('hidden');
  document.getElementById('error-section').classList.remove('hidden');
  document.getElementById('error-message').textContent = message;
}

function getVerdictColor(verdict) {
  // Use mapping from renderer.js if available, else a fallback
  const mapping = window.TruthLensRenderer?.VERDICT_COLORS || {};
  return (mapping[verdict] && mapping[verdict].primary) || '#666666';
}

function addToHistory(result, inputPreview) {
  const item = {
    id: result.analysis_id,
    verdict: result.verdict,
    score: result.credibility_score,
    preview: inputPreview.slice(0, 80),
    timestamp: result.timestamp || new Date().toISOString(),
    fullResult: result
  };
  
  AppState.sessionHistory.unshift(item);
  if (AppState.sessionHistory.length > 5) {
    AppState.sessionHistory.pop();
  }
  
  try {
    sessionStorage.setItem('tl_history', JSON.stringify(AppState.sessionHistory));
  } catch(e) {}
  
  document.getElementById('history-count-badge').textContent = AppState.sessionHistory.length;
  renderHistoryPanel();
}

function loadHistoryFromStorage() {
  try {
    const data = sessionStorage.getItem('tl_history');
    if (data) {
      AppState.sessionHistory = JSON.parse(data);
      document.getElementById('history-count-badge').textContent = AppState.sessionHistory.length;
      renderHistoryPanel();
    }
  } catch(e) {}
}

function formatRelativeTime(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function renderHistoryPanel() {
  const list = document.getElementById('history-list');
  list.innerHTML = '';
  
  if (AppState.sessionHistory.length === 0) {
    list.textContent = 'No analyses yet.';
    list.style.color = 'var(--muted)';
    list.style.fontSize = '11px';
    list.style.textAlign = 'center';
    list.style.marginTop = '20px';
    return;
  }
  
  AppState.sessionHistory.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.className = 'history-item';
    
    const dot = document.createElement('div');
    dot.className = 'history-verdict-dot';
    dot.style.backgroundColor = getVerdictColor(item.verdict);
    
    const content = document.createElement('div');
    
    const preview = document.createElement('div');
    preview.className = 'history-preview';
    preview.textContent = item.preview;
    
    const time = document.createElement('div');
    time.className = 'history-time';
    time.textContent = formatRelativeTime(item.timestamp);
    
    content.appendChild(preview);
    content.appendChild(time);
    
    itemEl.appendChild(dot);
    itemEl.appendChild(content);
    
    itemEl.addEventListener('click', () => {
      AppState.lastResult = item.fullResult;
      document.getElementById('history-panel').classList.remove('open');
      document.getElementById('input-section').classList.add('hidden');
      document.getElementById('error-section').classList.add('hidden');
      window.TruthLensRenderer.renderResults(item.fullResult);
      window.TruthLensChart.updateChart(item.fullResult.credibility_score, getVerdictColor(item.fullResult.verdict));
    });
    
    list.appendChild(itemEl);
  });
}

function copyResultToClipboard() {
  if (!AppState.lastResult) return;
  const res = AppState.lastResult;
  
  const text = `=== TRUTHLENS ANALYSIS ===
VERDICT: ${res.verdict || 'Unknown'}
CREDIBILITY SCORE: ${res.credibility_score || 0}/100
CONFIDENCE: ${res.confidence || 'Unknown'}

SUMMARY:
${res.summary || ''}

RED FLAGS: ${(res.red_flags || []).join(', ') || 'None'}
CREDIBLE SIGNALS: ${(res.credible_signals || []).join(', ') || 'None'}
MANIPULATION TACTICS: ${(res.manipulation_tactics || []).join(', ') || 'None'}

REASONING:
${res.reasoning || ''}

ADVICE:
${res.advice || ''}

Analyzed by TruthLens — See Through the Noise`;

  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copy-btn');
    const orig = btn.textContent;
    btn.textContent = 'COPIED!';
    setTimeout(() => { btn.textContent = orig; }, 2000);
  }).catch(err => {
    console.error('Clipboard copy failed', err);
  });
}

function shareResult() {
  if (!AppState.lastResult) return;
  const text = `TruthLens evaluated this claim and found it "${AppState.lastResult.verdict}" (Score: ${AppState.lastResult.credibility_score}/100).\nAnalyze facts before you share.`;
  
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('share-btn');
    const orig = btn.textContent;
    btn.textContent = 'COPIED TO CLIPBOARD!';
    setTimeout(() => { btn.textContent = orig; }, 2000);
  }).catch(err => console.error('Clipboard copy failed', err));
}

async function handleSubmit() {
  const isUrl = AppState.inputMode === 'url';
  const val = isUrl ? document.getElementById('url-input').value.trim() : document.getElementById('text-input').value.trim();
  
  if (!val) {
    if (isUrl) {
      document.getElementById('url-error').classList.remove('hidden');
    } else {
      // show simple inline error
      const errEl = document.createElement('div');
      errEl.className = 'inline-error';
      errEl.id = 'temp-text-error';
      errEl.textContent = 'Please provide some text to analyze.';
      const area = document.getElementById('tab-text');
      area.appendChild(errEl);
      setTimeout(() => errEl.remove(), 3000);
    }
    return;
  }
  
  if (!isUrl && val.length < 30) {
    const errEl = document.createElement('div');
    errEl.className = 'inline-error';
    errEl.id = 'temp-text-error';
    errEl.textContent = 'Text is too short. Please provide at least 30 characters.';
    const area = document.getElementById('tab-text');
    area.appendChild(errEl);
    setTimeout(() => errEl.remove(), 3000);
    return;
  }
  
  if (isUrl && !val.startsWith('http')) {
    document.getElementById('url-error').classList.remove('hidden');
    return;
  }
  
  AppState.isLoading = true;
  const btn = document.getElementById('analyze-btn');
  btn.disabled = true;
  
  showLoadingState(AppState.inputMode);
  
  try {
    const result = await window.TruthLensAPI.analyzeContent(val);
    AppState.lastResult = result;
    addToHistory(result, val);
    
    hideLoadingState();
    window.TruthLensRenderer.renderResults(result);
    window.TruthLensChart.updateChart(result.credibility_score, getVerdictColor(result.verdict));
    
    document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
    
  } catch (error) {
    console.error('Analysis error:', error);
    showError(error.message);
  } finally {
    AppState.isLoading = false;
    btn.disabled = false;
  }
}

// DOM Init
document.addEventListener('DOMContentLoaded', () => {
  loadHistoryFromStorage();
  
  // Health check silently
  window.TruthLensAPI.checkHealth().then(res => {
    if (!res) {
      const banner = document.createElement('div');
      banner.style.background = 'var(--accent-red)';
      banner.style.color = '#000';
      banner.style.textAlign = 'center';
      banner.style.padding = '8px';
      banner.style.fontSize = '11px';
      banner.style.fontWeight = 'bold';
      banner.textContent = 'Backend connection failed — demo mode only';
      document.body.insertBefore(banner, document.body.firstChild);
    }
  });

  document.getElementById('analyze-btn').addEventListener('click', handleSubmit);
  
  document.getElementById('text-input').addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit();
    }
  });
  
  document.getElementById('text-input').addEventListener('input', (e) => {
    const val = e.target.value;
    AppState.currentInput = val;
    document.getElementById('char-count').textContent = `${val.length} / 50,000 characters`;
    
    const badge = document.getElementById('short-claim-badge');
    if (val.length > 0 && val.length < 150) {
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  });
  
  document.getElementById('url-input').addEventListener('input', (e) => {
    AppState.currentInput = e.target.value;
    document.getElementById('url-error').classList.add('hidden');
  });
  
  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      
      const tab = e.target.getAttribute('data-tab');
      AppState.inputMode = tab;
      
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
      document.getElementById(`tab-${tab}`).classList.remove('hidden');
    });
  });
  
  // Examples
  document.querySelectorAll('.example-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const exKey = e.target.getAttribute('data-example');
      const exData = EXAMPLES[exKey];
      if (!exData) return;
      
      if (exData.mode === 'text') {
        const tbtn = document.querySelector('.tab-btn[data-tab="text"]');
        tbtn.click();
        const textarea = document.getElementById('text-input');
        textarea.value = exData.text;
        textarea.dispatchEvent(new Event('input'));
      }
    });
  });
  
  document.getElementById('new-analysis-btn').addEventListener('click', () => {
    window.TruthLensRenderer.resetResults();
    // clear inputs optionally, but we leave text in case user wants to tweak.
    // wait, resetResults() states "Clears all populated fields back to empty" for results.
  });
  
  document.getElementById('error-retry-btn').addEventListener('click', () => {
    document.getElementById('error-section').classList.add('hidden');
    document.getElementById('input-section').classList.remove('hidden');
  });
  
  const historyPanel = document.getElementById('history-panel');
  document.getElementById('history-toggle-btn').addEventListener('click', () => {
    historyPanel.classList.toggle('open');
  });
  
  document.getElementById('history-close').addEventListener('click', () => {
    historyPanel.classList.remove('open');
  });
  
  document.getElementById('copy-btn').addEventListener('click', copyResultToClipboard);
  document.getElementById('share-btn').addEventListener('click', shareResult);
  
  document.getElementById('text-input').focus();
});
