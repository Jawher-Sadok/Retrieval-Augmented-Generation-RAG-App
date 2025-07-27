# Customer Service RAG Chatbot

This project is a **Customer Service RAG Chatbot** built using **React** with **TypeScript** for the frontend and **FastAPI** with **Python** and **LangChain** for the backend. The chatbot leverages Retrieval-Augmented Generation (RAG) to provide context-aware responses by retrieving relevant information from a knowledge base and generating answers using a language model.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
  - [Backend Setup (FastAPI + LangChain)](#backend-setup-fastapi--langchain)
  - [Frontend Setup (React + TypeScript)](#frontend-setup-react--typescript)
- [Running the Application](#running-the-application)
- [Testing the Chatbot](#testing-the-chatbot)
- [Environment famaous Key Takeaways](#key-takeaways)

## Prerequisites
- **Python** (>=3.8): For the FastAPI backend and LangChain.
- **Node.js** (>=16): For the React frontend.
- **pip**: Python package manager.
- **npm** or **yarn**: Node.js package manager.
- **Git**: To clone the repository.
- **Optional**: A virtual environment tool (e.g., `venv`).
- **Optional**: A language model API key (e.g., OpenAI) for LangChain.

## Project Structure
```
customer-service-rag-chatbot/
├── backend/
│   ├── main.py               # FastAPI application
│   ├── requirements.txt      # Python dependencies
│   ├── rag/
│   │   ├── retriever.py     # LangChain retriever logic
│   │   ├── llm.py           # Language model integration
│   │   └── data/            # Knowledge base files (e.g., FAQs, docs)
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── App.tsx          # Main React component
│   │   ├── components/      # React components (e.g., ChatWindow)
│   │   └── ...
│   ├── package.json          # Node.js dependencies
│   └── ...
└── README.md                # This file
```

## Setup Instructions

### Backend Setup (FastAPI + LangChain)

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/customer-service-rag-chatbot.git
   cd customer-service-rag-chatbot/backend
   ```

2. **Create a Virtual Environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
   Dependencies include:
   - `fastapi`
   - `uvicorn[standard]`
   - `langchain`
   - `langchain-openai` (or other LLM provider)
   - `faiss-cpu` (for vector storage)
   - `python-dotenv`

4. **Set Up Environment Variables**:
   Create a `.env` file in the `backend/` directory with the following:
   ```plaintext
   LLM_API_KEY=your-llm-api-key  # E.g., OpenAI API key
   KNOWLEDGE_BASE_PATH=data/
   ```
   Replace `your-llm-api-key` with your language model provider's API key.

5. **Prepare the Knowledge Base**:
   Place your knowledge base files (e.g., FAQs, documentation) in the `backend/data/` directory. These files will be indexed by LangChain for retrieval.

### Frontend Setup (React + TypeScript)

1. **Navigate to the Frontend Directory**:
   ```bash
   cd ../frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install  # Or: yarn install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the `frontend/` directory with the following:
   ```plaintext
   REACT_APP_API_URL=http://localhost:8000
   ```
   This points to the FastAPI backend.

## Running the Application

1. **Run the Backend**:
   From the `backend/` directory, start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```
   - The backend runs on `http://localhost:8000`.
   - The `--reload` flag enables auto-reload for development.

2. **Run the Frontend**:
   From the `frontend/` directory, start the React development server:
   ```bash
   npm start  # Or: yarn start
   ```
   - The frontend runs on `http://localhost:3000`.
   - It communicates with the backend via API calls.

3. **Access the Chatbot**:
   Open `http://localhost:3000` in your browser to interact with the chatbot.

## Testing the Chatbot

1. **Interact with the Chatbot**:
   - Open the frontend in your browser.
   - Type a customer service query (e.g., "How do I return a product?").
   - The chatbot retrieves relevant information from the knowledge base and generates a response using the language model.

2. **Test the API Directly**:
   - Use a tool like `curl` or Postman to test the FastAPI endpoints.
   - Example: Query the chatbot endpoint:
     ```bash
     curl -X POST http://localhost:8000/chat -H "Content-Type: application/json" -d '{"query": "How do I return a product?"}'
     ```

3. **Verify Knowledge Base Retrieval**:
   - Ensure the knowledge base files in `backend/data/` are correctly indexed by checking the backend logs or API responses.
   - Test with queries that should match the knowledge base content.

## Key Takeaways
- The **FastAPI backend** handles API requests, LangChain retrieval, and LLM-based response generation.
- The **React frontend** provides a user-friendly chat interface.
- The **RAG pipeline** retrieves relevant documents from the knowledge base and augments LLM responses for accurate, context-aware answers.
- Use environment variables to securely manage API keys and configuration.
- Ensure the knowledge base is properly formatted and placed in the `backend/data/` directory.

For further customization:
- Add more endpoints to the FastAPI backend (e.g., user authentication).
- Enhance the React frontend with additional features (e.g., chat history).
- Expand the knowledge base with more documents or integrate a database.