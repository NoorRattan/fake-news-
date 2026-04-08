import asyncio
import base64
import json
import os
import re

import httpx

from utils.logger import logger

IMAGE_ANALYSIS_PROMPT = """You are analyzing an image extracted from a news article for potential misinformation or manipulation.

Image alt text: "{alt_text}"

Analyze this image carefully and return ONLY a valid JSON object with this exact schema:
{{
  "image_type": "photo | chart | screenshot | infographic | meme | other",
  "contains_text": true or false,
  "manipulation_likelihood": "Low | Medium | High",
  "credibility_flags": ["specific concern 1", "specific concern 2"],
  "credible_signals": ["specific positive signal 1"],
  "summary": "1-2 sentence description of what this image shows and any credibility concerns"
}}

Look specifically for:
- AI-generated or digitally manipulated photos
- Screenshots of tweets, posts, or messages that may be fabricated or taken out of context
- Charts with misleading axes, truncated scales, or cherry-picked date ranges
- Images used out of geographic or temporal context
- Text overlaid on images making unverifiable claims
- Memes presenting opinion or satire as factual news

If no issues are detected, return empty arrays for credibility_flags and Low for manipulation_likelihood.
Return raw JSON only. No markdown fences. No explanation text before or after.
"""

SUPPORTED_MEDIA_TYPES = {
    "image/jpeg": "image/jpeg",
    "image/jpg": "image/jpeg",
    "image/png": "image/png",
    "image/webp": "image/webp",
}
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"


def _normalize_media_type(content_type: str) -> str | None:
    normalized_content_type = content_type.lower().split(";")[0].strip()
    return SUPPORTED_MEDIA_TYPES.get(normalized_content_type)


def _extract_response_text(response_payload) -> str:
    if isinstance(response_payload, dict):
        choices = response_payload.get("choices", [])
    else:
        choices = getattr(response_payload, "choices", None) or []

    if not choices:
        return ""

    first_choice = choices[0]
    if isinstance(first_choice, dict):
        message = first_choice.get("message", {})
        content = message.get("content", "")
    else:
        message = getattr(first_choice, "message", None)
        content = getattr(message, "content", "")

    if isinstance(content, str):
        return content.strip()

    if isinstance(content, list):
        text_chunks = []
        for block in content:
            if isinstance(block, dict):
                text_value = block.get("text")
            else:
                text_value = getattr(block, "text", None)

            if text_value:
                text_chunks.append(text_value)

        return "\n".join(text_chunks).strip()

    return str(content).strip() if content else ""


def _parse_image_analysis(raw_content: str) -> dict | None:
    cleaned_content = re.sub(
        r"^```(?:json)?\s*|\s*```$",
        "",
        raw_content.strip(),
        flags=re.IGNORECASE | re.MULTILINE,
    ).strip()

    try:
        parsed_content = json.loads(cleaned_content)
    except json.JSONDecodeError:
        json_match = re.search(r"\{.*\}", cleaned_content, re.DOTALL)
        if not json_match:
            return None

        try:
            parsed_content = json.loads(json_match.group(0))
        except json.JSONDecodeError:
            return None

    if not isinstance(parsed_content, dict):
        return None

    credibility_flags = parsed_content.get("credibility_flags", [])
    credible_signals = parsed_content.get("credible_signals", [])

    return {
        "image_type": parsed_content.get("image_type", "other"),
        "contains_text": bool(parsed_content.get("contains_text", False)),
        "manipulation_likelihood": parsed_content.get("manipulation_likelihood", "Low"),
        "credibility_flags": credibility_flags if isinstance(credibility_flags, list) else [],
        "credible_signals": credible_signals if isinstance(credible_signals, list) else [],
        "summary": str(parsed_content.get("summary", "")),
    }


async def _request_groq_analysis(base64_string: str, media_type: str, alt_text: str) -> str:
    headers = {
        "Authorization": f"Bearer {os.getenv('GROQ_API_KEY')}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "meta-llama/llama-4-scout-17b-16e-instruct",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:{media_type};base64,{base64_string}"},
                    },
                    {
                        "type": "text",
                        "text": IMAGE_ANALYSIS_PROMPT.format(alt_text=alt_text.replace("\n", " ").strip()),
                    },
                ],
            }
        ],
        "temperature": 0.1,
        "max_tokens": 500,
    }
    timeout = httpx.Timeout(20.0)

    async with httpx.AsyncClient(timeout=timeout) as client:
        response = await client.post(GROQ_API_URL, headers=headers, json=payload)

    response.raise_for_status()
    return _extract_response_text(response.json())


async def fetch_image_as_base64(url: str) -> tuple | None:
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        timeout = httpx.Timeout(8.0)

        async with httpx.AsyncClient(
            headers=headers,
            timeout=timeout,
            follow_redirects=True,
        ) as client:
            response = await client.get(url)

        if response.status_code != 200:
            return None

        media_type = _normalize_media_type(response.headers.get("content-type", ""))
        if media_type is None:
            return None

        if len(response.content) > 4 * 1024 * 1024:
            return None

        return (base64.b64encode(response.content).decode("utf-8"), media_type)
    except Exception as exc:
        logger.warning(f"Image fetch failed for {url}: {exc}")
        return None


async def analyze_single_image(image_url: str, alt_text: str = "") -> dict | None:
    try:
        image_payload = await fetch_image_as_base64(image_url)
        if image_payload is None:
            return None

        if not os.getenv("GROQ_API_KEY"):
            logger.warning("GROQ_API_KEY missing; skipping image analysis")
            return None

        base64_string, media_type = image_payload
        raw_response = await _request_groq_analysis(
            base64_string,
            media_type,
            alt_text,
        )

        parsed_response = _parse_image_analysis(raw_response)
        if parsed_response is None:
            logger.warning(f"Image analysis returned non-JSON content for {image_url}")
            return None

        parsed_response["image_url"] = image_url
        return parsed_response
    except Exception as exc:
        logger.warning(f"Image analysis failed for {image_url}: {exc}")
        return None


async def analyze_article_images(images: list) -> list:
    try:
        if not images:
            return []

        tasks = []
        for image in images[:3]:
            if not isinstance(image, dict):
                continue

            image_url = image.get("url", "")
            if not image_url:
                continue

            tasks.append(analyze_single_image(image_url, image.get("alt_text", "")))

        if not tasks:
            return []

        results = await asyncio.gather(*tasks, return_exceptions=True)
        return [result for result in results if isinstance(result, dict)]
    except Exception as exc:
        logger.warning(f"Article image analysis failed: {exc}")
        return []
