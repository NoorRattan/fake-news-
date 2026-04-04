# TruthLens: Comprehensive Project Report

TruthLens is an advanced, AI-powered misinformation detection and fact-checking platform. It leverages state-of-the-art Large Language Models (LLMs) combined with real-time web search corroboration to evaluate the credibility of news articles, headlines, and social media claims.

---

## 1. System Architecture Overview

TruthLens operates on a fully decoupled **Client-Server Architecture**. 
- **The Client (Frontend)** is a high-performance Single Page Application (SPA) responsible for reactive user interactions, capturing multimodal inputs (text, URLs, headlines), and elegantly visualizing complex credibility data.
- **The Server (Backend)** is an asynchronous Application Programming Interface (API) responsible for web scraping, database cross-referencing, multi-LLM analysis orchestration, and live internet fact-checking.

---

## 2. Frontend Technology Stack & Deep Dive

The frontend abandons traditional static HTML, opting instead for a highly interactive, animated workspace designed to look highly professional and "editorial".

### Core Technologies
- **Framework**: **React 18** for component-based UI engineering.
- **Build Tool**: **Vite**, replacing Webpack for ultra-fast Hot Module Replacement (HMR) and optimized production bundles.
- **Routing**: `react-router-dom` for handling virtual pages (`/`, `/about`, `/history`) without reloading the DOM.

### Styling & Animation Capabilities
- **Tailwind CSS & Vanilla CSS**: Tailwind handles functional layout grids and responsive breaks. Vanilla CSS in `index.css` drives bespoke UI systems specific to TruthLens, such as "dark-glassmorphism", custom scrollbars, and specific typographic formatting (`Bebas Neue` & `DM Mono`).
- **Framer Motion (`framer-motion`)**: Drives complex PageTransitions, smooth unmounting (`AnimatePresence`), and interactive micro-animations (like button snapping on the Analyze interface).
- **Three.js (`@react-three/fiber` & `@react-three/drei`)**: Employs WebGL Canvas technology to render interactive 3D elements (such as `LoadingOrb.jsx`) in the browser to maintain user engagement during long asynchronous API wait times.

### Key Components mapped in `src/`
- **`Layout / Navbar`**: A persistent responsive shell. Houses dynamic Navigation Links (Home, About, History) that transition to a sliding drawer on mobile environments.
- **`HomePage` (`InputForm` -> `LoadingView` -> `ResultsView`)**: A complex state machine holding the application logic. 
  - Uses specific frosted-glass styling classes (e.g. `backdropFilter: blur(12px)`) on input overlays.
  - Dynamically switches user views based on the execution phase of the AI Backend pipeline.
- **Context API (`AnalysisContext`)**: Serves as the global state, allowing users to hold onto prior analysis histories during their active session without needing to hit the API again.

---

## 3. Backend Technology Stack & Deep Dive

The backend is built around Python and is strictly asynchronous to ensure it does not bottleneck during heavy LLM generation or search phases.

### Core Technologies
- **Framework**: **FastAPI** provides native asynchronous routing, OpenAPI schema auto-generation, and ultra-fast Python execution.
- **Server**: **Uvicorn** acts as the ASGI server.
- **Data Typing**: **Pydantic v2** guarantees strict enforcement of JSON payload structures requested by or returned to the Frontend.

### The AI & Corroboration Pipeline (`pipeline/orchestrator.py`)
Triggering the `/api/analyze` POST endpoint kicks off a highly sophisticated 7-step fault-tolerant pipeline:

1. **Input Handler (`input_handler.py`)**: Uses REGEX and content heuristics to classify if the string is a URL, a short Headline, or a raw Article body.
2. **Text Extractor (`content_extractor.py`)**: If the input is a URL, the tool `trafilatura` extracts the core journalistic text natively from the DOM, stripping away advertisements, navigation, and irrelevant scripts to save AI tokens.
3. **Source Checker (`source_checker.py`)**: Checks the extracted source domain against an internal `FAKE_DOMAINS` array and `CREDIBILITY_DB`. Matches directly influence the AI's final score ceiling.
4. **Primary AI Analysis (`ai_analyzer.py` via Gemini)**: 
   - A highly fortified `SYSTEM_PROMPT` enforces a rigid 0-100 credibility scoring rubric.
   - It demands the LLM map to exact manipulation tactics ("Strawman", "Appeal to Fear") and extract the core factual claims.
5. **Secondary AI Fallback (Groq / Llama 3)**: If Gemini is unavailable or rate-limited, the pipeline instantly degrades gracefully to Groq inference via `requests.post`, saving the user from a failed request.
6. **Live Web Corroboration (`web_searcher.py`)**: Isolates the "Key Claims" the AI found in Step 4. Runs concurrent **Serper.dev** API web searches to find actual live context from the current internet proving or debunking the text. If Serper fails, it falls back to a DuckDuckGo browser scraper algorithm.
7. **Assembly and Cache**: Maps AI insights and Corroboration search arrays into a unified `AnalysisResult` JSON format and caches it via `utils/cache.py` before returning it to the React layer.

---

## 4. API Endpoints

The communication layer is simplified strictly to three core endpoints:
- `POST /api/analyze` 
  - **Payload**: `{"input": "text_or_url_here"}`
  - **Returns**: Massive `AnalysisResult` schema containing `verdict`, `score`, `red_flags`, `tactics`, and `corroborations`.
- `GET /api/health`
  - Used by the React client (`HealthCheck.jsx`) to confirm Uvicorn is active. Returns `uptime_seconds`.
- `GET /api/history`
  - Dumps the backend memory cache mappings of previous analyses.

---

## 5. Environment Rules & Security

- **`.env` Architecture**: Strict requirement of three core external keys.
  - `GEMINI_API_KEY`: Google Gemini primary analysis provider.
  - `GROQ_API_KEY`: Fallback super-fast Llama 3 inference.
  - `SERPER_API_KEY`: Real-time Search Engine Results Page (SERP) API.
- **CORS Mitigation**: `main.py` uses `CORSMiddleware`, currently allowing local development configurations, but is tied to an `ALLOWED_ORIGINS` environment variable for production lockdown.
- **Server Safeties**: `main.py` utilizes a startup `<lifespan>` context manager to verify if keys exist on boot, alerting the developer gracefully rather than crashing asynchronously at runtime. 

## 6. Actionable Status
Currently, both the Frontend Vite Dev Server (`localhost:5173`) and the Backend Uvicorn Development Server (`localhost:8000`) are active and capable of processing full analytical loads natively.
