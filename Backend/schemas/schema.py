from pydantic import BaseModel, Field
from typing import Optional

class PaperSummary(BaseModel):
    title_and_authors: Optional[str] = None
    abstract: Optional[str] = None
    problem_statement: Optional[str] = None
    methodology: Optional[str] = None
    key_results: Optional[str] = None
    conclusion: Optional[str] = None
    error: Optional[str] = None

class ChatRequest(BaseModel):
    question: str

class ChatResponse(BaseModel):
    answer: str