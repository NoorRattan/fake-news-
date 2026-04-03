import os
import asyncio
import httpx
from duckduckgo_search import DDGS
from utils.logger import logger

async def search_claim_serper(client: httpx.AsyncClient, claim: str, api_key: str) -> dict:
    try:
        response = await client.post(
            "https://google.serper.dev/search",
            headers={"X-API-KEY": api_key, "Content-Type": "application/json"},
            json={"q": claim, "num": 3}
        )
        response.raise_for_status()
        data = response.json()
        results = []
        for item in data.get("organic", [])[:3]:
            results.append({
                "title": item.get("title", ""),
                "url": item.get("link", ""),
                "snippet": item.get("snippet", "")
            })
        return {"claim": claim, "results": results}
    except Exception as e:
        logger.warning(f"Serper search failed for claim '{claim}': {e}")
        return {"claim": claim, "results": []}

def search_claim_ddg(claim: str) -> dict:
    try:
        results = []
        with DDGS() as ddgs:
             ddgs_results = ddgs.text(claim, max_results=3)
             for item in ddgs_results:
                 results.append({
                     "title": item.get("title", ""),
                     "url": item.get("href", ""),
                     "snippet": item.get("body", "")
                 })
        return {"claim": claim, "results": results}
    except Exception as e:
        logger.warning(f"DuckDuckGo search failed for claim '{claim}': {e}")
        return {"claim": claim, "results": []}

async def search_claims(key_claims: list) -> dict:
    claims_to_search = key_claims[:2]
    if not claims_to_search:
        return {"corroboration_results": []}
        
    serper_api_key = os.environ.get("SERPER_API_KEY", "")
    results = []
    
    if serper_api_key:
        async with httpx.AsyncClient(timeout=8.0) as client:
            tasks = [search_claim_serper(client, claim, serper_api_key) for claim in claims_to_search]
            raw_results = await asyncio.gather(*tasks, return_exceptions=True)
            for i, result in enumerate(raw_results):
                if isinstance(result, Exception):
                    results.append({"claim": claims_to_search[i], "results": []})
                else:
                    results.append(result)
    else:
        loop = asyncio.get_event_loop()
        tasks = [loop.run_in_executor(None, search_claim_ddg, claim) for claim in claims_to_search]
        raw_results = await asyncio.gather(*tasks, return_exceptions=True)
        for i, result in enumerate(raw_results):
            if isinstance(result, Exception):
                results.append({"claim": claims_to_search[i], "results": []})
            else:
                results.append(result)
                
    logger.info(f"Web search complete. {len(results)} claim(s) searched")
    return {"corroboration_results": results}
