from pydantic import BaseModel, field_validator, ConfigDict

class AnalyzeRequest(BaseModel):
    model_config = ConfigDict(extra='ignore')
    input: str

    @field_validator('input')
    @classmethod
    def validate_input_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Input cannot be empty")
        return v
