from langchain.agents import Tool
from langchain_experimental.tools import PythonREPLTool
from langchain_groq import ChatGroq
from langchain.agents import initialize_agent
from langchain.llms import OpenAI  # Or any LLM (e.g., ChatGroq)

from dotenv import load_dotenv

load_dotenv()  

# Initialize the tool
python_repl = PythonREPLTool()

# Example: Run a Python command
result = python_repl.run("print([x**2 for x in range(5)])")
print(result)

llm = ChatGroq(
    model_name="llama3-8b-8192",
    temperature=0.7,  # Adjust for creativity vs. precision
)
tools = [PythonREPLTool()]

agent = initialize_agent(
    tools,
    llm,
    agent="zero-shot-react-description",
    verbose=True
)

agent.run("""Calculate the factorial of 5 using Python
Calculate step-by-step using Python_REPL:
1. Import required libraries.
2. Perform the calculation.
3. Return the result.

Question: {input}""" )