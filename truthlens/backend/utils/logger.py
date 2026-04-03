import logging
import sys

def _setup_logger():
    logger = logging.getLogger("truthlens")
    logger.setLevel(logging.INFO)
    
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setLevel(logging.INFO)
        formatter = logging.Formatter('%(asctime)s | %(levelname)s | %(name)s | %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        
    return logger

logger = _setup_logger()
