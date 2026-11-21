import os
import sys
import socket
import subprocess
import webbrowser
from langchain_core.tools import tool


BASE_OUTPUT_DIR = os.path.abspath("output")
os.makedirs(BASE_OUTPUT_DIR, exist_ok=True)

def _safe_path(relative_path: str) -> str:
    target = os.path.abspath(os.path.join(BASE_OUTPUT_DIR, relative_path))
    if not target.startswith(BASE_OUTPUT_DIR):
        raise ValueError("Access denied: Path escapes output directory.")
    return target

def _get_free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


@tool
def create_project_folder(folder_name: str) -> str:
    """Creates a new project folder inside the output directory."""
    folder_path = _safe_path(folder_name)
    os.makedirs(folder_path, exist_ok=True)
    return f"Created project folder: {folder_name}"


@tool
def list_projects_and_files() -> list[str]:
    """Lists all existing project folders and files inside output so you can inspect or update them."""
    items = []
    for root, _, filenames in os.walk(BASE_OUTPUT_DIR):
        for name in filenames:
            rel_path = os.path.relpath(os.path.join(root, name), BASE_OUTPUT_DIR)
            items.append(rel_path.replace("\\", "/"))
    return items if items else ["No projects found yet."]

@tool
def read_file(filepath: str) -> str:
    """Reads an existing HTML, CSS, or JS file from output before updating it."""
    full_path = _safe_path(filepath)
    if not os.path.exists(full_path):
        return f"Error: {filepath} does not exist."
    with open(full_path, "r", encoding="utf-8") as f:
        return f.read()

@tool
def write_file(filepath: str, content: str) -> str:
    """Writes or updates an HTML, CSS, or JS file inside output (e.g., 'portfolio/index.html')."""
    full_path = _safe_path(filepath)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)
    return f"Successfully saved {filepath}"

@tool
def open_in_vscode(folder_name: str) -> str:
    """Opens the project folder in VS Code and launches a live browser preview."""
    folder_path = _safe_path(folder_name)
    if not os.path.exists(folder_path):
        return f"Error: Folder '{folder_name}' does not exist."
    
    subprocess.Popen(["code", folder_path], shell=(os.name == "nt"))
    
    port = _get_free_port()
    subprocess.Popen(
        [sys.executable, "-m", "http.server", str(port), "--directory", folder_path],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )
    live_url = f"http://127.0.0.1:{port}/index.html"
    webbrowser.open(live_url)
    return f"Opened '{folder_name}' in VS Code and live preview at {live_url}"