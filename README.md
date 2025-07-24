# LangChain Free Tools Guide

This guide provides detailed setup instructions, code examples, and usage details for free LangChain tools, including those with free tiers, as per the LangChain documentation ([python.langchain.com/docs/integrations/tools/](https://python.langchain.com/docs/integrations/tools/)). The tools covered are either fully free (e.g., Wikipedia, DuckDuckGo, PlayWright) or offer free tiers (e.g., Tavily, Exa, You.com). Each section includes installation steps, multiple code examples with different use cases, and explanations of key commands for developers building LLM-powered applications.

## Prerequisites

- **Python**: Version 3.8 or higher.
- **LangChain**: Install core and community packages:
  ```bash
  pip install langchain langchain-community langchain-experimental
  ```
- **Environment**: Some tools require API keys or local setups (e.g., SQLite for SQLDatabase, OAuth for Gmail). Instructions are provided per tool.
- **Dependencies**: Additional packages (e.g., Playwright, SQLite) are noted where applicable.

## 1. Wikipedia

**Description**: Queries Wikipedia for general knowledge, returning summaries of matching pages. Fully free, no API key required.

**Setup Instructions**:
1. Install the Wikipedia integration:
   ```bash
   pip install wikipedia-api
   pip install wikipedia
   ```
2. Ensure internet access for API calls.

**Code Examples**:

1. **Basic Query**:
   ```python
    from langchain_community.tools import WikipediaQueryRun
    from langchain_community.utilities import WikipediaAPIWrapper
    
    # Initialize the tool with a limit of 1 result and 100 characters per summary
    api_wrapper = WikipediaAPIWrapper(top_k_results=1, doc_content_chars_max=100)
    tool = WikipediaQueryRun(api_wrapper=api_wrapper)
    
    # Query Wikipedia for "LangChain"
    result = tool.invoke("LangChain")
    print(result) 
   ```


2. **Agent Integration**:
   ```python
   from langchain.agents import create_react_agent, AgentExecutor
   from langchain_core.prompts import PromptTemplate
   from langchain_community.llms import FakeListLLM

   # Mock LLM for testing
   llm = FakeListLLM(responses=["Use Wikipedia to find info about Python"])
   tools = [WikipediaQueryRun(api_wrapper=WikipediaAPIWrapper(top_k_results=1))]
   prompt = PromptTemplate.from_template("Answer: {input}")
   agent = create_react_agent(llm, tools, prompt)
   executor = AgentExecutor(agent=agent, tools=tools)
   result = executor.invoke({"input": "What is Python?"})
   print(result)
   # Output: Summary of Python programming language from Wikipedia
   ```
create_react_agent: A function to create a ReAct-style agent (Reasoning + Acting), which uses LLMs to decide actions (e.g., tool usage).

AgentExecutor: Runs the agent in a loop, executing actions (tools) until a final answer is produced.

PromptTemplate: Helps structure prompts dynamically (here, it's a simple template with {input}).

FakeListLLM: A mock LLM for testing—it returns predefined responses instead of calling a real model.
FakeListLLM is given a single hardcoded response:
"Use Wikipedia to find info about Python".
This simulates an LLM deciding to use Wikipedia to answer the question.

# Agent Decision-Making Flow

When an agent receives a query, it goes through these steps:

## Step 1: Reasoning (LLM Decides the Next Action)

The LLM analyzes the input and decides:

- Should it use a tool? (e.g., Wikipedia, calculator, web search)
- Should it answer directly? (if no tool is needed)

The decision is influenced by:

1. The prompt template (which guides the LLM on when to use tools)
2. The available tools (the agent knows what tools it has access to)
3. The LLM's reasoning ability (better models like GPT-4 make smarter decisions)

## Step 2: Acting (If a Tool is Selected)

If the LLM decides to use a tool:

1. It generates a structured request (e.g., `Wikipedia.search("Python")`)
2. The AgentExecutor runs the tool and gets the result

If no tool is needed, the LLM responds directly.

## Step 3: Repeat or Final Answer

The agent checks if the answer is complete:

- If more info is needed, it loops back to Step 1
- If satisfied, it returns the final response

## What Influences the Agent's Decision?

### (A) Prompt Engineering (Most Important)

The prompt template tells the LLM how to reason and when to use tools.

**Example (ReAct-style prompt):**
"Answer the question step by step. Use tools if needed.
Question: {input}
Thought: Should I use a tool? Yes, because Wikipedia has reliable info.
Action: Wikipedia
Action Input: Python programming language"


Without proper prompting, the agent may not use tools effectively.

### (B) Available Tools

- The agent only knows about the tools provided (e.g., WikipediaQueryRun, Calculator)
- If no relevant tool exists, it will try to answer directly (even if poorly)

### (C) LLM's Capability

- Stronger LLMs (GPT-4, Claude, etc.) make better decisions
- Weaker LLMs (smaller models) may fail to use tools correctly

## Example: How the Agent Chooses to Use Wikipedia

**Scenario:** Question = "What is Python?"

**Agent's Thought Process:**
1. "This is a factual question. Wikipedia has reliable info."
2. "I should use the Wikipedia tool."

**Action Taken:**
- Calls `WikipediaQueryRun("Python programming language")`

**Result:**
- Returns a summary from Wikipedia

**Scenario:** Question = "Hi, how are you?"

**Agent's Thought Process:**
1. "This is a casual greeting, no tool needed."

**Action Taken:**
- Responds directly: "I'm just a computer program, but thanks for asking!"


**Commands**:
- `tool.invoke(query)`: Executes a Wikipedia search with the given query string.
- `tool.ainvoke(query)`: Asynchronous version of invoke.
- `api_wrapper.top_k_results`: Configures the number of results (default: 1).
- `api_wrapper.doc_content_chars_max`: Limits summary length per result.

**Use Cases**:
- Chatbots needing quick facts (e.g., historical events, biographies).
- Educational tools for summarizing topics.
- Research agents fetching background information.

## 2. DuckDuckGo Search

**Description**: Performs web searches via DuckDuckGo, returning URLs, snippets, and titles. Fully free, no API key required.

**Setup Instructions**:
1. Install the DuckDuckGo integration:
   ```bash
   pip install duckduckgo-search
   ```
2. Ensure internet access.

**Code Examples**:

1. **Simple Search**:
   ```python
   from langchain_community.tools import DuckDuckGoSearchRun

   tool = DuckDuckGoSearchRun()
   result = tool.invoke("LangChain news")
   print(result)
   # Output: List of search results with URLs, snippets, and titles
   ```

2. **Filtered Search**:
   ```python
   from langchain_community.tools import DuckDuckGoSearchResults

   tool = DuckDuckGoSearchResults(max_results=2, region="us-en")
   result = tool.invoke("AI trends 2025")
   print(result)
   # Output: Top 2 search results for AI trends in the US
   ```

3. **With Agent**:
   ```python
   from langchain.agents import create_react_agent, AgentExecutor
   from langchain_core.prompts import PromptTemplate
   from langchain_community.llms import FakeListLLM

   llm = FakeListLLM(responses=["Search for recent AI news"])
   tools = [DuckDuckGoSearchRun()]
   prompt = PromptTemplate.from_template("Answer: {input}")
   agent = create_react_agent(llm, tools, prompt)
   executor = AgentExecutor(agent=agent, tools=tools)
   result = executor.invoke({"input": "What's new in AI?"})
   print(result)
   # Output: Recent AI news from DuckDuckGo
   ```

**Commands**:
- `tool.invoke(query)`: Executes a search with the given query.
- `tool.ainvoke(query)`: Asynchronous search execution.
- `DuckDuckGoSearchResults(max_results=n)`: Limits the number of results.
- `DuckDuckGoSearchResults(region="us-en")`: Sets the search region.

**Use Cases**:
- Real-time data retrieval for news or trends.
- Grounding LLMs with current web information.
- Research tools for summarizing web content.

## 3. SearxNG Search

**Description**: Uses a self-hosted SearxNG instance for privacy-focused web searches. Free with a local setup.

**Setup Instructions**:
1. Install SearxNG locally:
   ```bash
   git clone https://github.com/searxng/searxng.git
   cd searxng
   docker-compose up -d
   ```
2. Install LangChain integration:
   ```bash
   pip install searxng
   ```
3. Note the SearxNG host URL (e.g., `http://localhost:8888`).

**Code Examples**:

1. **Basic Search**:
   ```python
   from langchain_community.tools import SearxSearchRun

   tool = SearxSearchRun(searx_host="http://localhost:8888")
   result = tool.invoke("AI frameworks")
   print(result)
   # Output: URLs, snippets, titles, and categories from SearxNG
   ```

2. **Customized Search**:
   ```python
   from langchain_community.tools import SearxSearchResults

   tool = SearxSearchResults(searx_host="http://localhost:8888", max_results=3)
   result = tool.invoke("Python libraries 2025")
   print(result)
   # Output: Top 3 results with detailed metadata
   ```

3. **Agent Workflow**:
   ```python
   from langchain.agents import create_react_agent, AgentExecutor
   from langchain_core.prompts import PromptTemplate
   from langchain_community.llms import FakeListLLM

   llm = FakeListLLM(responses=["Search for machine learning tools"])
   tools = [SearxSearchRun(searx_host="http://localhost:8888")]
   prompt = PromptTemplate.from_template("Answer: {input}")
   agent = create_react_agent(llm, tools, prompt)
   executor = AgentExecutor(agent=agent, tools=tools)
   result = executor.invoke({"input": "Best ML tools?"})
   print(result)
   # Output: ML tool results from SearxNG
   ```

**Commands**:
- `tool.invoke(query)`: Executes a search on the SearxNG instance.
- `tool.ainvoke(query)`: Asynchronous execution.
- `SearxSearchResults(max_results=n)`: Limits the number of results.
- `SearxSearchResults(searx_host="url")`: Specifies the SearxNG instance URL.

**Use Cases**:
- Privacy-sensitive applications (e.g., internal research tools).
- Custom web search for enterprise environments.
- Avoiding API limits of commercial search engines.

## 4. Python REPL

**Description**: Executes Python code in a REPL environment. Free, but requires caution with untrusted inputs.

**Setup Instructions**:
1. Install the experimental package:
   ```bash
   pip install langchain-experimental
   ```
2. No additional setup required.

**Code Examples**:

1. **Simple Calculation**:
   ```python
   from langchain_experimental.tools import PythonREPLTool

   tool = PythonREPLTool()
   result = tool.invoke("print(2 + 3)")
   print(result)
   # Output: 5
   ```

2. **Complex Code**:
   ```python
   tool = PythonREPLTool()
   code = """
   def factorial(n):
       if n == 0:
           return 1
       return n * factorial(n - 1)
   print(factorial(5))
   """
   result = tool.invoke(code)
   print(result)
   # Output: 120
   ```

3. **Agent with Python REPL**:
   ```python
   from langchain.agents import create_react_agent, AgentExecutor
   from langchain_core.prompts import PromptTemplate
   from langchain_community.llms import FakeListLLM

   llm = FakeListLLM(responses=["Calculate 10 factorial"])
   tools = [PythonREPLTool()]
   prompt = PromptTemplate.from_template("Answer: {input}")
   agent = create_react_agent(llm, tools, prompt)
   executor = AgentExecutor(agent=agent, tools=tools)
   result = executor.invoke({"input": "What's 10 factorial?"})
   print(result)
   # Output: 3628800
   ```

**Commands**:
- `tool.invoke(code)`: Executes the provided Python code.
- `tool.ainvoke(code)`: Asynchronous execution.
- `PythonREPLTool()`: Initializes the tool with no arguments.

**Use Cases**:
- Dynamic calculations in chatbots (e.g., math solvers).
- Data processing for small datasets.
- Testing code snippets in development workflows.

**Security Note**: Avoid running untrusted code to prevent security risks (e.g., `os.system` calls).

## 5. PlayWright Browser Toolkit

**Description**: Automates browser tasks like navigating URLs or extracting content. Free with Playwright installation.

**Setup Instructions**:
1. Install Playwright and its LangChain integration:
   ```bash
   pip install playwright langchain-community
   playwright install
   ```
2. Ensure a compatible browser (e.g., Chromium) is installed via Playwright.

**Code Examples**:

1. **Navigate to URL**:
   ```python
   from langchain_community.tools.playwright import GotoTool
   from langchain_community.tools import PlayWrightBrowserToolkit
   from playwright.sync_api import sync_playwright

   with sync_playwright() as p:
       browser = p.chromium.launch()
       toolkit = PlayWrightBrowserToolkit.from_browser(sync_browser=browser)
       tool = toolkit.get_tools()[0]  # GotoTool
       result = tool.invoke({"url": "https://example.com"})
       print(result)
       # Output: Page content or navigation confirmation
   ```

2. **Extract Content**:
   ```python
   from langchain_community.tools.playwright import ExtractTextTool
   from playwright.sync_api import sync_playwright

   with sync_playwright() as p:
       browser = p.chromium.launch()
       toolkit = PlayWrightBrowserToolkit.from_browser(sync_browser=browser)
       tool = next(t for t in toolkit.get_tools() if isinstance(t, ExtractTextTool))
       result = tool.invoke({"url": "https://example.com"})
       print(result)
       # Output: Extracted text from the webpage
   ```

3. **Async Agent Integration**:
   ```python
   import asyncio
   from langchain.agents import create_react_agent, AgentExecutor
   from langchain_core.prompts import PromptTemplate
   from langchain_community.llms import FakeListLLM
   from langchain_community.tools import PlayWrightBrowserToolkit
   from playwright.async_api import async_playwright

   async def main():
       async with async_playwright() as p:
           browser = await p.chromium.launch()
           toolkit = PlayWrightBrowserToolkit.from_browser(async_browser=browser)
           tools = toolkit.get_tools()
           llm = FakeListLLM(responses=["Go to example.com"])
           prompt = PromptTemplate.from_template("Answer: {input}")
           agent = create_react_agent(llm, tools, prompt)
           executor = AgentExecutor(agent=agent, tools=tools)
           result = await executor.ainvoke({"input": "Visit example.com"})
           print(result)

   asyncio.run(main())
   # Output: Navigation result or page content
   ```

**Commands**:
- `tool.invoke({"url": "https://example.com"})`: Executes a browser action (e.g., navigate, extract).
- `tool.ainvoke(input)`: Asynchronous execution for async Playwright.
- `toolkit.get_tools()`: Returns a list of Playwright tools (e.g., GotoTool, ExtractTextTool).
- `PlayWrightBrowserToolkit.from_browser(sync_browser=browser)`: Initializes with a browser instance.

**Use Cases**:
- Web scraping for dynamic content.
- Automating browser-based tasks (e.g., form submission).
- Testing web applications in CI/CD pipelines.

## 6. Github Toolkit

**Description**: Interacts with GitHub repositories (e.g., fetch issues, create PRs). Free for personal projects with a GitHub token.

**Setup Instructions**:
1. Install the GitHub integration:
   ```bash
   pip install pygithub
   ```
2. Generate a GitHub personal access token at [github.com/settings/tokens](https://github.com/settings/tokens).
3. Set the token as an environment variable:
   ```bash
   export GITHUB_TOKEN="your_token"
   ```

**Code Examples**:

1. **List Repository Issues**:
   ```python
   from langchain_community.tools import GithubToolkit
   from langchain_community.utilities import GithubAPIWrapper

   api_wrapper = GithubAPIWrapper(github_token="your_token")
   toolkit = GithubToolkit.from_github_api_wrapper(api_wrapper)
   tool = next(t for t in toolkit.get_tools() if t.name == "get_issues")
   result = tool.invoke({"repo": "langchain-ai/langchain", "action": "get_issues"})
   print(result)
   # Output: List of issues in the repository
   ```

2. **Create Issue**:
   ```python
   api_wrapper = GithubAPIWrapper(github_token="your_token")
   toolkit = GithubToolkit.from_github_api_wrapper(api_wrapper)
   tool = next(t for t in toolkit.get_tools() if t.name == "create_issue")
   result = tool.invoke({
       "repo": "username/repo",
       "title": "New Bug",
       "body": "Description of the bug"
   })
   print(result)
   # Output: Confirmation of issue creation
   ```

3. **Agent Workflow**:
   ```python
   from langchain.agents import create_react_agent, AgentExecutor
   from langchain_core.prompts import PromptTemplate
   from langchain_community.llms import FakeListLLM

   llm = FakeListLLM(responses=["List issues in langchain-ai/langchain"])
   api_wrapper = GithubAPIWrapper(github_token="your_token")
   toolkit = GithubToolkit.from_github_api_wrapper(api_wrapper)
   tools = toolkit.get_tools()
   prompt = PromptTemplate.from_template("Answer: {input}")
   agent = create_react_agent(llm, tools, prompt)
   executor = AgentExecutor(agent=agent, tools=tools)
   result = executor.invoke({"input": "Show issues in langchain-ai/langchain"})
   print(result)
   # Output: List of issues
   ```

**Commands**:
- `tool.invoke({"repo": "owner/repo", "action": "action_name"})`: Executes a GitHub action.
- `toolkit.get_tools()`: Returns available GitHub tools (e.g., get_issues, create_issue).
- `api_wrapper.github_token`: Sets the GitHub token for authentication.

**Use Cases**:
- Automating repository management (e.g., issue tracking).
- Developer tools for CI/CD pipelines.
- Chatbots for reporting bugs or PRs.

## 7. Gitlab Toolkit

**Description**: Manages GitLab projects (e.g., list issues, create merges). Free for personal projects with a GitLab token.

**Setup Instructions**:
1. Install the GitLab integration:
   ```bash
   pip install python-gitlab
   ```
2. Generate a GitLab personal access token at [gitlab.com/-/profile/personal_access_tokens](https://gitlab.com/-/profile/personal_access_tokens).
3. Set the token:
   ```bash
   export GITLAB_TOKEN="your_token"
   ```

**Code Examples**:

1. **List Issues**:
   ```python
   from langchain_community.tools import GitlabToolkit
   from langchain_community.utilities import GitlabAPIWrapper

   api_wrapper = GitlabAPIWrapper(gitlab_token="your_token")
   toolkit = GitlabToolkit.from_gitlab_api_wrapper(api_wrapper)
   tool = next(t for t in toolkit.get_tools() if t.name == "list_issues")
   result = tool.invoke({"project": "username/project", "action": "list_issues"})
   print(result)
   # Output: List of issues in the project
   ```

2. **Create Merge Request**:
   ```python
   api_wrapper = GitlabAPIWrapper(gitlab_token="your_token")
   toolkit = GitlabToolkit.from_gitlab_api_wrapper(api_wrapper)
   tool = next(t for t in toolkit.get_tools() if t.name == "create_merge_request")
   result = tool.invoke({
       "project": "username/project",
       "source_branch": "feature",
       "target_branch": "main",
       "title": "New Feature"
   })
   print(result)
   # Output: Confirmation of merge request creation
   ```

3. **Agent Integration**:
   ```python
   from langchain.agents import create_react_agent, AgentExecutor
   from langchain_core.prompts import PromptTemplate
   from langchain_community.llms import FakeListLLM

   llm = FakeListLLM(responses=["List issues in my_project"])
   api_wrapper = GitlabAPIWrapper(gitlab_token="your_token")
   toolkit = GitlabToolkit.from_gitlab_api_wrapper(api_wrapper)
   tools = toolkit.get_tools()
   prompt = PromptTemplate.from_template("Answer: {input}")
   agent = create_react_agent(llm, tools, prompt)
   executor = AgentExecutor(agent=agent, tools=tools)
   result = executor.invoke({"input": "Show issues in my_project"})
   print(result)
   # Output: List of issues
   ```

**Commands**:
- `tool.invoke({"project": "owner/project", "action": "action_name"})`: Executes a GitLab action.
- `toolkit.get_tools()`: Returns available GitLab tools.
- `api_wrapper.gitlab_token`: Sets the GitLab token.

**Use Cases**:
- Automating CI/CD workflows.
- Project management bots for issue tracking.
- Collaborative development tools.

## 8. Gmail Toolkit

**Description**: Automates Gmail tasks (e.g., sending/reading emails). Free with Google API limits (250 quota units/second).

**Setup Instructions**:
1. Install the Google API client:
   ```bash
   pip install google-auth-oauthlib google-api-python-client
   ```
2. Set up Google Cloud credentials:
   - Create a project in [console.cloud.google.com](https://console.cloud.google.com).
   - Enable the Gmail API.
   - Download OAuth 2.0 credentials (JSON file).
   - Set the credentials file path:
     ```bash
     export GOOGLE_APPLICATION_CREDENTIALS="path/to/credentials.json"
     ```
3. Install LangChain Gmail integration:
   ```bash
   pip install langchain-community
   ```

**Code Examples**:

1. **Send Email**:
   ```python
   from langchain_community.tools import GmailToolkit
   from langchain_community.tools.gmail.send_message import GmailSendMessage

   toolkit = GmailToolkit()
   tool = next(t for t in toolkit.get_tools() if isinstance(t, GmailSendMessage))
   result = tool.invoke({
       "action": "send_email",
       "to": "recipient@example.com",
       "subject": "Test Email",
       "body": "Hello from LangChain!"
   })
   print(result)
   # Output: Email sent confirmation
   ```

2. **Search Emails**:
   ```python
   from langchain_community.tools.gmail.search import GmailSearch

   toolkit = GmailToolkit()
   tool = next(t for t in toolkit.get_tools() if isinstance(t, GmailSearch))
   result = tool.invoke({"query": "from:sender@example.com"})
   print(result)
   # Output: List of matching emails
   ```

3. **Agent Workflow**:
   ```python
   from langchain.agents import create_react_agent, AgentExecutor
   from langchain_core.prompts import PromptTemplate
   from langchain_community.llms import FakeListLLM

   llm = FakeListLLM(responses=["Send email to test@example.com"])
   toolkit = GmailToolkit()
   tools = toolkit.get_tools()
   prompt = PromptTemplate.from_template("Answer: {input}")
   agent = create_react_agent(llm, tools, prompt)
   executor = AgentExecutor(agent=agent, tools=tools)
   result = executor.invoke({"input": "Send a test email to test@example.com"})
   print(result)
   # Output: Email sent confirmation
   ```

**Commands**:
- `tool.invoke({"action": "send_email", ...})`: Sends an email with specified parameters.
- `tool.invoke({"query": "search_query"})`: Searches emails based on a query.
- `toolkit.get_tools()`: Returns Gmail tools (e.g., SendMessage, Search).
- `tool.ainvoke(input)`: Asynchronous execution.

**Use Cases**:
- Customer service bots sending automated replies.
- Email summarization for productivity tools.
- Notification systems integrated with Gmail.

## 9. Slack Toolkit

**Description**: Interacts with Slack (e.g., send messages, list channels). Free with a Slack bot token.

**Setup Instructions**:
1. Install the Slack integration:
   ```bash
   pip install slack_sdk
   ```
2. Create a Slack app at [api.slack.com/apps](https://api.slack.com/apps).
3. Generate a bot token with permissions (e.g., `chat:write`, `channels:read`).
4. Set the token:
   ```bash
   export SLACK_BOT_TOKEN="your_token"
   ```

**Code Examples**:

1. **Send Message**:
   ```python
   from langchain_community.tools import SlackToolkit
   from langchain_community.tools.slack.send_message import SlackSendMessage

   toolkit = SlackToolkit(slack_token="your_token")
   tool = next(t for t in toolkit.get_tools() if isinstance(t, SlackSendMessage))
   result = tool.invoke({
       "action": "send_message",
       "channel": "general",
       "message": "Hello from LangChain!"
   })
   print(result)
   # Output: Message sent confirmation
   ```

2. **List Channels**:
   ```python
   from langchain_community.tools.slack.list_channels import SlackListChannels

   toolkit = SlackToolkit(slack_token="your_token")
   tool = next(t for t in toolkit.get_tools() if isinstance(t, SlackListChannels))
   result = tool.invoke({})
   print(result)
   # Output: List of available channels
   ```

3. **Agent Integration**:
   ```python
   from langchain.agents import create_react_agent, AgentExecutor
   from langchain_core.prompts import PromptTemplate
   from langchain_community.llms import FakeListLLM

   llm = FakeListLLM(responses=["Send message to #general"])
   toolkit = SlackToolkit(slack_token="your_token")
   tools = toolkit.get_tools()
   prompt = PromptTemplate.from_template("Answer: {input}")
   agent = create_react_agent(llm, tools, prompt)
   executor = AgentExecutor(agent=agent, tools=tools)
   result = executor.invoke({"input": "Send 'Hi' to #general"})
   print(result)
   # Output: Message sent confirmation
   ```

**Commands**:
- `tool.invoke({"action": "send_message", ...})`: Sends a message to a Slack channel.
- `tool.invoke({})`: Lists channels or performs other actions.
- `toolkit.get_tools()`: Returns Slack tools.
- `tool.ainvoke(input)`: Asynchronous execution.

**Use Cases**:
- Team notification bots.
- Slack-integrated chatbots for task updates.
- Automating communication in workflows.

## 10. SQLDatabase Toolkit

**Description**: Executes SQL queries on databases (e.g., SQLite, PostgreSQL). Free with a local or hosted database.

**Setup Instructions**:
1. Install the SQL integration:
   ```bash
   pip install sqlalchemy
   ```
2. Set up a database (e.g., SQLite):
   ```bash
   sqlite3 example.db
   sqlite> CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT);
   sqlite> INSERT INTO users (name) VALUES ('Alice');
   ```
3. Note the database URI (e.g., `sqlite:///example.db`).

**Code Examples**:

1. **Run SQL Query**:
   ```python
   from langchain_community.tools import SQLDatabaseToolkit
   from langchain_community.utilities import SQLDatabase

   db = SQLDatabase.from_uri("sqlite:///example.db")
   toolkit = SQLDatabaseToolkit(db=db, llm=None)
   tool = next(t for t in toolkit.get_tools() if t.name == "sql_db_query")
   result = tool.invoke("SELECT * FROM users LIMIT 1")
   print(result)
   # Output: [(1, 'Alice')]
   ```

2. **Schema Inspection**:
   ```python
   from langchain_community.tools.sql_database.tool import InfoSQLDatabaseTool

   db = SQLDatabase.from_uri("sqlite:///example.db")
   toolkit = SQLDatabaseToolkit(db=db, llm=None)
   tool = next(t for t in toolkit.get_tools() if isinstance(t, InfoSQLDatabaseTool))
   result = tool.invoke({})
   print(result)
   # Output: Database schema (e.g., table names, columns)
   ```

3. **Agent with SQL**:
   ```python
   from langchain.agents import create_react_agent, AgentExecutor
   from langchain_core.prompts import PromptTemplate
   from langchain_community.llms import FakeListLLM

   llm = FakeListLLM(responses=["Query users table"])
   db = SQLDatabase.from_uri("sqlite:///example.db")
   toolkit = SQLDatabaseToolkit(db=db, llm=llm)
   tools = toolkit.get_tools()
   prompt = PromptTemplate.from_template("Answer: {input}")
   agent = create_react_agent(llm, tools, prompt)
   executor = AgentExecutor(agent=agent, tools=tools)
   result = executor.invoke({"input": "List all users"})
   print(result)
   # Output: Users from the database
   ```

**Commands**:
- `tool.invoke(query)`: Executes an SQL query.
- `tool.invoke({})`: Inspects database schema.
- `toolkit.get_tools()`: Returns SQL tools (e.g., QuerySQLTool, InfoSQLDatabaseTool).
- `db.from_uri(uri)`: Connects to the database.

**Use Cases**:
- Data-driven chatbots (e.g., customer data lookup).
- Analytics tools querying databases.
- Internal dashboards with natural language queries.

## 11. Tavily Search

**Description**: Web search API with 1000 free searches/month. Returns URLs, content, titles, and optional images/answers.

**Setup Instructions**:
1. Sign up at [tavily.com](https://tavily.com) to get a free API key.
2. Set the API key:
   ```bash
   export TAVILY_API_KEY="your_api_key"
   ```
3. Install the integration:
   ```bash
   pip install tavily
   ```

**Code Examples**:

1. **Basic Search**:
   ```python
   from langchain_community.tools.tavily_search import TavilySearchResults

   tool = TavilySearchResults(max_results=2, api_key="your_api_key")
   result = tool.invoke("Latest AI news")
   print(result)
   # Output: List of search results with URLs, content, and titles
   ```

2. **Answer-Focused Search**:
   ```python
   from langchain_community.tools.tavily_search import TavilyAnswer

   tool = TavilyAnswer(max_results=1, api_key="your_api_key")
   result = tool.invoke("What is LangChain used for?")
   print(result)
   # Output: Direct answer summarizing LangChain's purpose
   ```

3. **Agent Integration**:
   ```python
   from langchain.agents import create_react_agent, AgentExecutor
   from langchain_core.prompts import PromptTemplate
   from langchain_community.llms import FakeListLLM

   llm = FakeListLLM(responses=["Search for AI trends"])
   tools = [TavilySearchResults(max_results=2, api_key="your_api_key")]
   prompt = PromptTemplate.from_template("Answer: {input}")
   agent = create_react_agent(llm, tools, prompt)
   executor = AgentExecutor(agent=agent, tools=tools)
   result = executor.invoke({"input": "What are AI trends in 2025?"})
   print(result)
   # Output: AI trend results from Tavily
   ```

**Commands**:
- `tool.invoke(query)`: Executes a search.
- `tool.ainvoke(query)`: Asynchronous execution.
- `TavilySearchResults(max_results=n)`: Limits results.
- `TavilyAnswer()`: Returns a summarized answer instead of raw results.

**Use Cases**:
- Real-time research for chatbots or agents.
- Summarizing web content for reports.
- Grounding LLMs with current data.

## 12. You.com Search

**Description**: Web search with a 60-day free trial. Returns URLs, titles, and page content.

**Setup Instructions**:
1. Sign up at [you.com](https://you.com) for an API key.
2. Set the API key:
   ```bash
   export YOU_API_KEY="your_api_key"
   ```
3. Install the integration:
   ```bash
   pip install youcom
   ```

**Code Examples**:

1. **Basic Search**:
   ```python
   from langchain_community.tools import YouSearchTool

   tool = YouSearchTool(api_key="your_api_key")
   result = tool.invoke("AI trends 2025")
   print(result)
   # Output: Search results with URLs, titles, and content
   ```

2. **Customized Search**:
   ```python
   tool = YouSearchTool(api_key="your_api_key", max_results=3)
   result = tool.invoke("Python frameworks")
   print(result)
   # Output: Top 3 results for Python frameworks
   ```

3. **Agent Workflow**:
   ```python
   from langchain.agents import create_react_agent, AgentExecutor
   from langchain_core.prompts import PromptTemplate
   from langchain_community.llms import FakeListLLM

   llm = FakeListLLM(responses=["Search for AI news"])
   tools = [YouSearchTool(api_key="your_api_key")]
   prompt = PromptTemplate.from_template("Answer: {input}")
   agent = create_react_agent(llm, tools, prompt)
   executor = AgentExecutor(agent=agent, tools=tools)
   result = executor.invoke({"input": "Latest AI news"})
   print(result)
   # Output: AI news from You.com
   ```

**Commands**:
- `tool.invoke(query)`: Executes a search.
- `tool.ainvoke(query)`: Asynchronous execution.
- `YouSearchTool(max_results=n)`: Limits results.
- `YouSearchTool(api_key="key")`: Sets the API key.

**Use Cases**:
- Research agents fetching current web data.
- Chatbots needing external information.
- Temporary projects leveraging the 60-day free trial.

## 13. Exa Search

**Description**: Web search optimized for LLMs, with 1000 free searches/month. Returns URLs, authors, titles, and dates.

**Setup Instructions**:
1. Sign up at [exa.ai](https://exa.ai) for a free API key.
2. Set the API key:
   ```bash
   export EXA_API_KEY="your_api_key"
   ```
3. Install the integration:
   ```bash
   pip install exa-py
   ```

**Code Examples**:

1. **Basic Search**:
   ```python
   from langchain_community.tools import ExaSearchTool

   tool = ExaSearchTool(api_key="your_api_key", max_results=2)
   result = tool.invoke("Machine learning frameworks")
   print(result)
   # Output: Search results with URLs, authors, titles, and dates
   ```

2. **Filtered Search**:
   ```python
   tool = ExaSearchTool(api_key="your_api_key", max_results=1, type="neural")
   result = tool.invoke("Deep learning trends")
   print(result)
   # Output: Neural-focused search result
   ```

3. **Agent Integration**:
   ```python
   from langchain.agents import create_react_agent, AgentExecutor
   from langchain_core.prompts import PromptTemplate
   from langchain_community.llms import FakeListLLM

   llm = FakeListLLM(responses=["Search for ML frameworks"])
   tools = [ExaSearchTool(api_key="your_api_key")]
   prompt = PromptTemplate.from_template("Answer: {input}")
   agent = create_react_agent(llm, tools, prompt)
   executor = AgentExecutor(agent=agent, tools=tools)
   result = executor.invoke({"input": "Best ML frameworks?"})
   print(result)
   # Output: ML framework results from Exa
   ```

**Commands**:
- `tool.invoke(query)`: Executes a search.
- `tool.ainvoke(query)`: Asynchronous execution.
- `ExaSearchTool(max_results=n)`: Limits results.
- `ExaSearchTool(type="neural")`: Uses neural search for better relevance.

**Use Cases**:
- Research tools for academic or technical queries.
- LLM grounding for precise, recent information.
- Data collection for reports or summaries.

## Notes
- **API Keys**: Tools like Tavily, You.com, Exa, Github, Gitlab, Gmail, and Slack require free API keys or tokens. Follow setup instructions to obtain them.
- **Security**: Python REPL and SQLDatabase tools should handle untrusted inputs carefully to avoid code injection or data exposure.
- **Async Support**: Most tools support `ainvoke` for asynchronous execution, ideal for performance in production systems.
- **Free Tier Limits**:
  - Tavily/Exa: 1000 searches/month.
  - You.com: Free for 60 days.
  - Gmail: 250 quota units/second.
  - Others (Wikipedia, DuckDuckGo, PlayWright, SQLDatabase): No limits with proper setup.
- **Mock LLM**: Examples use `FakeListLLM` for simplicity. Replace with a real LLM (e.g., `langchain_openai.OpenAI`) in production.

## Conclusion
These free LangChain tools enable powerful LLM applications, from web searches (DuckDuckGo, Tavily, Exa, You.com) to productivity automation (Github, Gitlab, Gmail, Slack) and data processing (Python REPL, SQLDatabase). The code examples demonstrate basic usage, customization, and agent integration, making them suitable for chatbots, research tools, and automation workflows. For further details, refer to the [LangChain documentation](https://python.langchain.com/docs/integrations/tools/) or LangChain Academy tutorials.

**Sources**:
- LangChain Documentation: [python.langchain.com/docs/integrations/tools/](https://python.langchain.com/docs/integrations/tools/),,,,
- Community insights and setup guides from LangChain tutorials.
