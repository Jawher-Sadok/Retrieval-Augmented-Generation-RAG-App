from langchain.agents import create_react_agent, AgentExecutor
from langchain.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from langchain_community.tools import WikipediaQueryRun
from langchain_community.utilities import WikipediaAPIWrapper
from dotenv import load_dotenv
import os

# 1. Load environment variables (GROQ_API_KEY)
load_dotenv()  

# 2. Initialize Groq LLM (Llama 3)
llm = ChatGroq(
    model_name="llama3-8b-8192",
    temperature=0.7,  # Adjust for creativity vs. precision
)

# 3. Set up Wikipedia tool
tools = [
    WikipediaQueryRun(
        api_wrapper=WikipediaAPIWrapper(top_k_results=1)  # Limit to 1 result
    )
]

# 4. Define ReAct-style prompt template
prompt_template = """
Answer the following question as best you can. You have access to the following tool:

{tools}

Use the following format:

Question: the input question you must answer
Thought: think about what to do
Action: the action to take (must be one of [{tool_names}])
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original question

Begin!

Question: {input}
Thought: {agent_scratchpad}"""

prompt = ChatPromptTemplate.from_template(prompt_template)

# 5. Create ReAct agent
agent = create_react_agent(llm, tools, prompt)

# 6. Initialize AgentExecutor
executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True,  # Print step-by-step reasoning
    handle_parsing_errors=True  # Auto-retry if LLM output is malformed
)

# 7. Run with error handling
try:
    question = "What is Python programming language?"
    result = executor.invoke({"input": question})
    print("\nFinal Answer:", result["output"])
except Exception as e:
    print(f"Error: {e}")
    if "403" in str(e):
        print("API key invalid. Check GROQ_API_KEY in .env")