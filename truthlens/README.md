# TruthLens

TruthLens is an AI-powered fake news and misinformation detector. It provides both a FastAPI backend and a React/Vite frontend for analyzing text, headlines, and URLs with AI scoring plus web-search corroboration.

## Backend Setup
1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd truthlens
   ```
2. Create the backend environment file:
   ```bash
   cp backend/.env.example backend/.env
   ```
3. Install backend dependencies:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
4. Run the API:
   ```bash
   uvicorn main:app --reload
   ```

## Frontend Setup
1. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Create the local frontend environment file:
   ```bash
   cp .env.example .env.local
   ```
3. Point the frontend at the local backend:
   ```bash
   VITE_API_URL=http://localhost:8000
   ```
4. Run the frontend:
   ```bash
   npm run dev
   ```

## API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/analyze` | Submit text to analyze with body `{"input": "..."}` |
| `GET`  | `/api/health` | Check API status and uptime |
| `GET`  | `/api/history` | Retrieve cached analyses |

## Environment Variables
| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `GEMINI_API_KEY` | Google Gemini API | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `GROQ_API_KEY` | Groq AI Inference | [Groq Console](https://console.groq.com/) |
| `SERPER_API_KEY` | Google Search API | [Serper.dev](https://serper.dev/) |
| `ALLOWED_ORIGINS` | Comma-separated frontend origins allowed by CORS | Your deployed frontend URL plus localhost entries |
| `VITE_API_URL` | Frontend API base URL | Your deployed Render backend URL |

## Deployment
The backend `Procfile` and `render.yaml` are pre-configured for Render. The frontend is set up for either Netlify or Vercel.

### Production Connection Checklist
1. Set `ALLOWED_ORIGINS` in Render to your deployed frontend URL plus local development origins, including both `http://localhost:5173` and `http://127.0.0.1:5173`.
2. Set `VITE_API_URL` in Netlify or Vercel to your deployed Render backend URL.
3. Redeploy the frontend after saving `VITE_API_URL`.
4. Verify `GET /api/health` and one `POST /api/analyze` request from the deployed frontend.
