import urllib.parse

def validate_input(text: str) -> tuple[bool, str]:
    cleaned_text = text.strip()
    if not cleaned_text:
        return (False, "Input cannot be empty")
    if len(cleaned_text) < 10:
        return (False, "Input must be at least 10 characters long")
    if len(cleaned_text) > 50000:
        return (False, "Input cannot exceed 50,000 characters")
    return (True, "")

def is_url(text: str) -> bool:
    return text.startswith("http://") or text.startswith("https://")

def extract_domain(url: str) -> str:
    try:
        parsed = urllib.parse.urlparse(url)
        netloc = parsed.netloc
        if netloc.startswith("www."):
            netloc = netloc[4:]
        return netloc
    except Exception:
        return ""

def sanitize_text(text: str) -> str:
    return text.strip().replace("\x00", "")
