import os
from typing import Dict, List
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_community.document_loaders import PyPDFLoader, TextLoader, Docx2txtLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
from langchain_core.documents import Document
import tempfile

load_dotenv()

class GroqRAGSystem:
    def __init__(self):
        self.llm = ChatGroq(
            model_name="llama3-8b-8192",
            temperature=0.5,
            max_tokens=2048
        )
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        self.vectorstore = None
        self.retriever = None
        self.retrieval_chain = None
    
    async def load_and_process_documents(self, file) -> bool:
        """Load and process uploaded documents"""
        file_ext = os.path.splitext(file.filename)[1].lower()
        
        # Create temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        try:
            # Load based on file type
            if file_ext == '.pdf':
                loader = PyPDFLoader(temp_file_path)
            elif file_ext == '.txt':
                loader = TextLoader(temp_file_path)
            elif file_ext in ['.docx', '.doc']:
                loader = Docx2txtLoader(temp_file_path)
            else:
                raise ValueError("Unsupported file type")
            
            pages = loader.load()
            docs = self.text_splitter.split_documents(pages)
            self.vectorstore = FAISS.from_documents(docs, self.embeddings)
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
            return True
        finally:
            os.unlink(temp_file_path)
    
    def query_with_sources(self, question: str) -> Dict[str, str]:
        if not self.retrieval_chain:
            raise ValueError("Please load documents first")
        
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