from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate
from dotenv import load_dotenv
import os


# Load environment variables from .env file
load_dotenv()  # Looks for .env file in current directory by default

# Initialize Groq with the API key from .env
llm = ChatGroq(
    model_name="llama3-8b-8192",
    temperature=0.7,
    # The API key will be automatically read from GROQ_API_KEY environment variable
)


# 3. Create chain
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant."),
    ("human", "{input}")
])
chain = prompt | llm

# 4. Invoke with error handling
try:
    response = chain.invoke({"input": "Explain quantum computing simply"})
    print(response.content)
except Exception as e:
    print(f"API Error: {e}")
    if "403" in str(e):
        print("Please check your API key and network settings")

