# Customer Service RAG Chatbot

This project is a **Customer Service RAG Chatbot** built using **React** with **TypeScript** for the frontend and **FastAPI** with **Python** and **LangChain** for the backend. The chatbot leverages Retrieval-Augmented Generation (RAG) to provide context-aware responses by retrieving relevant information from a knowledge base and generating answers using a language model.


## Prerequisites
- **Python** (>=3.8): For the FastAPI backend and LangChain.
- **Node.js** (>=16): For the React frontend.
- **pip**: Python package manager.
- **npm** or **yarn**: Node.js package manager.
- **Git**: To clone the repository.
- **Optional**: A virtual environment tool (e.g., `venv`).
- **Optional**: A language model API key (e.g., OpenAI) for LangChain.



## Setup Instructions

### Backend Setup (FastAPI + LangChain)

**Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
   Dependencies include:
   - `fastapi`
   - `uvicorn[standard]`
   - `langchain`
   - `langchain-openai` 
   - `faiss-cpu` 
   - `python-dotenv`

 **Set Up Environment Variables**:
   Replace `your key` with your groq API key.

**Prepare the Knowledge Base**:
   Place your knowledge base files (e.g., FAQs, documentation) . These files will be indexed by LangChain for retrieval.

### Frontend Setup (React + TypeScript)

1. **Navigate to the Frontend Directory**:
   ```bash
   cd ../frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install  # Or: yarn install

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
   - The frontend runs on `http://localhost:5173`.
   - It communicates with the backend via API calls.

3. **Access the Chatbot**:
   Open `http://localhost:5173` in your browser to interact with the chatbot.

## Testing the Chatbot

1. **Interact with the Chatbot**:
   - Open the frontend in your browser.
   - Type a customer service query (e.g., "How do I return a product?").
   - The chatbot retrieves relevant information from the knowledge base and generates a response using the language model.
