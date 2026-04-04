import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.analyze import router as analyze_router
from utils.logger import logger

load_dotenv()

REQUIRED_API_KEYS = {
    "GROQ_API_KEY": "Groq/Llama AI (primary analysis)",
    "COHERE_API_KEY": "Cohere Command R AI (fallback analysis)",
    "SERPER_API_KEY": "Serper web search (corroboration)",
}


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("=" * 50)
    logger.info("TruthLens API starting up...")
    logger.info("=" * 50)

    all_keys_present = True
    for key, description in REQUIRED_API_KEYS.items():
        value = os.getenv(key)
        if value and len(value) > 5:
            logger.info(f"  [OK]      {key} - {description}")
        else:
            logger.warning(f"  [MISSING] {key} - {description}")
            all_keys_present = False

    if all_keys_present:
        logger.info("All API keys present. Full pipeline is active.")
    else:
        logger.warning("One or more API keys missing. Some features will be degraded.")

    logger.info("=" * 50)
    logger.info("API documentation available at: /docs")
    logger.info("=" * 50)

    yield

    logger.info("TruthLens API shutting down.")


app = FastAPI(
    title="TruthLens API",
    description="AI-powered fake news and misinformation detection",
    version="1.0.0",
    lifespan=lifespan,
)

allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "")
if allowed_origins_str:
    allowed_origins = [origin.strip() for origin in allowed_origins_str.split(",")]
else:
    allowed_origins = ["*"]

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
