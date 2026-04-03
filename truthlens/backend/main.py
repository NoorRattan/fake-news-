import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from utils.logger import logger
from routers.analyze import router as analyze_router

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── Startup ───────────────────────────────────────────────
    logger.info("=" * 50)
    logger.info("TruthLens API starting up...")
    logger.info("=" * 50)

    # Check required environment variables
    required_keys = {
        "GEMINI_API_KEY": "Google Gemini AI (primary analysis)",
        "GROQ_API_KEY": "Groq/Llama AI (fallback analysis)",
        "SERPER_API_KEY": "Serper web search (corroboration)",
    }

    all_keys_present = True
    for key, description in required_keys.items():
        value = os.getenv(key)
        if value and len(value) > 5:
            logger.info(f"  [OK]      {key} — {description}")
        else:
            logger.warning(f"  [MISSING] {key} — {description}")
            all_keys_present = False

    if all_keys_present:
        logger.info("All API keys present. Full pipeline is active.")
    else:
        logger.warning("One or more API keys missing. Some features will be degraded.")

    logger.info("=" * 50)
    logger.info("API documentation available at: /docs")
    logger.info("=" * 50)

    yield  # Server runs here

    # ── Shutdown ──────────────────────────────────────────────
    logger.info("TruthLens API shutting down.")


app = FastAPI(
    title="TruthLens API",
    description="AI-powered fake news and misinformation detection",
    version="1.0.0",
    lifespan=lifespan
)

allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "")
if allowed_origins_str:
    allowed_origins = [origin.strip() for origin in allowed_origins_str.split(",")]
else:
    allowed_origins = ["*"]  # Development fallback — allow all

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze_router, prefix="/api")


@app.get("/")
def read_root():
    return {"message": "TruthLens API is running", "docs": "/docs"}
