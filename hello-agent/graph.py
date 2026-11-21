from typing import TypedDict, Annotated, List
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition
from tools import (
    create_project_folder,
    list_projects_and_files,
    read_file,
    write_file,
    open_in_vscode,
)
from dotenv import load_dotenv

load_dotenv()

class AgentState(TypedDict):
    messages: Annotated[List, add_messages]

llm = ChatGoogleGenerativeAI(model="gemini-3.8-flash", temperature=0.2)

tools = [
    create_project_folder,
    list_projects_and_files,
    read_file,
    write_file,
    open_in_vscode,
]
llm_with_tools = llm.bind_tools(tools)

SYSTEM_PROMPT = SystemMessage(content="""
You are VoiceDev AI, an expert voice-controlled Frontend Developer specializing in HTML, CSS, JavaScript, and GSAP animations.

Rules:
1. For NEW projects: Create a folder (`create_project_folder`), write clean `index.html`, `style.css`, and `script.js` files (`write_file`), and open it (`open_in_vscode`).
2. For UPDATING existing projects: First call `list_projects_and_files` and `read_file` to inspect the existing code, then apply the requested changes with `write_file`.
3. Keep your final spoken response short, natural, and conversational (1-2 sentences) since it will be read aloud to the user. Never read raw code aloud.
""")

async def agent_node(state: AgentState):
    messages = [SYSTEM_PROMPT] + state["messages"]
    response = await llm_with_tools.ainvoke(messages)
    return {"messages": [response]}

builder = StateGraph(AgentState)
builder.add_node("agent", agent_node)
builder.add_node("tools", ToolNode(tools))

builder.add_edge(START, "agent")
builder.add_conditional_edges("agent", tools_condition)
builder.add_edge("tools", "agent")

# MemorySaver lets the agent remember previous voice commands in the session
memory = MemorySaver()
coding_graph = builder.compile(checkpointer=memory)