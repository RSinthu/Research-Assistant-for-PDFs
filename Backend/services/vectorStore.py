from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from langchain_community.vectorstores import FAISS
from langchain_huggingface.embeddings import HuggingFaceEmbeddings
from langchain_community.document_loaders import PyPDFLoader
import os
from typing import List, Optional

# Create embeddings
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Global storage for vector store
_vector_store: Optional[FAISS] = None
_current_pdf_path: Optional[str] = None

def create_vector_store(pdf_path: str) -> FAISS:
    """Create vector store from PDF - call this once per document upload"""
    global _vector_store, _current_pdf_path
    
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF file not found: {pdf_path}")
    
    try:
        # Load PDF
        loader = PyPDFLoader(pdf_path)
        documents = loader.load()
        
        if not documents:
            raise ValueError("No content extracted from PDF")
        
        # Split documents
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
            separators=["\n\n", "\n", " ", ""]
        )
        splits = text_splitter.split_documents(documents)
        
        if not splits:
            raise ValueError("No text chunks created from PDF")
        
        # Create vector store
        _vector_store = FAISS.from_documents(
            documents=splits,
            embedding=embeddings
        )
        _current_pdf_path = pdf_path
        
        print(f"Vector store created with {len(splits)} chunks")
        return _vector_store
        
    except Exception as e:
        print(f"Error creating vector store: {str(e)}")
        raise

def get_vector_store() -> FAISS:
    """Get the current vector store instance"""
    if _vector_store is None:
        raise ValueError("Vector store not initialized. Please upload a PDF first.")
    return _vector_store

def query_vector_store(query: str, k: int = 5) -> List[Document]:
    """Query the vector store for relevant documents"""
    if _vector_store is None:
        raise ValueError("Vector store not initialized. Please upload a PDF first.")
    
    try:
        # Use similarity search with relevance scores
        docs_with_scores = _vector_store.similarity_search_with_score(query, k=k)
        
        # Filter by relevance threshold (optional)
        relevant_docs = [doc for doc, score in docs_with_scores if score < 1.5]
        
        if not relevant_docs:
            relevant_docs = [doc for doc, _ in docs_with_scores[:3]]  # Take top 3 if none pass threshold
        
        return relevant_docs
        
    except Exception as e:
        print(f"Error querying vector store: {str(e)}")
        raise

def reset_vector_store():
    """Reset vector store when new PDF is uploaded"""
    global _vector_store, _current_pdf_path
    _vector_store = None
    _current_pdf_path = None
    print("Vector store reset")

def is_vector_store_initialized() -> bool:
    """Check if vector store is initialized"""
    return _vector_store is not None