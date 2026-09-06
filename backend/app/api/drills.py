from fastapi import APIRouter, Query, Depends
from typing import Optional, List
import random
from pathlib import Path
import json

from app.core.security import get_current_user_optional
from app.db.models import User
from app.db.session import get_session
from sqlmodel import Session

router = APIRouter(prefix="/drills", tags=["drills"])

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "words_en.json"

def load_word_data():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

word_cache = load_word_data().get("common_words", [])

@router.get("/generate")
def generate_drill(
    keys: str = Query(default="th,in,er", description="Comma-separated problematic letters or bigrams"),
    count: int = Query(default=25, ge=10, le=60)
):
    """
    Generates a targeted drill paragraph concentrating heavily on the specified weak keys/bigrams.
    """
    target_keys = [k.strip().lower() for k in keys.split(",") if k.strip()]
    if not target_keys:
        target_keys = ["t", "h", "e"]
        
    # Score words based on how many target keys/bigrams they contain
    scored_words = []
    for word in word_cache:
        score = 0
        w_lower = word.lower()
        for tk in target_keys:
            if tk in w_lower:
                score += (2 if len(tk) > 1 else 1) * w_lower.count(tk)
        if score > 0:
            scored_words.append((score, word))
            
    scored_words.sort(key=lambda x: x[0], reverse=True)
    
    # Pick top matching words, plus some standard filler words to maintain natural flow
    top_candidates = [w for _, w in scored_words[:max(40, count)]]
    if len(top_candidates) < count:
        top_candidates.extend(random.choices(word_cache, k=count - len(top_candidates)))
        
    drill_words = random.sample(top_candidates, k=min(count, len(top_candidates)))
    random.shuffle(drill_words)
    
    return {
        "mode": "drill",
        "focused_keys": target_keys,
        "count": len(drill_words),
        "text": " ".join(drill_words),
        "words": drill_words
    }
