# LangChain Code Structures and Tools Guide

## General Structure for Using Tools with LLM
Here's the basic structure when using tools with an LLM in LangChain:

```python
from langchain.agents import initialize_agent, AgentType
from langchain.llms import OpenAI  # or any other LLM

# Initialize LLM
llm = OpenAI(temperature=0)  # or other LLM initialization

# Define your tools (see tools section below for examples)
tools = [...]

# Create agent
agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,  # or other agent type
    verbose=True
)

# Run the agent
result = agent.run("Your question or task here")
print(result)
```

## Free Tools in LangChain (with Usage Examples)
Here's a table of free tools available in LangChain:

| Tool Name            | Description                    | Python Example                                                                 |
|----------------------|--------------------------------|--------------------------------------------------------------------------------|
| PythonREPLTool       | Executes Python code           | `from langchain.tools import PythonREPLTool; tools = [PythonREPLTool()]`        |
| DuckDuckGoSearchRun  | Web search                     | `from langchain.tools import DuckDuckGoSearchRun; tools = [DuckDuckGoSearchRun()]` |
| WikipediaQueryRun    | Wikipedia search               | `from langchain.utilities import WikipediaAPIWrapper; tools = [WikipediaQueryRun(api_wrapper=WikipediaAPIWrapper())]` |
| ArxivQueryRun        | Arxiv paper search             | `from langchain.utilities import ArxivAPIWrapper; tools = [ArxivQueryRun(api_wrapper=ArxivAPIWrapper())]` |
| WolframAlphaQueryRun | Wolfram Alpha queries          | `from langchain.utilities import WolframAlphaAPIWrapper; tools = [WolframAlphaQueryRun(api_wrapper=WolframAlphaAPIWrapper())]` (requires API key) |
| Terminal             | Runs terminal commands         | `from langchain.tools import ShellTool; tools = [ShellTool()]` (use with caution) |
| HumanInputRun        | Asks human for input           | `from langchain.tools import HumanInputRun; tools = [HumanInputRun()]`         |
| RequestsGetTool      | Makes HTTP GET requests        | `from langchain.tools import RequestsGetTool; tools = [RequestsGetTool()]`     |
| OpenWeatherMap       | Weather data                   | `from langchain.utilities import OpenWeatherMapAPIWrapper; tools = [OpenWeatherMapQueryRun(api_wrapper=OpenWeatherMapAPIWrapper())]` (requires API key) |

## Prompt Templates to Avoid Infinite Loops
Here are two effective prompt templates to prevent infinite loops:

### 1. Step-by-Step Template
```python
agent.run("""Perform the following task step-by-step. 
If a step fails or doesn't produce the expected result after 3 attempts, stop and explain why.

Steps:
1. First do [action]
2. Then do [action]
3. Finally [action]

Question: {input}""")
```

### 2. Structured Reasoning Template
```python
prompt = """Answer the following question as best you can. You have access to the following tools:

{tools}

Use the following format:

Question: the input question you must answer
Thought: think about what to do and why. Always consider if you're making progress.
Action: the action to take (must be one of [{tool_names}])
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer or I cannot proceed further
Final Answer: the final answer to the original question or an explanation why it can't be answered

Additional Rules:
- If you've taken more than 5 actions without progress, stop and explain what's blocking you.
- Always verify if the action brought you closer to the solution.
- If stuck, consider alternative approaches for maximum 2 attempts.

Begin!

Question: {input}
Thought: {agent_scratchpad}"""
```

These structures and templates should help you build robust LangChain applications with proper control flow and error handling.
