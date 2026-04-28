from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from fastapi.middleware.cors import CORSMiddleware # Add this

app = FastAPI()

# 1. FIX: Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Your React App URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = SentenceTransformer("all-MiniLM-L6-v2")

class TextRequest(BaseModel):
    text: str

@app.get("/")
def home():
    return {"message": "AI embedding service running"}

@app.post("/embed")
def create_embedding(request: TextRequest):
    embedding = model.encode(request.text).tolist()
    return {"embedding": embedding}

# 2. FIX: Add the Summarize endpoint
@app.post("/summarize")
async def summarize(request: TextRequest):
    # For now, let's create a "Smart Summary" by taking the first 2 sentences.
    # Later, you can integrate a proper LLM here.
    content = request.text
    sentences = content.split('.')
    summary = ". ".join(sentences[:2]) + "." if len(sentences) > 1 else content
    
    return {"summary": f"✨ Key Insights: {summary}"}