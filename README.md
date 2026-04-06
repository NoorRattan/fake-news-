# Fake-news-Detector (TruthLens)

TruthLens is an AI-powered fake news and misinformation detection platform. It uses advanced language models to analyze news articles, headlines, and URLs to provide a credibility score and detailed reasoning.

## Project Structure

This repository is organized into the following components:

- **[truthlens/backend](truthlens/backend)**: A FastAPI-based backend that handles the analysis pipeline, integrating with Google Gemini AI for advanced misinformation detection.
- **[truthlens/frontend](truthlens/frontend)**: A modern React 18 frontend built with Vite, featuring an editorial-style UI with Three.js visualizations and Framer Motion animations.

## Getting Started

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd truthlens/backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up your `.env` file with the required API keys (GitHub/Gemini).
4. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd truthlens/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env.local` to point to the backend API.
4. Run the development server:
   ```bash
   npm run dev
   ```

## Live Deployment
- **Frontend**: [https://truthlens-omega.vercel.app](https://truthlens-omega.vercel.app)
- **Backend API**: [https://truthlens-api-4vou.onrender.com](https://truthlens-api-4vou.onrender.com)

## Repository
- **Current Home**: [https://github.com/calmcode47/Fake-news-Detector.git](https://github.com/calmcode47/Fake-news-Detector.git)
