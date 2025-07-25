from langchain.agents import create_react_agent, AgentExecutor
from langchain_core.prompts import PromptTemplate
from langchain_community.llms import FakeListLLM
from langchain_community.tools import DuckDuckGoSearchRun
from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate
from dotenv import load_dotenv


# Load environment variables from .env file
load_dotenv()  # Looks for .env file in current directory by default

# Initialize Groq with the API key from .env
llm = ChatGroq(
    model_name="llama3-8b-8192",
    temperature=0.7,
    # The API key will be automatically read from GROQ_API_KEY environment variable
)

tools = [DuckDuckGoSearchRun()]


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


prompt = PromptTemplate.from_template(
    prompt_template,
    partial_variables={
        "tools": "\n".join([f"- {tool.name}: {tool.description}" for tool in tools]),
        "tool_names": ", ".join([tool.name for tool in tools]),
    },
)

agent = create_react_agent(llm, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools,handle_parsing_errors=True)
result = executor.invoke({"input": "What's new in AI?"})
print(result)