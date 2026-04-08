import time
import uuid
import asyncio
from datetime import datetime, timezone
from utils.logger import logger
from utils.cache import cache
from pipeline.input_handler import classify_input
from pipeline.content_extractor import extract_from_url
from pipeline.ai_analyzer import analyze_content
from pipeline.image_analyzer import analyze_article_images
from pipeline.web_searcher import search_claims
from pipeline.source_checker import check_source_credibility, CREDIBILITY_DB, FAKE_DOMAINS

def pre_analyze(content: str, domain: str) -> dict:
    domain_flag = "UNKNOWN"
    domain_rating_str = "Unknown"
    domain_info_dict = None
    
    if domain:
        clean_domain = domain.lower().strip()
        if clean_domain in FAKE_DOMAINS:
            domain_flag = "KNOWN_FAKE"
            domain_rating_str = "Known Misinformation"
            domain_info_dict = {"domain": domain, "rating": domain_rating_str, "bias": "Unknown"}
        elif clean_domain in CREDIBILITY_DB:
            domain_flag = "RELIABLE"
            entry = CREDIBILITY_DB[clean_domain]
            domain_rating_str = entry.get("rating", "Unknown")
            domain_info_dict = {"domain": domain, "rating": domain_rating_str, "bias": entry.get("bias", "Unknown")}
    
    word_count = len(content.split())
    truncated = False
    truncated_content = content
    
    if word_count > 8000:
        truncated_content = " ".join(content.split()[:4000])
        truncated = True
        logger.warning(f"Article truncated from {word_count} words to 4000 words")
        
    return {
        "domain_flag": domain_flag,
        "domain_rating": domain_rating_str,
        "domain_info": domain_info_dict,
        "truncated": truncated,
        "content": truncated_content
    }

def _build_error_result(analysis_id: str, input_type: str, start_time: float, error_message: str) -> dict:
    return {
        "analysis_id": analysis_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "input_type": input_type,
        "processing_time_ms": int((time.time() - start_time) * 1000),
        "verdict": "Unverifiable",
        "credibility_score": 0,
        "confidence": "Low",
        "summary": "Analysis could not be completed.",
        "red_flags": [],
        "credible_signals": [],
        "manipulation_tactics": [],
        "key_claims": [],
        "reasoning": f"Pipeline error: {error_message}",
        "advice": "Please try again. If the problem persists, try pasting the article text directly instead of using a URL.",
        "domain_info": None,
        "cited_sources": [],
        "corroboration_results": [],
        "article_metadata": None,
        "image_analysis": [],
    }

async def run_pipeline(raw_input: str) -> dict:
    analysis_id = str(uuid.uuid4())
    start_time = time.time()
    
    pipeline_state = {
        "step_1_input":      {"success": False, "data": None, "error": None},
        "step_2_extract":    {"success": False, "data": None, "error": None},
        "step_3_preanalysis":{"success": False, "data": None, "error": None},
        "step_4_ai":         {"success": False, "data": None, "error": None},
        "step_5_search":     {"success": False, "data": None, "error": None},
        "step_6_sources":    {"success": False, "data": None, "error": None},
    }
    
    # Step 1 — Input Classification:
    try:
        input_result = classify_input(raw_input)
        pipeline_state["step_1_input"] = {"success": True, "data": input_result, "error": None}
    except ValueError as e:
        raise  # Let the router return HTTP 400
    except Exception as e:
        pipeline_state["step_1_input"] = {"success": False, "data": None, "error": str(e)}
        input_result = {"type": "ARTICLE_TEXT", "content": raw_input.strip(), "truncated": False}
        
    # Step 2 — Content Extraction (URL only):
    article_metadata = None
    domain = ""
    extracted_text = input_result["content"]
    images_to_analyze = []
    image_analysis_results = []
    
    if input_result["type"] == "URL":
        try:
            loop = asyncio.get_event_loop()
            extract_result = await loop.run_in_executor(None, extract_from_url, input_result["content"])
            pipeline_state["step_2_extract"] = {"success": True, "data": extract_result, "error": None}
            extracted_text = extract_result["text"]
            domain = extract_result.get("domain", "")
            images_to_analyze = extract_result.get("images", [])
            article_metadata = {
                "title": extract_result.get("title", ""),
                "date": extract_result.get("date", ""),
                "domain": extract_result.get("domain", "")
            }
        except Exception as e:
            pipeline_state["step_2_extract"] = {"success": False, "data": None, "error": str(e)}
            return _build_error_result(analysis_id, input_result["type"], start_time, str(e))
    else:
        pipeline_state["step_2_extract"] = {"success": True, "data": None, "error": None}
        
    # Step 3 — Pre-Analysis:
    try:
        pre_result = pre_analyze(extracted_text, domain)
        pipeline_state["step_3_preanalysis"] = {"success": True, "data": pre_result, "error": None}
        content_for_ai = pre_result["content"]
        domain_info_str = domain if domain else "Unknown"
        domain_rating_str = pre_result.get("domain_rating", "Unknown")
    except Exception as e:
        pipeline_state["step_3_preanalysis"] = {"success": False, "data": None, "error": str(e)}
        content_for_ai = extracted_text
        domain_info_str = "Unknown"
        domain_rating_str = "Unknown"
        pre_result = {"domain_flag": "UNKNOWN", "domain_rating": "Unknown", "domain_info": None, "truncated": False, "content": extracted_text}
        
    # Step 4 — AI Analysis:
    try:
        loop = asyncio.get_event_loop()
        ai_result = await loop.run_in_executor(
            None, analyze_content, content_for_ai, input_result["type"], domain_info_str, domain_rating_str
        )
        pipeline_state["step_4_ai"] = {"success": True, "data": ai_result, "error": None}
        
        if pre_result.get("domain_flag") == "KNOWN_FAKE":
            original_score = ai_result.get("credibility_score", 50)
            ai_result["credibility_score"] = min(original_score, 20)
            if ai_result["credibility_score"] <= 30:
                ai_result["verdict"] = "Likely Fake"
            logger.info(f"Known fake domain score override applied: {original_score} → {ai_result['credibility_score']}")
    except Exception as e:
        pipeline_state["step_4_ai"] = {"success": False, "data": None, "error": str(e)}
        logger.error(f"Step 4 AI analysis failed completely: {e}")
        return _build_error_result(analysis_id, input_result.get("type", "ARTICLE_TEXT"), start_time, f"AI analysis failed: {str(e)}")
        
    # Steps 5 & 6 — Run Concurrently:
    if input_result.get("type") == "URL" and images_to_analyze:
        try:
            image_analysis_results = await analyze_article_images(images_to_analyze)
        except Exception as e:
            image_analysis_results = []
            logger.warning(f"Image analysis failed: {e}")

    key_claims = ai_result.get("key_claims", [])
    
    try:
        search_task = search_claims(key_claims)
        loop = asyncio.get_event_loop()
        source_task = loop.run_in_executor(None, check_source_credibility, content_for_ai, domain)
        
        search_result, source_result = await asyncio.gather(
            search_task, 
            asyncio.wrap_future(source_task) if not asyncio.iscoroutine(source_task) else source_task,
            return_exceptions=True
        )
    except Exception as e:
        search_result = {"corroboration_results": []}
        source_result = {"cited_sources": []}
        logger.warning(f"Steps 5/6 failed: {e}")
        
    if isinstance(search_result, Exception):
        pipeline_state["step_5_search"] = {"success": False, "data": None, "error": str(search_result)}
        search_result = {"corroboration_results": []}
    else:
        pipeline_state["step_5_search"] = {"success": True, "data": search_result, "error": None}
        
    if isinstance(source_result, Exception):
        pipeline_state["step_6_sources"] = {"success": False, "data": None, "error": str(source_result)}
        source_result = {"cited_sources": []}
    else:
        pipeline_state["step_6_sources"] = {"success": True, "data": source_result, "error": None}
        
    # Step 7 — Assemble Final Result:
    processing_time_ms = int((time.time() - start_time) * 1000)
    
    result = {
        "analysis_id": analysis_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "input_type": input_result.get("type", "ARTICLE_TEXT"),
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
        "domain_info": pre_result.get("domain_info"),
        "cited_sources": source_result.get("cited_sources", []),
        "corroboration_results": search_result.get("corroboration_results", []),
        "article_metadata": article_metadata,
        "image_analysis": image_analysis_results,
    }
    
    logger.info(
        f"Pipeline complete | id={analysis_id} | verdict={result['verdict']} | "
        f"score={result['credibility_score']} | time={processing_time_ms}ms | "
        f"steps={sum(1 for s in pipeline_state.values() if s['success'])}/6 succeeded"
    )
    
    cache.store(result)
    return result
