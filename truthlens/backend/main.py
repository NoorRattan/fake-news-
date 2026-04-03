import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from utils.logger import logger
from routers.analyze import router as analyze_router
from contextlib import asynccontextmanager

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("TruthLens API started")
    yield

app = FastAPI(title="TruthLens API", version="1.0.0", lifespan=lifespan)

allowed_origins_str = os.getenv("ALLOWED_ORIGINS")
if allowed_origins_str:
    origins = allowed_origins_str.split(",")
else:
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "TruthLens API is running", "docs": "/docs"}
