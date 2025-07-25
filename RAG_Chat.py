import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain

# Load environment variables
load_dotenv()

class GroqRAGSystem:
    def __init__(self):
        # Initialize Groq LLM
        self.llm = ChatGroq(
            model_name="llama3-8b-8192",
            temperature=0.6,
            max_tokens=2048
        )
        
        # Initialize embeddings
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        
        # Initialize text splitter
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        
        self.vectorstore = None
        self.retriever = None
        self.retrieval_chain = None
    
    def load_and_process_documents(self, file_path):
        """Load and process PDF documents"""
        loader = PyPDFLoader(file_path)
        pages = loader.load()
        
        # Split documents
        docs = self.text_splitter.split_documents(pages)
        
        # Create vector store
        self.vectorstore = FAISS.from_documents(docs, self.embeddings)
        self.retriever = self.vectorstore.as_retriever(search_kwargs={"k": 3})
        
        # Create retrieval chain
        prompt = ChatPromptTemplate.from_template("""
        Answer the following question based only on the provided context:
        
        <context>
        {context}
        </context>
        
        Question: {input}
        """)
        
        document_chain = create_stuff_documents_chain(self.llm, prompt)
        self.retrieval_chain = create_retrieval_chain(self.retriever, document_chain)
    
    def query(self, question):
        """Query the RAG system"""
        if not self.retrieval_chain:
            raise ValueError("Please load documents first using load_and_process_documents()")
        
        response = self.retrieval_chain.invoke({"input": question})
        return response["answer"]

# Example Usage
if __name__ == "__main__":
    # Initialize RAG system
    rag = GroqRAGSystem()
    
    # Process PDF file (replace with your file path)
    rag.load_and_process_documents("C:\\Users\\ASUS\\Downloads\\Proposition.pdf")
    
    # Ask a question
    question = "What are the key findings in this document?"
    answer = rag.query(question)
    
    print(f"Question: {question}")
    print(f"Answer: {answer}")