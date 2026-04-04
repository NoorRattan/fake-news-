# TruthLens: Project Report

## 1. Project Overview
**TruthLens** is an advanced, AI-powered misinformation detection and fact-checking platform. It leverages state-of-the-art Large Language Models (LLMs) combined with real-time web search corroboration to evaluate the credibility of news articles, headlines, and social media claims.

---

## 2. Technical Stack

### **Backend (Core Logic & API)**
The backend is built with **Python**, functioning as a high-performance asynchronous pipeline.
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Asynchronous REST API)
- **Server**: [Uvicorn](https://www.uvicorn.org/) (ASGI server)
- **AI Integration**: 
    - **Primary**: Google Gemini 1.5 Pro (via `google-genai`)
    - **Secondary/Fallback**: Groq (Llama 3) for high-speed inference
- **Search & Verification**:
    - **Serper.dev**: Google Search API for real-time fact-checking
- **Web Content Extraction**:
    - `trafilatura`: For robust and clean article extraction from URLs
- **Data Validation**: `Pydantic v2` for strict request/response schema modeling

### **Frontend (User Interface)**
A sleek, modern, and responsive interactive web application built with a modern component-based architecture.
- **Framework**: **React 18** and **Vite** (replaces the previously stated Vanilla JS architecture)
- **Routing**: `react-router-dom`
- **Styling**: 
    - **Tailwind CSS** combined with custom definitions for glassmorphism aesthetics.
- **3D & Visualizations**: 
    - Fully dynamic, utilizing **Three.js** via `@react-three/drei` and `@react-three/fiber` for immersive 3D backgrounds and elements.
    - **Framer Motion** (`framer-motion`) handles seamless micro-animations and page transitions.
- **State Management**: React Context APIs and hooks.

---

## 3. System Architecture
The application follows a decoupled client-server architecture:

1.  **Request Layer**: The React frontend captures user input (Text, Headline, or URL) and transmits it via an API `POST` request to the backend `/api/analyze` endpoint.
2.  **Scraping Engine**: If a URL is provided, the backend utilizes `trafilatura` to safely extract text.
3.  **Corroboration Pipeline**: 
    - The backend performs parallel searches via Serper to find supporting or contradicting evidence.
4.  **AI Intelligence Layer**:
    - Content is sent to the LLM (Gemini or Groq) to be analyzed for cognitive biases, manipulation tactics, and compared against live search results.
5.  **Scoring & Enrichment**: 
    - System calculates a Credibility Score and cross-references domains.
6.  **Response Layer**: JSON payload is pushed back to the frontend where the React components immediately visualize the verdict with animated charts and breakdowns.

---

## 4. Current Progress & Implementation Status

### **Backend Implementation**
- [x] **Unified API**: Solid structural endpoints with modular routing (`routers/analyze.py`).
- [x] **Resilient AI Pipeline**: Functional fallback mechanism handling Gemini defaults.
- [x] **Smart Scraping**: `trafilatura` correctly handles URL extraction.
- [x] **Initialization Safety**: Automatically verifies presence of API keys (`main.py`).

### **Frontend Implementation**
- [x] **Modern Tooling Upgrade**: Upgraded to a Vite + React workflow.
- [x] **Dependency Issues Resolved**: Handled Vite version mismatch constraints successfully.
- [x] **UI Elements**: Component suite including specialized rendering blocks (`HealthCheck.jsx`, `HistoryCard.jsx`, `CustomCursor.jsx`).
- [x] **Animation Loop**: 3D and Framer Motion integration functional.

---

## 5. Deployment & DevOps
- **Deployment Strategy**: Includes configurations (`render.yaml`, `Procfile`) for automated deployment workflows on services like Render.
- **Environment Management**: Robust key management, `.env` file templates are well defined.

---

## 6. Actionable Next Steps
- **Start Services**: Ensure both the Vite frontend server (`npm run dev`) and Uvicorn backend server (`uvicorn main:app --reload`) are running concurrently.
- **Configure Env Variables**: Verify that `backend/.env` is fully populated with Gemini/Groq/Serper API keys before testing endpoints.
