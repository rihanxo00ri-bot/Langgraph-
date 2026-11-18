from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from langchain_core.messages import HumanMessage
from graph import coding_graph

app = FastAPI()

app.mount("/preview", StaticFiles(directory="output", html=True), name="preview")

class BuildRequest(BaseModel):
    prompt: str

@app.post("/build")
async def build_site(request: BuildRequest):
    final_state = await coding_graph.ainvoke({
        "messages": [HumanMessage(content=request.prompt)]
    })
    return {"reply": final_state["messages"][-1].content}