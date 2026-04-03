import time
import uuid
from datetime import datetime, timezone
from utils.cache import cache
from utils.logger import logger

def handle_input(raw_input: str) -> dict:
    return {"type": "ARTICLE_TEXT", "content": raw_input}

def extract_content(url: str) -> dict:
    return {"text": "", "title": "", "domain": "", "date": ""}

def pre_analyze(content: str, domain: str) -> dict:
    return {"domain_flag": "UNKNOWN", "domain_rating": "Unknown", "truncated": False}

def run_ai_analysis(content: str, input_type: str, domain_info: dict) -> dict:
    return {
        "verdict": "Likely Fake",
        "credibility_score": 12,
        "confidence": "High",
        "summary": "This is a mock analysis result. The real AI analysis will replace this once the pipeline is connected. This placeholder confirms the API is working correctly.",
        "red_flags": ["No sources cited", "Emotional/sensational headline", "Unverifiable statistics"],
        "credible_signals": [],
        "manipulation_tactics": ["Appeal to Fear", "False Urgency"],
        "key_claims": ["Mock claim one for testing", "Mock claim two for testing"],
        "reasoning": "This is a placeholder reasoning block. It confirms the pipeline skeleton is wired correctly and the API endpoint is returning the full schema. Replace with real AI analysis in Phase 1B.",
        "advice": "This is a mock result for development purposes. Do not use this output for real fact-checking until the AI pipeline is connected."
    }

def run_web_search(key_claims: list) -> dict:
    return {"corroboration_results": []}

def check_sources(content: str) -> dict:
    return {"cited_sources": []}

async def run_pipeline(raw_input: str) -> dict:
    start_time = time.time()
    analysis_id = str(uuid.uuid4())
    
    pipeline_state = {
        "handle_input": {"success": True, "data": None, "error": None},
        "extract_content": {"success": True, "data": None, "error": None},
        "pre_analyze": {"success": True, "data": None, "error": None},
        "run_ai_analysis": {"success": True, "data": None, "error": None},
        "run_web_search": {"success": True, "data": None, "error": None},
        "check_sources": {"success": True, "data": None, "error": None},
    }

    input_type = "ARTICLE_TEXT"
    content = raw_input
    domain_info = {}
    
    try:
        data = handle_input(raw_input)
        pipeline_state["handle_input"] = {"success": True, "data": data, "error": None}
        input_type = data.get("type", "ARTICLE_TEXT")
        content = data.get("content", raw_input)
    except Exception as e:
        pipeline_state["handle_input"] = {"success": False, "data": None, "error": str(e)}

    try:
        data = extract_content(content)
        pipeline_state["extract_content"] = {"success": True, "data": data, "error": None}
    except Exception as e:
        pipeline_state["extract_content"] = {"success": False, "data": None, "error": str(e)}

    try:
        data = pre_analyze(content, "")
        pipeline_state["pre_analyze"] = {"success": True, "data": data, "error": None}
    except Exception as e:
        pipeline_state["pre_analyze"] = {"success": False, "data": None, "error": str(e)}

    ai_result = {}
    try:
        ai_result = run_ai_analysis(content, input_type, domain_info)
        pipeline_state["run_ai_analysis"] = {"success": True, "data": ai_result, "error": None}
        if not ai_result:
            raise ValueError("AI analysis returned no data")
    except Exception as e:
        pipeline_state["run_ai_analysis"] = {"success": False, "data": None, "error": str(e)}
        return {
            "analysis_id": analysis_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "input_type": input_type,
            "processing_time_ms": int((time.time() - start_time) * 1000),
            "verdict": "Unverifiable",
            "credibility_score": 0,
            "confidence": "Low",
            "summary": "Analysis failed",
            "red_flags": [],
            "credible_signals": [],
            "manipulation_tactics": [],
            "key_claims": [],
            "reasoning": f"AI step failed: {str(e)}",
            "advice": "Please try again later.",
            "domain_info": None,
            "cited_sources": [],
            "corroboration_results": [],
            "article_metadata": None,
        }

    try:
        data = run_web_search(ai_result.get("key_claims", []))
        pipeline_state["run_web_search"] = {"success": True, "data": data, "error": None}
    except Exception as e:
        pipeline_state["run_web_search"] = {"success": False, "data": None, "error": str(e)}

    try:
        data = check_sources(content)
        pipeline_state["check_sources"] = {"success": True, "data": data, "error": None}
    except Exception as e:
        pipeline_state["check_sources"] = {"success": False, "data": None, "error": str(e)}

    processing_time_ms = int((time.time() - start_time) * 1000)
    
    result = {
        "analysis_id": analysis_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "input_type": input_type,
        "processing_time_ms": processing_time_ms,
        "verdict": ai_result.get("verdict", "Unverifiable"),
        "credibility_score": ai_result.get("credibility_score", 0),
        "confidence": ai_result.get("confidence", "Low"),
        "summary": ai_result.get("summary", ""),
        "red_flags": ai_result.get("red_flags", []),
        "credible_signals": ai_result.get("credible_signals", []),
        "manipulation_tactics": ai_result.get("manipulation_tactics", []),
        "key_claims": ai_result.get("key_claims", []),
        "reasoning": ai_result.get("reasoning", ""),
        "advice": ai_result.get("advice", ""),
        "domain_info": None,
        "cited_sources": [],
        "corroboration_results": [],
        "article_metadata": None,
    }
    
    cache.store(result)
    return result
