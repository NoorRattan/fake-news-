# TruthLens Frontend

React 18 + Vite + Three.js + Framer Motion + Tailwind CSS
Claymorphism design system. Zero mock data.

## Prerequisites
Node.js 18+ and npm

## Development Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env: set VITE_API_URL to your backend URL (or leave empty for Vite proxy)
npm run dev
```
The Vite dev server proxies /api/* to http://localhost:8000 automatically.

## Production Build
```bash
npm run build
# Output in /dist folder
```

## Deploy to Netlify
- Build command: npm run build
- Publish directory: dist
- Environment variable: VITE_API_URL=https://your-backend.onrender.com
- The public/_redirects file handles SPA routing automatically

## Deploy to Vercel
- Framework preset: Vite
- Environment variable: VITE_API_URL=https://your-backend.onrender.com
- vercel.json handles SPA routing automatically

## Pages
- / — Landing page with 3D hero globe
- /analyze — Main analysis tool (input → loading → results)
- /history — Session-based analysis history
- /about — Team, tech stack, pipeline explanation

## Environment Variables
| Variable | Description | Example |
|---|---|---|
| VITE_API_URL | Backend API base URL | https://app.onrender.com |
