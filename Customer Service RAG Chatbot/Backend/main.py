import os
from typing import Dict, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
from langchain_core.documents import Document
from pydantic import BaseModel

load_dotenv()

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Adjust for your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define a request model
class QueryRequest(BaseModel):
    question: str

class GroqRAGSystem:
    def __init__(self):
        self.llm = ChatGroq(
            model_name="llama3-8b-8192",
            temperature=0.5,
            max_tokens=2048
        )
        self.embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        self.vectorstore = FAISS.load_local("vectorstore", self.embeddings, allow_dangerous_deserialization=True)
        self.retriever = self.vectorstore.as_retriever(search_kwargs={"k": 3})
        
        prompt = ChatPromptTemplate.from_template("""
        You are ARIA, an advanced AI support assistant. Answer the user's question based on the context.
        Be professional, friendly, and concise. If you don't know, say so.
        
        Context:
        {context}
        
        Question: {input}
        
        Answer in markdown format with proper formatting for lists, code, etc.
        """)
        
        document_chain = create_stuff_documents_chain(self.llm, prompt)
        self.retrieval_chain = create_retrieval_chain(self.retriever, document_chain)

    def query_with_sources(self, question: str) -> Dict[str, str]:
        if not self.retrieval_chain:
            raise ValueError("Vector database not loaded. Please load documents first using load_vector_db.py.")
        
        response = self.retrieval_chain.invoke({"input": question})
        
        # Extract source documents
        source_docs = response.get("context", [])
        sources = []
        
        for doc in source_docs:
            if isinstance(doc, Document):
                source_name = doc.metadata.get("source", "Unknown")
                if source_name not in sources:
                    sources.append(source_name)
        
        return {
            "answer": response["answer"],
            "sources": sources
        }

rag_system = GroqRAGSystem()

@app.get("/")
async def read_root():
    return {"message": "Welcome to ARIA API. Use /query/ for questions and load documents with load_vector_db.py first."}

@app.post("/query/")
async def query(request: QueryRequest):
    try:
        response = rag_system.query_with_sources(request.question)
        return response
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)