import os
from langchain_core.tools import tool

OUTPUT_DIR= 'output'
os.makedirs(OUTPUT_DIR, exist_ok=True)


@tool
def write_file(filename:str, content:str) -> str:
    """Writes HTML, CSS, or JavaScript code into a file inside the output folder."""

    filepath= os.path.join(OUTPUT_DIR, filename)
    with open(filepath,"w", encoding="utf-8") as f:
        f.write(content)
    return f"Saved {filename} succesfully." 
   
