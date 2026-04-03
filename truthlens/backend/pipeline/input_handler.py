from utils.logger import logger

def classify_input(raw_input: str) -> dict:
    stripped_input = raw_input.strip()
    
    if not stripped_input:
        raise ValueError("Input cannot be empty")
        
    if len(stripped_input) < 10:
        raise ValueError("Input must be at least 10 characters")
        
    truncated = False
    if len(stripped_input) > 50000:
        logger.warning(f"Input truncated from {len(stripped_input)} characters to 50000 characters")
        stripped_input = stripped_input[:50000]
        truncated = True
        
    if stripped_input.startswith("http://") or stripped_input.startswith("https://"):
        input_type = "URL"
    elif len(stripped_input) < 150:
        input_type = "HEADLINE"
    else:
        input_type = "ARTICLE_TEXT"
        
    return {
        "type": input_type,
        "content": stripped_input,
        "truncated": truncated
    }
