# TruthLens Frontend Integration Guide

This document is the complete reference for the frontend developer integrating the TruthLens UI with its backend services. You can use it to build the full UI without analyzing the server code.

## Section 1 — Overview
TruthLens backend evaluates the factual reliability of pasted text, URL articles, and short claims. It utilizes LLMs, independent search queries, and dynamic credibility scoring datasets to return an `AnalysisResult` directly to you.

Your minimal required scope is to manage state via the defined JSON payloads, execute POSTs, render a conditional UI dependent on the returned verdicts, and gracefully catch mapped error states.

The backend binds dynamically. Locally, it'll run on `http://localhost:8000`. Once on Render, it will expose its production endpoint. You must extract this URL locally under `api.js` using a configuration variable so they can switch it once deploying later.

## Section 2 — Base URL Configuration
Place this exact pattern at the top of your `api.js`.

```javascript
// CHANGE THIS to the live URL after backend is deployed
const API_BASE_URL = "http://localhost:8000";
```
*Always prepend this constant for your fetch executions, rather than hardcoding.*

## Section 3 — The Three Endpoints

### 3.1 — POST /api/analyze
```javascript
const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input: userInputString })
});
```

#### Success response (HTTP 200)
```json
{
  "analysis_id": "3f7a2c1b-1234-abcd-9876-0000abcdefff",
  "timestamp": "2026-04-04T14:23:11.847219+00:00",
  "input_type": "ARTICLE_TEXT",
  "processing_time_ms": 4312,
  "verdict": "Likely Fake",
  "credibility_score": 12,
  "confidence": "High",
  "summary": "This article claims that COVID-19 vaccines contain tracking microchips.",
  "red_flags": ["No sources cited", "Emotional/sensational headline"],
  "credible_signals": [],
  "manipulation_tactics": ["Appeal to Fear", "False Urgency"],
  "key_claims": ["Vaccines contain microchips", "5G triggers microchips"],
  "reasoning": "The content exhibits multiple hallmarks of known disinformation patterns including lacking peer-reviewed authority and using intense scare narratives.",
  "advice": "Do not share this content. Wait for scientific announcements backed by reputable health authorities.",
  "domain_info": {
    "domain": "example.com",
    "rating": "Questionable",
    "bias": "Far Right"
  },
  "cited_sources": [
    { "domain": "reuters.com", "rating": "Highly Credible", "bias": "Center" }
  ],
  "corroboration_results": [
    {
      "claim": "Vaccines contain microchips",
      "results": [
        { "title": "Disproven myth about mRNA and microchips", "url": "https://example-factcheck.org", "snippet": "Medical researchers have stated multiple times..." }
      ]
    }
  ],
  "article_metadata": {
    "title": "Shocking Vaccine Secrets They Won't Tell You",
    "date": "2026-04-03",
    "domain": "example.com"
  }
}
```
*Note*: `domain_info`, `article_metadata` can both be `null`. `cited_sources` and `corroboration_results` are always arrays but may be empty `[]`.

#### Error response (HTTP 400 — invalid input):
```json
{ "error": "Invalid Input", "detail": "Input must be at least 10 characters", "analysis_id": "" }
```

#### Error response (HTTP 503 — AI service unavailable):
```json
{ "error": "Service Unavailable", "detail": "Analysis could not be completed at this time.", "analysis_id": "" }
```

### 3.2 — GET /api/health
```javascript
const response = await fetch(`${API_BASE_URL}/api/health`);
const data = await response.json();
```
**Response Sample**: `{"status": "ok", "version": "1.0", "uptime_seconds": 124}`
Use this to check if the backend is alive before showing the UI. If it fails, show a "backend unavailable" error state.

### 3.3 — GET /api/history
```javascript
const response = await fetch(`${API_BASE_URL}/api/history`);
const data = await response.json();
```
**Response Sample:**
```json
{ "analyses": [ { "analysis_id": "...", "verdict": "..." } ] }
```
This array contains the last 20 analyses stored in server memory. It resets when the server restarts.

## Section 4 — Input Type Behavior

| `input_type` value | What it means | UI action |
|---|---|---|
| `"URL"` | Backend fetched and analyzed a web page | Show `article_metadata.title` and `article_metadata.domain` in an info bar above results |
| `"HEADLINE"` | Short claim under 150 characters | Show badge: "Analyzed as: Short Claim" |
| `"ARTICLE_TEXT"` | Full article text pasted | No special indicator needed |

## Section 5 — Verdict to UI Mapping

You must map verdict fields to distinct colors in styling.

| `verdict` value | Display color | CSS variable | Background tint |
|---|---|---|---|
| `"Likely Real"` | `#47ff8f` | `--accent-green` | `rgba(71, 255, 143, 0.08)` |
| `"Likely Fake"` | `#ff4747` | `--accent-red` | `rgba(255, 71, 71, 0.08)` |
| `"Misleading"` | `#ff9147` | `--accent-amber` | `rgba(255, 145, 71, 0.08)` |
| `"Mixed"` | `#e8ff47` | `--accent-yellow` | `rgba(232, 255, 71, 0.08)` |
| `"Unverifiable"` | `#666666` | `--muted` | `rgba(102, 102, 102, 0.08)` |

Also provide the credibility score color logic:
```javascript
function getScoreColor(score) {
    if (score >= 70) return "var(--accent-green)";
    if (score >= 45) return "var(--accent-amber)";
    if (score >= 25) return "var(--accent-yellow)";
    return "var(--accent-red)";
}
```

## Section 6 — The Four Example Inputs
You must build a set of simple "Try an Example" buttons that pre-fills strings.

**Example 1 — Likely Fake** (label the button "Try: Fake News"):
```
BREAKING: Scientists PROVE that the COVID-19 vaccine permanently alters human DNA and activates a hidden kill switch via 5G networks. Anonymous whistleblowers from inside Pfizer have leaked documents showing that 98% of vaccinated individuals will experience catastrophic immune collapse within 3 years. The mainstream media is paid to hide this SHOCKING truth. Share this NOW before it gets deleted. Big Pharma is terrified of this information getting out. Your government is lying to you!!!
```

**Example 2 — Likely Real** (label the button "Try: Real News"):
```
The Intergovernmental Panel on Climate Change released its latest assessment report on Monday, confirming that global average temperatures have risen 1.1 degrees Celsius above pre-industrial levels. The report, authored by 234 scientists from 66 countries and drawing on over 14,000 peer-reviewed studies, projects that without significant emissions reductions, temperatures could rise between 2.5 and 4 degrees by 2100. UN Secretary-General António Guterres called the findings "a code red for humanity." The report was unanimously approved by 195 member governments before publication.
```

**Example 3 — Misleading** (label the button "Try: Misleading"):
```
ECONOMY IN FREEFALL: Unemployment hits record levels as Biden economy crumbles. New government data released Thursday shows unemployment claims rose by 12,000 last week to 215,000, the highest single-week jump in 18 months. Working families are being crushed under the weight of failed economic policies as experts warn of an imminent recession. The American dream is dying. Millions are being left behind while politicians in Washington ignore the crisis unfolding on Main Street.
```

**Example 4 — Short Claim** (label the button "Try: Claim"):
```
5G towers cause cancer and governments worldwide are covering it up
```

## Section 7 — Complete JavaScript Fetch Example
Your `api.js` could literally replicate the following pattern:

```javascript
const API_BASE_URL = "http://localhost:8000";

/**
 * Sends content for analysis and returns the full result object.
 * @param {string} input - Article text, URL, or short claim
 * @returns {Promise<Object>} The analysis result matching AnalysisResult schema
 * @throws {Error} With user-friendly message on failure
 */
async function analyzeContent(input) {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input.trim() })
    });

    const data = await response.json();

    if (response.status === 400) {
        throw new Error(data.detail || "Invalid input. Please check your text and try again.");
    }
    if (response.status === 503) {
        throw new Error("Analysis service is temporarily unavailable. Please try again in a moment.");
    }
    if (!response.ok) {
        throw new Error(`Unexpected error (HTTP ${response.status}). Please try again.`);
    }

    return data;
}

/**
 * Checks whether the backend is online and reachable.
 * @returns {Promise<boolean>} true if backend is up, false otherwise
 */
async function checkBackendHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/health`, { timeout: 5000 });
        return response.ok;
    } catch {
        return false;
    }
}

/**
 * Retrieves the last 20 analyses from server memory.
 * @returns {Promise<Array>} Array of AnalysisResult objects, newest first
 */
async function getHistory() {
    const response = await fetch(`${API_BASE_URL}/api/history`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.analyses || [];
}
```

## Section 8 — Error Handling Reference
| Scenario | HTTP Status | `error` field | Frontend action |
|---|---|---|---|
| Input under 10 chars | 400 | `"Invalid Input"` | Show inline error below textarea |
| Empty input | 400/422 | `"Invalid Input"` | Show inline error below textarea |
| Both AI providers down | 503 | `"Service Unavailable"` | Show card error: "Analysis temporarily unavailable. Please try again in a moment." |
| URL fetch failed | 503 | `"Service Unavailable"` | Show inline error: "Could not fetch this URL. Please paste the article text instead." |
| Network timeout (no response) | N/A | N/A | Catch `fetch` exception: "No connection. Check your internet and try again." |
| Server cold start delay | N/A | N/A | If request takes >3s, show "Still analyzing..." message to reassure user |

## Section 9 — Fields That May Be Empty or Null

| Field | Can be null? | Can be empty list? | Frontend behavior when empty/null |
|---|---|---|---|
| `domain_info` | Yes | N/A | Hide the Source Info card entirely |
| `article_metadata` | Yes | N/A | Hide the article info bar |
| `cited_sources` | No | Yes | Hide the Cited Sources panel |
| `corroboration_results` | No | Yes | Show: "No corroborating sources found for these claims." |
| `red_flags` | No | Yes | Show: "No red flags detected." in muted text |
| `credible_signals` | No | Yes | Show: "No credible signals detected." in muted text |
| `manipulation_tactics` | No | Yes | Show: "No manipulation tactics detected." in muted text |
| `key_claims` | No | Yes | Hide the key claims section |

## Section 10 — Performance Notes
* Expected response time for text input: 4–10 seconds. Show a loading state immediately on submit — do not wait for response before showing any UI change.
* Expected response time for URL input: 8–15 seconds. Show "Fetching article..." message for first 3 seconds, then switch to "Analyzing content..."
* The API has no streaming — the entire result arrives in one response. Build the UI to handle this (no incremental rendering needed).
* If a request takes over 25 seconds, it is likely stuck. Show a timeout message and allow the user to retry.
* The server may be asleep if inactive (Render free tier). The first request after idle may take 30–40 seconds for cold start. Show a persistent "Starting up..." message if health check takes more than 5 seconds.
