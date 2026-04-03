# TruthLens

TruthLens is an AI-powered fake news and misinformation detector. It provides an API and interface to analyze text, headlines, and URLs to determine their credibility using a robust AI pipeline, web search corroboration, and known source databases.

## Setup

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd truthlens
   ```

2. **Create environment file:**
   Copy the example environment variables file and fill in your keys.
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your API keys
   ```

3. **Install dependencies:**
   It is recommended to use a virtual environment.
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. **Run the server:**
   ```bash
   uvicorn main:app --reload
   ```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/analyze` | Submit text to analyze (body: `{"input": "..."}`) |
| `GET`  | `/api/health` | Check API status and uptime |
| `GET`  | `/api/history` | Retrieve local cache of previous analyses |

## Environment Variables

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `GEMINI_API_KEY` | Google Gemini AI | [Google AI Studio](https://aistudio.google.com/) |
| `GROQ_API_KEY` | Groq AI Inference | [Groq Console](https://console.groq.com/) |
| `SERPER_API_KEY` | Google Search API | [Serper.dev](https://serper.dev/) |
| `ALLOWED_ORIGINS` | CORS origins | N/A (Comma separated list) |

## Deployment

The backend `Procfile` is pre-configured for a smooth deployment to platforms like Render.com. Ensure you set your environment variables correctly in the Render dashboard and reference `backend/` for the startup commands if your root director is `truthlens/`.
