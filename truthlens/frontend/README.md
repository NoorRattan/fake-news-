# TruthLens Frontend

React 18 + Vite + Three.js + Framer Motion + Tailwind CSS.
Editorial-style analysis UI backed by the TruthLens FastAPI service.

## Prerequisites
Node.js 18+ and npm

## Development Setup
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Set `frontend/.env.local` to:

```bash
VITE_API_URL=http://localhost:8000
```

If `VITE_API_URL` is omitted in development, the Vite dev server proxies `/api/*` to `http://localhost:8000`.

## Production Build
```bash
npm run build
```

The production bundle is written to `frontend/dist`.

## Production Connection
1. Deploy the backend first and copy its Render URL.
2. Set `VITE_API_URL=https://your-backend.onrender.com` in Netlify or Vercel.
3. Redeploy after saving the environment variable.
4. Add the deployed frontend URL to the backend `ALLOWED_ORIGINS` setting in Render, keeping both `http://localhost:5173` and `http://127.0.0.1:5173` for local Vite development.

## Deploy to Netlify
- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_URL=https://your-backend.onrender.com`
- Redeploy after changing environment variables
- `public/_redirects` handles SPA routing automatically

## Deploy to Vercel
- Framework preset: `Vite`
- Root directory: `frontend`
- Environment variable: `VITE_API_URL=https://your-backend.onrender.com`
- Redeploy after changing environment variables
- `vercel.json` handles SPA routing automatically

## Environment Variables
| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend API base URL used by the browser bundle | `https://truthlens-api.onrender.com` |

## Routes
- `/` - Analyzer home page
- `/about` - Product and pipeline overview
- `/history` - Session analysis history
