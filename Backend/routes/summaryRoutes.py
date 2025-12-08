import os
import tempfile
from fastapi import APIRouter, HTTPException, UploadFile, File
from dotenv import load_dotenv
import fitz
from controllers.summarizeController import generate_research_summary
from controllers.chatController import reset_chat_history
from schemas.schema import PaperSummary
from services.vectorStore import create_vector_store, reset_vector_store
from services.helpers import extract_text_from_pdf

load_dotenv()

router = APIRouter()

MAX_FILE_SIZE = 20 * 1024 * 1024  # 20MB


@router.post("/upload", response_model=PaperSummary)
async def upload_and_summarize_paper(file: UploadFile = File(...)):
    """
    Upload a research paper PDF and generate structured summary with RAG setup
    Chat history is automatically cleared when new PDF is uploaded
    """
    # Validate file type
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(
            status_code=400, 
            detail="Only PDF files are allowed"
        )
    
    # Read and validate file size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400, 
            detail=f"File size exceeds {MAX_FILE_SIZE // (1024*1024)}MB limit"
        )
    
    tmp_path = None
    
    try:
        # Save to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(contents)
            tmp_path = tmp.name
        
        print(f"Processing file: {file.filename}")
        
        # Extract text from PDF
        full_text = extract_text_from_pdf(tmp_path)
        
        if not full_text or len(full_text) < 100:
            raise HTTPException(
                status_code=400,
                detail="Could not extract sufficient text from PDF. Please ensure it's not a scanned image or try OCR."
            )
        
        print(f"Extracted {len(full_text)} characters from PDF")
        
        # Reset previous vector store and chat history
        reset_vector_store()
        reset_chat_history()  # Clear chat when new PDF is uploaded
        
        # Create vector store for RAG
        print("Creating vector store for RAG...")
        create_vector_store(tmp_path)
        print("Vector store created successfully")
        
        # Generate summary
        print("Generating AI summary...")
        summary_data = await generate_research_summary(full_text)
        print("Summary generated successfully")
        
        return summary_data
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error processing PDF: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing PDF: {str(e)}"
        )
    finally:
        # Cleanup temporary file
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
                print("Temporary file cleaned up")
            except Exception as e:
                print(f"Could not remove temporary file: {str(e)}")

