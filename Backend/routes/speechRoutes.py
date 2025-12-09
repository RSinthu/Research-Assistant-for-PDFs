from fastapi import APIRouter, UploadFile, File, HTTPException
from faster_whisper import WhisperModel
import tempfile
import os

router = APIRouter()

# Load model once at startup (use CPU for simplicity)
model = WhisperModel("base", device="cpu", compute_type="int8")

@router.post("/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    """Transcribe audio to text"""
    if not audio.filename.endswith(('.wav', '.mp3', '.webm', '.ogg')):
        raise HTTPException(400, "Only audio files allowed")
    
    tmp_path = None
    try:
        # Save uploaded audio
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            tmp.write(await audio.read())
            tmp_path = tmp.name
        
        # Transcribe
        segments, info = model.transcribe(tmp_path)
        text = " ".join([segment.text for segment in segments])
        
        return {"text": text.strip()}
    
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)