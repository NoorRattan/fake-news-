import re
import json
import os
from urllib.parse import urlparse
from utils.logger import logger

_DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")

def _load_credibility_db() -> dict:
    path = os.path.join(_DATA_DIR, "credibility_db.json")
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        logger.warning(f"Could not load credibility_db.json: {e}")
        return {}

def _load_fake_domains() -> set:
    path = os.path.join(_DATA_DIR, "fake_domains.txt")
    try:
        with open(path, "r", encoding="utf-8") as f:
            return {line.strip().lower() for line in f if line.strip()}
    except Exception as e:
        logger.warning(f"Could not load fake_domains.txt: {e}")
        return set()

CREDIBILITY_DB: dict = _load_credibility_db()
FAKE_DOMAINS: set = _load_fake_domains()

def extract_urls_from_text(text: str) -> list[str]:
    return re.findall(r'https?://[^\s<>"{}|\\^`\[\]]+', text)

def lookup_domain(domain: str) -> dict:
    clean_domain = domain.lower().strip()
    if clean_domain in FAKE_DOMAINS:
        return {"domain": domain, "rating": "Known Misinformation", "bias": "Unknown"}
    
    if clean_domain in CREDIBILITY_DB:
        db_entry = CREDIBILITY_DB[clean_domain]
        return {"domain": domain, "rating": db_entry.get("rating", "Unknown"), "bias": db_entry.get("bias", "Unknown")}
        
    return {"domain": domain, "rating": "Unknown", "bias": "Unknown"}

def check_source_credibility(text: str, primary_domain: str = "") -> dict:
    domains_to_check = set()
    
    if primary_domain:
        domains_to_check.add(primary_domain)
        
    extracted_urls = extract_urls_from_text(text)
    for url in extracted_urls:
        try:
            parsed = urlparse(url)
            domain = parsed.netloc
            if domain.startswith("www."):
                domain = domain[4:]
            if domain:
                domains_to_check.add(domain)
        except Exception:
            pass
            
    cited_sources = []
    for domain in domains_to_check:
        result = lookup_domain(domain)
        if result["rating"] != "Unknown":
            cited_sources.append(result)
            
    logger.info(f"Source check complete. {len(cited_sources)} known sources found")
    return {"cited_sources": cited_sources}
