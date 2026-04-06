# TruthLens Frontend (Fake-news-Detector)

The modern, editorial-style analysis interface for the TruthLens misinformation detection platform. Built with a premium aesthetic focusing on clean typography, high contrast, and dynamic visualizations.

## Tech Stack
- **Framework**: React 18 + Vite
- **Visuals**: Three.js (Mini Globe, Floating Particles)
- **Animation**: Framer Motion
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Live Deployment
- **Frontend**: [https://truthlens-omega.vercel.app](https://truthlens-omega.vercel.app)
- **Backend API**: [https://truthlens-api-4vou.onrender.com](https://truthlens-api-4vou.onrender.com)

## Prerequisites
- Node.js 18+
- npm

## Development Setup
```bash
# From the project root
cd truthlens/frontend
npm install
cp .env.example .env.local
npm run dev
```

### Environment Configuration
Set `truthlens/frontend/.env.local` to point to your local or production backend:
```bash
VITE_API_URL=http://localhost:8000
```

## Features
- **Real-time Analysis**: Interactive submission with state-driven UI.
- **Visual Evidence**: Interactive globe and particle systems for analytical context.
- **Session History**: Persistent local or server-side analysis logs.
- **Editorial Design**: Zero border-radius, high-contrast dark mode for a premium feel.

## Deployment Guides
For detailed deployment instructions to Vercel or Netlify, please refer to the main [README.md](../../README.md) in the project root.
