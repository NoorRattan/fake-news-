# TruthLens: Project Report

## 1. Project Overview
**TruthLens** is an advanced, AI-powered misinformation detection and fact-checking platform. It leverages state-of-the-art Large Language Models (LLMs) combined with real-time web search corroboration to evaluate the credibility of news articles, headlines, and social media claims.

---

## 2. Technical Stack

### **Backend (Core Logic & API)**
The backend is built with **Python** using a high-performance asynchronous framework.
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Asynchronous REST API)
- **Server**: [Uvicorn](https://www.uvicorn.org/) (ASGI server)
- **AI Integration**: 
    - **Primary**: Google Gemini 1.5 Pro (via `google-genai`)
    - **Secondary/Fallback**: Groq (Llama 3 70B/8B) for high-speed inference
- **Search & Verification**:
    - **Serper.dev**: Google Search API for real-time fact-checking
    - **DuckDuckGo**: Fallback search provider
- **Web Content Extraction**:
    - `trafilatura`: For clean article extraction from URLs
    - `BeautifulSoup4` & `lxml`: For HTML parsing
- **Data Validation**: `Pydantic v2` for strict request/response schema modeling
- **Networking**: `httpx`, `aiohttp`, and `requests` for concurrent API calls

### **Frontend (User Interface)**
A sleek, modern, and responsive interface designed for high user engagement.
- **Architecture**: Vanilla HTML5, CSS3, and Modern JavaScript (ES6+)
- **Styling**: 
    - Custom CSS with **glassmorphism** and **claymorphism** aesthetics
    - Dynamic animations using CSS transitions and HTML5 Canvas
- **Visualizations**: 
    - `Chart.js`: For rendering credibility scores and bias distributions
- **State Management**: Frontend-driven session state for analysis history
- **Interactive Elements**:
    - `wavy-background.js`: Custom canvas-based ambient backgrounds
    - `renderer.js`: Dynamic DOM manipulation for real-time result updates

---

## 3. System Architecture
The application follows a decoupled client-server architecture:

1.  **Request Layer**: The frontend captures user input (Text, Headline, or URL) and transmits it via a `POST` request to the `/api/analyze` endpoint.
2.  **Scraping Engine**: If a URL is provided, the backend utilizes `trafilatura` to bypass ads/clutter and extract the core article text.
3.  **Corroboration Pipeline**: 
    - Extracts key claims from the content.
    - Performed parallel searches via Google/DuckDuckGo to find supporting or contradicting evidence.
4.  **AI Intelligence Layer**:
    - Content is analyzed for cognitive biases, logical fallacies, and manipulation tactics.
    - Compares claims against search results to determine a factual verdict.
5.  **Scoring & Enrichment**: 
    - Calculates a **Credibility Score (0-100)**.
    - Cross-references the domain against a database of known biased sources.
6.  **Response Layer**: Returns a comprehensive JSON payload containing the verdict, reasoning, red flags, and cited sources.

---

## 4. Current Progress (Completed Features)

### **Backend Milestone Completion**
- [x] **Unified API**: Single endpoint handles text, headlines, and URLs.
- [x] **Resilient AI Pipeline**: Implementation of primary (Gemini) and secondary (Groq) models with automatic failover.
- [x] **Smart Scraping**: Robust URL extraction that handles most news sites.
- [x] **Real-time Web Search**: Integration with Serper API for live fact-checking.
- [x] **Source Bias Database**: Integrated check for domain-level credibility ratings.
- [x] **Health Monitoring**: Dedicated uptime and status tracking.

### **Frontend Milestone Completion**
- [x] **Responsive Core Layout**: Optimized for both desktop and mobile devices.
- [x] **Dynamic Results Engine**: Real-time rendering of complex analysis objects without page reloads.
- [x] **Themed UI**: Dark-mode primary interface with glassmorphic cards.
- [x] **Credibility Meter**: Circular progress/gauge charts for visual score representation.
- [x] **Analysis History**: Session-persistent sidebar showing previous checks.
- [x] **Interactive Examples**: Pre-set "Try this" buttons for demonstration.

---

## 5. Deployment & DevOps
- **Deployment Strategy**: Ready for **Render.com** or **Heroku** (includes `Procfile` and `render.yaml`).
- **Environment Management**: Secure handling of API keys via `.env` configurations.
- **Testing**: Includes a comprehensive `smoke_test.py` for validating API integrity and pipeline performance.

---

## 6. Summary of Already Done Items
- **Infrastructure**: Full FastAPI project structure with modular routers and pipelines.
- **AI Core**: Prompt engineering for fake news detection is finalized.
- **UI/UX**: The entire dashboard UI is functional and integrated with the backend.
- **Search**: The fact-checking loop is fully operational.
