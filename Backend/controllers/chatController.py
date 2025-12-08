import os
from typing import Dict, AsyncGenerator
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
from langchain_core.messages import trim_messages
from langchain_core.prompts import MessagesPlaceholder
from langchain_classic.chains.history_aware_retriever import create_history_aware_retriever
from langchain_classic.chains.retrieval import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_community.chat_message_histories import ChatMessageHistory
from services.vectorStore import get_vector_store

load_dotenv()

# Initialize LLM
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=0.3
)

# Single global chat history for current session
_chat_history = ChatMessageHistory()

def get_chat_history() -> ChatMessageHistory:
    """Get the current session's chat history"""
    global _chat_history
    return _chat_history

def reset_chat_history():
    """Reset chat history (called when new PDF is uploaded)"""
    global _chat_history
    _chat_history = ChatMessageHistory()
    print("Chat history cleared")

async def generate_answer_stream(question: str) -> AsyncGenerator[str, None]:
    """
    Generate answer using RAG with streaming support
    
    Args:
        question: User's question
        
    Yields:
        Chunks of the answer as they are generated
    """
    try:
        # Get vector store retriever
        vector_store = get_vector_store()
        retriever = vector_store.as_retriever(
            search_type="mmr",
            search_kwargs={"k": 4, "fetch_k": 10}
        )
        
        # Contextualize question prompt
        contextualize_q_system_prompt = (
            "Given a chat history and the latest user question "
            "which might reference context in the chat history, "
            "formulate a standalone question which can be understood "
            "without the chat history. Do NOT answer the question, "
            "just reformulate it if needed and otherwise return it as is."
        )
        
        contextualize_q_prompt = ChatPromptTemplate.from_messages([
            ("system", contextualize_q_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ])
        
        # Create history-aware retriever
        history_aware_retriever = create_history_aware_retriever(
            llm, retriever, contextualize_q_prompt
        )
        
        # QA system prompt
        system_prompt = (
            "You are an expert research assistant analyzing research papers. "
            "Use the following context from the paper to answer the question accurately. "
            "If you don't know the answer based on the context, say so clearly. "
            "Provide specific details and cite relevant information from the paper.\n\n"
            "Context:\n{context}"
        )
        
        qa_prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ])
        
        # Create question-answer chain
        question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
        
        # Create RAG chain
        rag_chain = create_retrieval_chain(
            history_aware_retriever, 
            question_answer_chain
        )
        
        # Get current chat history
        chat_history = get_chat_history()
        
        # Trim messages to prevent context overflow
        trimmed_history = trim_messages(
            chat_history.messages,
            max_tokens=2000,
            strategy="last",
            token_counter=llm,
            include_system=False,
            start_on="human"
        ) if chat_history.messages else []
        
        # Store complete answer for history
        complete_answer = ""
        
        # Stream the response
        async for chunk in rag_chain.astream({
            "input": question,
            "chat_history": trimmed_history
        }):
            # Extract answer content from chunk
            if isinstance(chunk, dict) and 'answer' in chunk:
                token = chunk['answer']
                if token:
                    complete_answer += token
                    yield token
        
        # Update chat history with complete answer
        chat_history.add_user_message(question)
        chat_history.add_ai_message(complete_answer)
        
    except ValueError as e:
        error_msg = f"Error: {str(e)}. Please upload a PDF document first."
        yield error_msg
    except Exception as e:
        print(f"Error generating answer: {str(e)}")
        raise

# Keep the original non-streaming function for backwards compatibility
async def generate_answer(question: str) -> Dict[str, any]:
    """
    Generate answer using RAG (non-streaming version)
    """
    complete_answer = ""
    async for chunk in generate_answer_stream(question):
        complete_answer += chunk
    
    return {
        "answer": complete_answer
    }