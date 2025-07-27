from langchain_community.tools import WikipediaQueryRun
from langchain_community.utilities import WikipediaAPIWrapper

def WikipediaTool(Message = "",max_chars=None ,top_results =None ) :
    # Initialize the tool 
    api_wrapper_kwargs = {}
    if max_chars is not None:
        api_wrapper_kwargs["doc_content_chars_max"] = max_chars
    if top_results is not None:
        api_wrapper_kwargs["top_k_results"] = top_results
    
    api_wrapper = WikipediaAPIWrapper(**api_wrapper_kwargs)
    tool = WikipediaQueryRun(api_wrapper=api_wrapper)
    if Message != "" :
        # Query Wikipedia
        result = tool.invoke(Message)
        return result
    else :
        return "No imput given"
    
print (WikipediaTool("Artificial Intelligence",100))
