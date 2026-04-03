import os
import json
import re
from google import genai
from google.genai import types
from groq import Groq
from utils.logger import logger

SYSTEM_PROMPT = """You are TruthLens, an expert AI analyst specializing in misinformation detection, media literacy, and fact-checking. Your task is to analyze the provided content and return a structured credibility assessment.

You must respond ONLY with a valid JSON object. Do not include any text before or after the JSON. Do not include markdown code fences. Return raw JSON only.

Use the following exact JSON schema:
{
  "verdict": "<one of exactly: Likely Real | Likely Fake | Misleading | Mixed | Unverifiable>",
  "credibility_score": <integer from 0 to 100>,
  "confidence": "<one of exactly: High | Medium | Low>",
  "summary": "<2-3 sentences describing what this content claims, written neutrally>",
  "red_flags": ["<specific red flag>", ...],
  "credible_signals": ["<specific credible signal>", ...],
  "manipulation_tactics": ["<tactic name from approved list>", ...],
  "key_claims": ["<most important verifiable claim>", "<second claim>", "<third claim if present>"],
  "reasoning": "<3-5 sentences explaining your verdict with specific references to the content>",
  "advice": "<2-3 sentences of actionable advice for the reader>"
}

SCORING RUBRIC:
- 85-100: Highly credible. Multiple named sources, verifiable facts, neutral tone, known outlet.
- 65-84: Generally credible. Some sources cited, mostly factual, minor sensationalism.
- 45-64: Mixed. Contains real facts but also unsupported claims or misleading framing.
- 25-44: Questionable. Mostly unsupported, emotional, few or no credible sources.
- 0-24: Misinformation. False or fabricated claims, known disinformation patterns.

VERDICT RULES (score ranges are inclusive; primary verdicts are non-overlapping; Mixed and Unverifiable intentionally share range):
- "Likely Real": Score 70-100. Content appears factual and well-sourced.
- "Likely Fake": Score 0-30. Content appears fabricated or contains known false claims.
- "Misleading": Score 31-69. Facts may be technically real but framing significantly distorts their meaning.
- "Mixed": Score 45-75. Content contains clearly credible AND clearly questionable elements together; use only when both are present.
- "Unverifiable": Score 40-65. Cannot assess credibility from content alone - insufficient context, no sources, ambiguous claims.

Note: "Misleading" now runs 31-69, closing the previous gap between 60 and 70. "Mixed" and "Unverifiable" overlap in score range intentionally - choose the verdict based on the reason, not only the score. "Mixed" = conflicting quality elements present. "Unverifiable" = insufficient information to judge.

APPROVED MANIPULATION TACTICS (only use terms from this list):
Appeal to Fear | False Urgency | Cherry-Picking | Strawman | False Equivalence | Appeal to Authority | Bandwagon | Loaded Language | Conspiracy Framing | Anecdotal Evidence | Whataboutism | Ad Hominem | False Dichotomy | Slippery Slope

RED FLAG EXAMPLES (use specific language):
"No sources cited" | "Anonymous sources only" | "Emotional/sensational headline" | "Unverifiable statistics" | "Missing author" | "No publication date" | "Contradicts known facts" | "Implausible claim" | "Misleading headline vs content" | "Recently registered domain" | "Copied from satire site" | "No corroborating coverage"

CREDIBLE SIGNAL EXAMPLES:
"Named expert sources" | "Peer-reviewed study cited" | "Multiple perspectives shown" | "Neutral measured tone" | "Verifiable statistics with sources" | "Author identified" | "Published by known credible outlet" | "Consistent with mainstream reporting" | "Primary source linked" | "Transparent methodology"

Keep all list items concise (under 6 words each). Keep summary under 80 words. Keep reasoning specific to the actual content provided."""

def build_user_prompt(content: str, input_type: str, domain_info: str = "Unknown", domain_rating: str = "Unknown") -> str:
    return f"""Analyze the following content for credibility and misinformation:

[CONTENT TYPE: {input_type}]
[SOURCE DOMAIN: {domain_info}]
[DOMAIN CREDIBILITY RATING: {domain_rating}]

---
{content}
---

Return your analysis as a JSON object following the exact schema in your instructions."""

def build_headline_prompt(content: str) -> str:
    return f"""This is a short claim or headline, not a full article. Analyze it as a factual claim:
- Is this claim plausible based on known facts?
- Does it use sensational or misleading language?
- What would need to be true for this claim to be accurate?

[CLAIM: {content}]

Return your analysis as a JSON object following the exact schema in your instructions.
For the "summary" field, describe what the claim asserts.
For "key_claims", list the specific verifiable assertions within this claim."""

def parse_ai_response(raw_text: str) -> dict:
    cleaned_text = raw_text.strip()
    cleaned_text = re.sub(r'^```json\s*|^```\s*|```\s*$', '', cleaned_text, flags=re.MULTILINE).strip()
    
    parsed_dict = None
    try:
        parsed_dict = json.loads(cleaned_text)
    except Exception:
        json_match = re.search(r'\{.*\}', cleaned_text, re.DOTALL)
        if json_match:
            try:
                parsed_dict = json.loads(json_match.group(0))
            except Exception:
                pass
                
    if parsed_dict is None:
        raise ValueError(f"Could not parse AI response as JSON: {cleaned_text[:200]}")
        
    result = {
        "verdict": parsed_dict.get("verdict", "Unverifiable"),
        "credibility_score": parsed_dict.get("credibility_score", 50),
        "confidence": parsed_dict.get("confidence", "Low"),
        "summary": parsed_dict.get("summary", ""),
        "red_flags": parsed_dict.get("red_flags", []),
        "credible_signals": parsed_dict.get("credible_signals", []),
        "manipulation_tactics": parsed_dict.get("manipulation_tactics", []),
        "key_claims": parsed_dict.get("key_claims", []),
        "reasoning": parsed_dict.get("reasoning", ""),
        "advice": parsed_dict.get("advice", "")
    }
    
    for list_field in ["red_flags", "credible_signals", "manipulation_tactics", "key_claims"]:
        if not isinstance(result[list_field], list):
            result[list_field] = []
    
    for str_field in ["summary", "reasoning", "advice"]:
        if not isinstance(result[str_field], str):
            result[str_field] = str(result[str_field])
            
    try:
        score = int(result["credibility_score"])
        result["credibility_score"] = max(0, min(100, score))
    except (ValueError, TypeError):
        result["credibility_score"] = 50
        
    if result["verdict"] not in ["Likely Real", "Likely Fake", "Misleading", "Mixed", "Unverifiable"]:
        result["verdict"] = "Unverifiable"
        
    if result["confidence"] not in ["High", "Medium", "Low"]:
        result["confidence"] = "Low"
        
    return result

def analyze_with_gemini(user_prompt: str) -> dict:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not set")
        
    try:
        client = genai.Client(api_key=api_key)
        config = types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            response_mime_type="application/json",
            temperature=0.2,
            max_output_tokens=2048
        )
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=user_prompt,
            config=config
        )
        result = parse_ai_response(response.text)
        logger.info(f"Gemini analysis complete. Verdict: {result['verdict']}, Score: {result['credibility_score']}")
        return result
    except Exception as e:
        logger.error(f"Gemini analysis failed: {str(e)}")
        raise

def analyze_with_groq(user_prompt: str) -> dict:
    groq_api_key = os.environ.get("GROQ_API_KEY")
    if not groq_api_key:
        raise ValueError("GROQ_API_KEY not set")
        
    try:
        client = Groq(api_key=groq_api_key)
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt}
        ]
        response = client.chat.completions.create(
            model="llama-3.1-70b-versatile",
            messages=messages,
            temperature=0.2,
            max_tokens=2048
        )
        result = parse_ai_response(response.choices[0].message.content)
        logger.info(f"Groq analysis complete. Verdict: {result['verdict']}, Score: {result['credibility_score']}")
        return result
    except Exception as e:
        logger.error(f"Groq analysis failed: {str(e)}")
        raise

def analyze_content(content: str, input_type: str, domain_info: str = "Unknown", domain_rating: str = "Unknown") -> dict:
    user_prompt = build_headline_prompt(content) if input_type == "HEADLINE" else build_user_prompt(content, input_type, domain_info, domain_rating)
        
    try:
        return analyze_with_gemini(user_prompt)
    except Exception as e:
        logger.warning(f"Gemini failed, falling back to Groq: {str(e)}")
        try:
            return analyze_with_groq(user_prompt)
        except Exception as e2:
            logger.error(f"Both AI providers failed. Groq error: {str(e2)}")
            return {
               "verdict": "Unverifiable",
               "credibility_score": 0,
               "confidence": "Low",
               "summary": "Analysis could not be completed due to a service error.",
               "red_flags": [],
               "credible_signals": [],
               "manipulation_tactics": [],
               "key_claims": [],
               "reasoning": "Both AI analysis providers returned errors. This is a temporary service issue.",
               "advice": "Please try again in a few minutes."
           }
