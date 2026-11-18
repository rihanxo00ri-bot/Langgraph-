from typing import TypedDict, Annotated, List
from langgraph.graph import StateGraph, START, END
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition
from tools import write_file
from dotenv import load_dotenv

load_dotenv()

class AgentState(TypedDict):
    messages: Annotated[List, add_messages]

llm = ChatGoogleGenerativeAI(model="gemini-3.6-flash", temperature=0.2)
tools = [write_file]
llm_with_tools = llm.bind_tools(tools)

SYSTEM_PROMPT = SystemMessage(content="""
You are an expert Frontend Developer specializing in HTML, CSS, JavaScript, and GSAP animations.
When asked to build a web component or page, ALWAYS use the `write_file` tool to save clean, complete files (e.g., index.html, style.css, script.js) instead of just pasting code in your reply.
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

coding_graph = builder.compile()