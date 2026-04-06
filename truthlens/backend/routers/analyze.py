import time
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse

from models.request_models import AnalyzeRequest
from models.response_models import AnalysisResult, ErrorResponse
from pipeline.orchestrator import run_pipeline
from utils.logger import logger
from utils.cache import cache

router = APIRouter()
app_start_time = time.time()


@router.post("/analyze", response_model=AnalysisResult, responses={400: {"model": ErrorResponse}, 503: {"model": ErrorResponse}})
async def analyze_endpoint(request: AnalyzeRequest):
    try:
        result = await run_pipeline(request.input)
        logger.info(
            f"Analysis complete | verdict={result.get('verdict')} | "
            f"score={result.get('credibility_score')} | "
            f"type={result.get('input_type')} | "
            f"time={result.get('processing_time_ms')}ms"
        )
        return result
    except ValueError as ve:
        err = ErrorResponse(error="Invalid Input", detail=str(ve), analysis_id="")
        return JSONResponse(status_code=400, content=err.model_dump())
    except Exception as e:
        logger.error(f"Analysis failed: {str(e)}")
        err = ErrorResponse(error="Service Unavailable", detail=str(e), analysis_id="")
        return JSONResponse(status_code=503, content=err.model_dump())


@router.get("/health")
def health_endpoint():
    uptime = int(time.time() - app_start_time)
    return {"status": "ok", "version": "1.0.0", "uptime_seconds": uptime}


@router.get("/history")
def history_endpoint():
    return {"analyses": cache.get_all()}


@router.delete("/history")
def clear_history_endpoint():
    cache.clear()
    logger.info("History cache cleared.")
    return {"status": "ok"}
