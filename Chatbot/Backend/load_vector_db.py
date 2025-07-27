import os
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader, TextLoader, Docx2txtLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
import tempfile

load_dotenv()

def load_and_process_documents(file_path: str) -> bool:
    """Load and process a document into the vector store."""
    file_ext = os.path.splitext(file_path)[1].lower()
    
    try:
        # Load based on file type
        if file_ext == '.pdf':
            loader = PyPDFLoader(file_path)
        elif file_ext == '.txt':
            loader = TextLoader(file_path)
        elif file_ext in ['.docx', '.doc']:
            loader = Docx2txtLoader(file_path)
        else:
            raise ValueError("Unsupported file type")
        
        pages = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        docs = text_splitter.split_documents(pages)
        
        # Use HuggingFace embeddings
        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        
        # Create and save FAISS vector store
        vectorstore = FAISS.from_documents(docs, embeddings)
        vectorstore.save_local("vectorstore")
        print("Vector store saved successfully.")
        return True
    except Exception as e:
        print(f"Error processing document: {str(e)}")
        return False

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 2:
        print("Usage: python load_vector_db.py <path_to_file>")
        sys.exit(1)
    file_path = sys.argv[1]
    load_and_process_documents(file_path)