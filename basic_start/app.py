# LNGRAPH HE:LO WORLD PROGRAM
from typing import TypedDict
from langgraph.graph import StateGraph # this is very important

class AgentState(TypedDict):
    message:str

def greeting_node(state: AgentState)->AgentState:
    """ simple Node that adds s greeting function to that state """

    state["message"]="hey " + state['message'] + ' how are you.'
    return state

graph = StateGraph(AgentState)
graph.add_node("greeter", greeting_node)
graph.set_entry_point('greeter')
graph.set_finish_point('greeter')


app=graph.compile()
result =app.invoke({"message":"Rihan"})
res =result['message']
print(res)