import httpx
import trafilatura
from bs4 import BeautifulSoup
import urllib.parse
from utils.logger import logger

def _parse_dimension(value) -> int | None:
    if value is None:
        return None

    digits = "".join(character for character in str(value) if character.isdigit())
    if not digits:
        return None

    try:
        return int(digits)
    except ValueError:
        return None


def _normalize_image_url(src: str, base_origin: str) -> str:
    if src.startswith("//"):
        return f"https:{src}"

    if src.startswith("/"):
        return f"{base_origin}{src}"

    if src.startswith("http://") or src.startswith("https://"):
        return src

    return urllib.parse.urljoin(f"{base_origin}/", src)


def extract_from_url(url: str) -> dict:
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    try:
        response = httpx.get(url, headers=headers, timeout=10.0, follow_redirects=True)
        response.raise_for_status()
    except httpx.TimeoutException:
        raise ValueError("URL request timed out after 10 seconds")
    except httpx.RequestError as e:
        raise ValueError(f"Could not reach URL: {str(e)}")
    except httpx.HTTPStatusError as e:
        raise ValueError(f"URL returned HTTP {e.response.status_code}")
        
    content_type = response.headers.get("Content-Type", "")
    if content_type and "text/html" not in content_type.lower():
        raise ValueError("URL does not point to an HTML page")

    html_content = response.text
    
    text = trafilatura.extract(html_content, include_comments=False, include_tables=False)
    extraction_method = "trafilatura"
    
    if not text or not text.strip():
        soup = BeautifulSoup(html_content, "lxml")
        for tag in soup(["script", "style", "nav", "footer", "header"]):
            tag.decompose()
        paragraphs = [p.get_text(strip=True) for p in soup.find_all("p") if len(p.get_text(strip=True)) > 40]
        text = "\n\n".join(paragraphs)
        extraction_method = "beautifulsoup"
        
    if not text or not text.strip():
        raise ValueError("Could not extract article text from this URL")
        
    parsed_url = urllib.parse.urlparse(url)
    base_origin = f"https://{parsed_url.netloc}"

    # Metadata extraction
    soup = BeautifulSoup(html_content, "lxml")
    images = []

    try:
        seen_urls = set()
        for image_tag in soup.find_all("img", src=True):
            width = _parse_dimension(image_tag.get("width"))
            height = _parse_dimension(image_tag.get("height"))

            if (width is not None and width < 200) or (height is not None and height < 200):
                continue

            image_src = image_tag.get("src", "").strip()
            if not image_src:
                continue

            image_url = _normalize_image_url(image_src, base_origin)
            if not image_url.startswith("http") or image_url in seen_urls:
                continue

            images.append(
                {
                    "url": image_url,
                    "alt_text": image_tag.get("alt", "").strip(),
                }
            )
            seen_urls.add(image_url)

            if len(images) >= 3:
                break
    except Exception as exc:
        logger.warning(f"Image extraction failed for {url}: {exc}")
        images = []
    
    title = ""
    title_tag = soup.find("title")
    og_title = soup.find("meta", property="og:title")
    if title_tag and title_tag.string:
        title = title_tag.string.strip()
    elif og_title and og_title.get("content"):
        title = og_title.get("content").strip()
        
    date = ""
    article_date = soup.find("meta", property="article:published_time")
    time_tag = soup.find("time")
    if article_date and article_date.get("content"):
        date = article_date.get("content").strip()
    elif time_tag and time_tag.get("datetime"):
        date = time_tag.get("datetime").strip()
        
    domain = parsed_url.netloc
    if domain.startswith("www."):
        domain = domain[4:]
        
    return {
        "text": text,
        "title": title,
        "domain": domain,
        "date": date,
        "extraction_method": extraction_method,
        "images": images
    }
