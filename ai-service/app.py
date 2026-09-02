import os
import time
from collections import defaultdict, deque
from fastapi import FastAPI
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from typing import Optional

app = FastAPI(title="SAIED Free Medical AI", version="1.0")

allowed_origins = [origin.strip() for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type"],
)

rate_window_seconds = 60
rate_limit = 20
request_times: dict[str, deque[float]] = defaultdict(deque)

@app.middleware("http")
async def throttle_requests(request: Request, call_next):
    if request.url.path in ("/chat", "/triage"):
        client = request.client.host if request.client else "unknown"
        now = time.monotonic()
        recent = request_times[client]
        while recent and now - recent[0] > rate_window_seconds:
            recent.popleft()
        if len(recent) >= rate_limit:
            return JSONResponse(status_code=429, content={"detail": "Too many requests. Please try again shortly."})
        recent.append(now)
    return await call_next(request)

MODEL_ID = os.getenv("MODEL_ID", "google/medgemma-1.5-4b-it")
_pipeline = None

class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    age: Optional[int] = Field(default=None, ge=0, le=120)
    sex: Optional[str] = Field(default=None, max_length=40)
    language: str = Field(default="en", min_length=2, max_length=12)

    @field_validator("message")
    @classmethod
    def normalize_message(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("message cannot be blank")
        return value

def safety_gate(text: str):
    red_flags = [
        "difficulty breathing", "can't breathe", "severe chest pain",
        "unconscious", "not waking", "heavy bleeding", "seizure",
        "stroke", "suicide", "poisoning", "kupumua kwa shida", "maumivu makali ya kifua",
        "kupoteza fahamu", "kutokwa damu nyingi", "mshtuko", "sumu", "kujiua"
    ]
    lower=text.lower()
    return any(x in lower for x in red_flags)

@app.get("/health")
def health():
    return {"ok": True, "model": MODEL_ID}

@app.post("/triage")
def triage(req: ChatRequest):
    if safety_gate(req.message):
        return {
            "urgency": "emergency",
            "answer": "Possible emergency warning signs detected. SAIED AI will not diagnose this. Seek urgent professional/emergency care now.",
            "handoff_required": True
        }
    return {
        "urgency": "review",
        "answer": "I can help organize the symptoms and prepare questions for a qualified healthcare professional. I cannot confirm a diagnosis or prescribe treatment.",
        "handoff_required": True
    }

@app.post("/chat")
def chat(req: ChatRequest):
    if safety_gate(req.message):
        return {
            "model": MODEL_ID,
            "urgency": "emergency",
            "answer": "Possible emergency warning signs detected. SAIED AI will not diagnose this. Seek urgent professional/emergency care now.",
            "handoff_required": True
        }
    return {
        "model": MODEL_ID,
        "answer": "SAIED AI is an assistant. Please describe your symptoms, duration, age, medicines, allergies and relevant history. A licensed healthcare professional must make clinical decisions.",
        "handoff_required": True
    }
