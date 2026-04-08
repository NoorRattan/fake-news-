from pydantic import BaseModel, ConfigDict
from typing import Any, List, Optional

class DomainInfo(BaseModel):
    model_config = ConfigDict(extra='ignore')
    domain: str
    rating: str
    bias: str

class CitedSource(BaseModel):
    model_config = ConfigDict(extra='ignore')
    domain: str
    rating: str
    bias: str

class CorroborationResult(BaseModel):
    model_config = ConfigDict(extra='ignore')
    title: str
    url: str
    snippet: str

class ClaimCorroboration(BaseModel):
    model_config = ConfigDict(extra='ignore')
    claim: str
    results: List[CorroborationResult]

class ArticleMetadata(BaseModel):
    model_config = ConfigDict(extra='ignore')
    title: Optional[str] = None
    date: Optional[str] = None
    domain: Optional[str] = None

class AnalysisResult(BaseModel):
    model_config = ConfigDict(extra='ignore')
    analysis_id: str
    timestamp: str
    input_type: str
    processing_time_ms: int
    verdict: str
    credibility_score: int
    confidence: str
    summary: str
    red_flags: List[str]
    credible_signals: List[str]
    manipulation_tactics: List[str]
    key_claims: List[str]
    reasoning: str
    advice: str
    domain_info: Optional[DomainInfo] = None
    cited_sources: List[CitedSource] = []
    corroboration_results: List[ClaimCorroboration] = []
    article_metadata: Optional[ArticleMetadata] = None
    image_analysis: Optional[List[Any]] = []

class ErrorResponse(BaseModel):
    model_config = ConfigDict(extra='ignore')
    error: str
    detail: str
    analysis_id: str
