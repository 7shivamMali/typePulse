from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List
import json
import random
from pathlib import Path

router = APIRouter(prefix="/code", tags=["code"])

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "code_bank.json"

def load_code_bank():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

code_cache = load_code_bank()

@router.get("", response_model=dict)
def get_code_snippet(
    language: Optional[str] = Query(default=None, pattern="^(python|javascript|sql)$")
):
    """
    Returns a developer code snippet with syntax metadata.
    """
    snippets = code_cache
    if language:
        snippets = [s for s in code_cache if s["language"].lower() == language.lower()]
    
    if not snippets:
        raise HTTPException(status_code=404, detail="No code snippets found for language")
    
    selected = random.choice(snippets)
    # Split into lines and words
    lines = selected["code"].split("\n")
    
    return {
        "id": selected["id"],
        "language": selected["language"],
        "title": selected["title"],
        "code": selected["code"],
        "lines": lines
    }

@router.get("/languages", response_model=List[str])
def get_available_languages():
    languages = list({s["language"] for s in code_cache})
    return sorted(languages)
