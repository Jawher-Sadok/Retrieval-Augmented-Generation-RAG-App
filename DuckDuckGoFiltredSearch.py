from langchain_community.tools import DuckDuckGoSearchResults

tool = DuckDuckGoSearchResults(max_results=2, region="us-en")
result = tool.invoke("AI trends 2025")
print(result)