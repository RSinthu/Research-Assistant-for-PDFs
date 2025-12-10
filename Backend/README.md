# Research Assistant Backend

A FastAPI-based backend service that provides AI-powered research paper analysis with RAG (Retrieval-Augmented Generation) capabilities, real-time chat functionality, and speech-to-text transcription.

## 🚀 Features

### 📄 PDF Processing & Summarization
- Upload research papers in PDF format (up to 20MB)
- AI-powered structured extraction of:
  - Title and authors
  - Abstract
  - Problem statement
  - Methodology
  - Key results
  - Conclusion

### 💬 Intelligent Q&A Chat
- Context-aware question answering using RAG
- Real-time streaming responses via Server-Sent Events (SSE)
- Conversation history management
- Semantic search across uploaded papers using FAISS vector database

### 🎤 Speech-to-Text
- Audio transcription using Faster-Whisper
- Support for multiple audio formats (wav, mp3, webm, ogg)
- Fast and accurate speech recognition

## 🛠️ Tech Stack

- **Framework**: FastAPI
- **LLM**: Groq (openai/gpt-oss-120b) via LangChain
- **Vector Store**: FAISS with HuggingFace embeddings (all-MiniLM-L6-v2)
- **Document Processing**: PyMuPDF, PyPDF
- **Speech Recognition**: Faster-Whisper
- **Async Support**: HTTPX, aiofiles

## 📁 Project Structure

```
Backend/
├── controllers/          # Business logic
│   ├── chatController.py        # RAG-based chat with history
│   └── summarizeController.py   # Research paper summarization
├── routes/              # API endpoints
│   ├── chatRoutes.py            # Chat Q&A endpoints
│   ├── summaryRoutes.py         # PDF upload & summary
│   └── speechRoutes.py          # Audio transcription
├── services/            # Core services
│   ├── helpers.py               # PDF text extraction
│   └── vectorStore.py           # FAISS vector store management
├── schemas/             # Pydantic models
│   └── schema.py                # Request/response schemas
├── main.py              # Application entry point
└── requirements.txt     # Python dependencies
```

## 🚦 Getting Started

### Prerequisites
- Python 3.11+
- Groq API key

### Installation

1. **Clone the repository**
```bash
cd Backend
```

2. **Create virtual environment**
```bash
python -m venv .venv
.venv\Scripts\activate  # On Windows
# source .venv/bin/activate  # On Linux/Mac
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables**

Create a `.env` file in the Backend directory:
```env
GROQ_API_KEY=your_groq_api_key_here
```

5. **Run the server**
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## 🐳 Docker Deployment

### Build and Run with Docker

```bash
# Build image
docker build -t research-assistant-backend .

# Run container
docker run -p 8000:8000 --env-file .env research-assistant-backend
```

### Using Docker Compose

From the root directory:
```bash
docker-compose up backend
```

## 📡 API Endpoints

### Summary API
- **POST** `/api/upload` - Upload PDF and generate structured summary
  - **Content-Type**: `multipart/form-data`
  - **Body**: `file` (PDF file, max 20MB)
  - **Response**: JSON with extracted sections

### Chat API
- **POST** `/api/chat` - Ask questions about uploaded paper (streaming)
  - **Content-Type**: `application/json`
  - **Body**: `{"question": "your question"}`
  - **Response**: Server-Sent Events stream

### Speech API
- **POST** `/api/transcribe` - Transcribe audio to text
  - **Content-Type**: `multipart/form-data`
  - **Body**: `file` (audio file: wav, mp3, webm, ogg)
  - **Response**: `{"text": "transcription"}`

## 🔧 Configuration

Key configurations in `main.py`:
- **CORS**: Enabled for all origins (configure for production)
- **Max File Size**: 20MB for uploads
- **Vector Store**: FAISS with semantic search
- **LLM Model**: openai/gpt-oss-120b via Groq
- **Embeddings**: all-MiniLM-L6-v2 (HuggingFace)

## 📦 Key Dependencies

```txt
fastapi==0.124.0
langchain==1.1.2
langchain-groq==1.1.0
faiss-cpu==1.13.1
faster-whisper==1.2.1
PyMuPDF==1.26.6
sentence-transformers==5.1.2
uvicorn==0.34.1
python-multipart==0.0.20
```

## 🤝 Integration with Frontend

The backend is designed to work seamlessly with the React-based frontend:
- Provides RESTful APIs for PDF upload and processing
- Streams real-time chat responses using SSE
- Handles voice input transcription
- Manages vector store for semantic search

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Groq API key for LLM access | Yes |

## 🔐 Security Notes

- File upload size limited to 20MB
- Only PDF files accepted for document upload
- Only audio files (wav, mp3, webm, ogg) accepted for transcription
- CORS configured for development (adjust for production)
- API keys should be stored in `.env` file (not committed to git)

## 🐛 Troubleshooting

**Issue**: Module not found errors
```bash
pip install -r requirements.txt
```

**Issue**: GROQ_API_KEY not found
- Ensure `.env` file exists in the Backend directory
- Verify the API key is correct

**Issue**: Port 8000 already in use
```bash
uvicorn main:app --reload --port 8001
```

## 📄 License

This project is part of the Research Assistant application.

---

