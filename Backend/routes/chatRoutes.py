from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from controllers.chatController import generate_answer_stream
from services.vectorStore import is_vector_store_initialized
import json
from schemas.schema import ChatRequest

router = APIRouter()

@router.post("/chat")
async def chat_with_paper(request: ChatRequest):
    """
    Ask questions about the uploaded paper with conversation history (streaming)
    """
    # Check if vector store is initialized
    if not is_vector_store_initialized():
        raise HTTPException(
            status_code=400, 
            detail="No document uploaded. Please upload a PDF first."
        )
    
    async def event_generator():
        try:
            counter = 0
            async for chunk in generate_answer_stream(request.question):
                if chunk:  # Only send non-empty chunks
                    json_data = json.dumps({"content": chunk, "formatted": True})
                    yield f"id: {counter}\nevent: message\ndata: {json_data}\n\n"
                    counter += 1
                    
        except ValueError as e:
            error_data = json.dumps({"error": str(e)})
            yield f"event: error\ndata: {error_data}\n\n"
        except Exception as e:
            error_data = json.dumps({"error": f"Error processing question: {str(e)}"})
            yield f"event: error\ndata: {error_data}\n\n"
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"  # Disable nginx buffering
        }
    )