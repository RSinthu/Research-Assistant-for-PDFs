from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.summaryRoutes import router as summary_router
from routes.chatRoutes import router as chat_router
from routes.speechRoutes import router as speech_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(summary_router, prefix="/api", tags=["summary"])
app.include_router(chat_router, prefix="/api", tags=["chat"])
app.include_router(speech_router, prefix="/api", tags=["transcribe"])

@app.get("/")
async def root():
    return {"message":"System is running"}