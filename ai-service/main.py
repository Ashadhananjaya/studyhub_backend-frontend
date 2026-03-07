from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer

app = FastAPI()

# load embedding model
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