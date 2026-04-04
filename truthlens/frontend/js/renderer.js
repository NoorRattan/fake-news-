const VERDICT_COLORS = {
  'Likely Real':    { primary: '#47ff8f', dim: 'rgba(71, 255, 143, 0.08)' },
  'Likely Fake':    { primary: '#ff4747', dim: 'rgba(255, 71, 71, 0.08)' },
  'Misleading':     { primary: '#ff9147', dim: 'rgba(255, 145, 71, 0.08)' },
  'Mixed':          { primary: '#e8ff47', dim: 'rgba(232, 255, 71, 0.08)' },
  'Unverifiable':   { primary: '#666666', dim: 'rgba(102, 102, 102, 0.08)' }
};

const CONFIDENCE_LABELS = {
  'High': 'HIGH CONFIDENCE',
  'Medium': 'MEDIUM CONFIDENCE',
  'Low': 'LOW CONFIDENCE'
};

function renderResults(data) {
  document.getElementById('input-section').classList.add('hidden');
  document.getElementById('loading-section').classList.add('hidden');
  document.getElementById('results-section').classList.remove('hidden');

  renderVerdictBanner(data.verdict, data.credibility_score, data.confidence);
  renderSummary(data.summary);
  renderRedFlags(data.red_flags);
  renderCredibleSignals(data.credible_signals);
  renderManipulationTactics(data.manipulation_tactics);
  renderReasoning(data.reasoning);
  renderAdvice(data.advice);
  renderSources(data.cited_sources, data.domain_info);
  renderCorroboration(data.corroboration_results);
  renderArticleMeta(data.article_metadata);
  renderAnalysisMeta(data);
}

function renderVerdictBanner(verdict, score, confidence) {
  const colorData = VERDICT_COLORS[verdict] || VERDICT_COLORS['Unverifiable'];
  
  const textEl = document.getElementById('verdict-text');
  
  // Animate letters
  const upperVerdict = (verdict || 'UNKNOWN').toUpperCase();
  textEl.innerHTML = '';
  for (let i = 0; i < upperVerdict.length; i++) {
    const span = document.createElement('span');
    span.textContent = upperVerdict[i] === ' ' ? '\u00A0' : upperVerdict[i];
    span.className = 'verdict-letter';
    span.style.animationDelay = `${i * 50}ms`;
    textEl.appendChild(span);
  }
  
  textEl.style.color = colorData.primary;
  document.getElementById('score-number').style.color = colorData.primary;
  document.getElementById('verdict-accent-line').style.backgroundColor = colorData.primary;
  document.getElementById('verdict-banner').style.backgroundColor = colorData.dim;
  
  const confText = CONFIDENCE_LABELS[confidence] || 'UNKNOWN CONFIDENCE';
  document.getElementById('verdict-confidence').textContent = confText;
  document.getElementById('score-number').textContent = score ?? '--';
  
  const scoreBar = document.getElementById('score-bar');
  scoreBar.style.backgroundColor = colorData.primary;
  
  setTimeout(() => {
    scoreBar.style.width = `${score || 0}%`;
  }, 100);
}

function renderSummary(summary) {
  const el = document.getElementById('summary-text');
  el.innerHTML = summary || '';
  el.classList.add('serif-text');
}

function renderTags(listId, items, tagClass, emptyMessage) {
  const listEl = document.getElementById(listId);
  listEl.innerHTML = '';
  
  if (!items || items.length === 0) {
    const span = document.createElement('span');
    span.className = 'tag empty-state';
    span.textContent = emptyMessage;
    listEl.appendChild(span);
    return;
  }
  
  items.forEach(item => {
    const span = document.createElement('span');
    span.className = `tag ${tagClass}`;
    span.textContent = item;
    listEl.appendChild(span);
  });
}

function renderRedFlags(flags) {
  renderTags('red-flags-list', flags, 'red', 'No red flags detected');
}

function renderCredibleSignals(signals) {
  renderTags('credible-signals-list', signals, 'green', 'No credible signals detected');
}

function renderManipulationTactics(tactics) {
  renderTags('tactics-list', tactics, 'amber', 'No manipulation tactics detected');
}

function renderReasoning(reasoning) {
  document.getElementById('reasoning-text').textContent = reasoning || 'No reasoning provided.';
}

function renderAdvice(advice) {
  document.getElementById('advice-text').textContent = advice || 'No advice provided.';
}

function getRatingColor(rating) {
  switch (rating) {
    case 'Highly Credible': return 'var(--accent-green)';
    case 'Generally Credible': return 'var(--accent-green)';
    case 'Mixed Credibility': return 'var(--accent-amber)';
    case 'Questionable': return 'var(--accent-amber)';
    case 'Known Misinformation': return 'var(--accent-red)';
    case 'Satire': return 'var(--accent-blue)';
    default: return 'var(--muted)';
  }
}

function renderSources(citedSources, domainInfo) {
  const sourcesCard = document.getElementById('sources-card');
  const sourcesTable = document.getElementById('sources-table');
  sourcesTable.innerHTML = '';
  
  if ((!citedSources || citedSources.length === 0) && (!domainInfo || !domainInfo.domain)) {
    sourcesCard.classList.add('hidden');
    return;
  }
  
  sourcesCard.classList.remove('hidden');
  
  // Render domain info as first row if present
  if (domainInfo && domainInfo.domain) {
    createSourceRow(sourcesTable, domainInfo);
  }
  
  if (citedSources && citedSources.length > 0) {
    citedSources.forEach(source => {
      createSourceRow(sourcesTable, source);
    });
  }
}

function createSourceRow(container, sourceData) {
  const row = document.createElement('div');
  row.className = 'source-row';
  
  const domainEl = document.createElement('div');
  domainEl.className = 'source-domain';
  domainEl.textContent = sourceData.domain || 'Unknown';
  
  const ratingEl = document.createElement('div');
  ratingEl.className = 'source-rating';
  ratingEl.textContent = sourceData.rating || 'Unknown';
  const color = getRatingColor(sourceData.rating);
  ratingEl.style.borderColor = color;
  ratingEl.style.color = color;
  
  const biasEl = document.createElement('div');
  biasEl.className = 'source-bias';
  biasEl.textContent = sourceData.bias || 'Unknown';
  
  row.appendChild(domainEl);
  row.appendChild(ratingEl);
  row.appendChild(biasEl);
  container.appendChild(row);
}

function renderCorroboration(corroborationResults) {
  const body = document.getElementById('corroboration-body');
  body.innerHTML = '';
  
  if (!corroborationResults || corroborationResults.length === 0) {
    body.textContent = 'No corroborating or contradicting sources found.';
    body.style.color = 'var(--muted)';
    return;
  }
  
  body.style.color = 'inherit';
  
  corroborationResults.forEach(item => {
    const claimBlock = document.createElement('div');
    claimBlock.className = 'claim-block';
    
    const claimText = document.createElement('div');
    claimText.className = 'claim-text';
    claimText.textContent = item.claim;
    claimBlock.appendChild(claimText);
    
    if (item.results && item.results.length > 0) {
      item.results.forEach(res => {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'search-result';
        
        const titleA = document.createElement('a');
        titleA.className = 'result-title';
        titleA.href = res.url;
        titleA.target = '_blank';
        titleA.textContent = res.title;
        // make it block-like but interactive
        titleA.style.display = 'block';
        titleA.style.textDecoration = 'none';
        
        const urlDiv = document.createElement('div');
        urlDiv.className = 'result-url';
        urlDiv.textContent = res.url;
        
        const snippetDiv = document.createElement('div');
        snippetDiv.className = 'result-snippet';
        snippetDiv.textContent = res.snippet;
        
        resultDiv.appendChild(titleA);
        resultDiv.appendChild(urlDiv);
        resultDiv.appendChild(snippetDiv);
        
        claimBlock.appendChild(resultDiv);
      });
    }
    
    body.appendChild(claimBlock);
  });
}

function renderArticleMeta(articleMetadata) {
  const metaBar = document.getElementById('article-meta-bar');
  if (!articleMetadata || Object.keys(articleMetadata).length === 0) {
    metaBar.classList.add('hidden');
    return;
  }
  
  metaBar.classList.remove('hidden');
  document.getElementById('meta-domain').textContent = articleMetadata.domain || 'Unknown domain';
  document.getElementById('meta-title').textContent = articleMetadata.title || 'Unknown title';
  document.getElementById('meta-date').textContent = articleMetadata.date || 'Unknown date';
}

function renderAnalysisMeta(data) {
  document.getElementById('meta-id').textContent = `ID: ${data.analysis_id?.slice(0, 8) || '—'}`;
  document.getElementById('meta-input-type').textContent = `TYPE: ${data.input_type || '—'}`;
  document.getElementById('meta-time').textContent = `PROCESSED IN ${data.processing_time_ms || 0}ms`;
  document.getElementById('meta-timestamp').textContent = data.timestamp || '—';
}

function resetResults() {
  document.getElementById('results-section').classList.add('hidden');
  document.getElementById('input-section').classList.remove('hidden');
  
  // reset verdict
  document.getElementById('verdict-text').innerHTML = '';
  document.getElementById('verdict-confidence').textContent = '';
  document.getElementById('score-number').textContent = '';
  document.getElementById('score-bar').style.width = '0%';
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Attach corroboration toggle listener
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('corroboration-toggle');
  const body = document.getElementById('corroboration-body');
  const arrow = document.getElementById('corroboration-arrow');
  
  if (toggle && body && arrow) {
    toggle.addEventListener('click', () => {
      body.classList.toggle('hidden');
      if (body.classList.contains('hidden')) {
        arrow.style.transform = 'rotate(0deg)';
        arrow.textContent = '▼';
      } else {
        arrow.textContent = '▲';
      }
    });
  }
});

window.TruthLensRenderer = { 
  renderResults, 
  resetResults,
  VERDICT_COLORS,
  CONFIDENCE_LABELS
};
