from langgraph.graph.message import add_messages
from typing import List, Annotated, Optional,Dict
from typing_extensions import TypedDict
from pydantic import BaseModel, Field


class ProtfolioBlueprint(BaseModel):
    theme_name: str= Field(description="e.g., Cyberpunk Neon, Minimalist Zen, Cosmic")
    color_palette:Dict[str,str]= Field(description="Hex codes for primary, secondary, bg, accent")
    threejs_concept: str = Field(description="Detailed 3D scene description, geometries, lighting, camera behavior")
    sections: List[Dict[str, str]] = Field(description="Ordered page sections: Hero, About, Projects, Contact with exact copy")
    is_complete: bool = Field(default=False, description="True only when all required user info is gathered")


class PortfolioState(TypedDict):
    messages:Annotated[List, add_messages]
    user_profile: Dict[str, str]
    missing_info:List[str]
    blueprint:Optional[ProtfolioBlueprint]
    gernated_files:Dict[str,str]
    build_status:str

    
