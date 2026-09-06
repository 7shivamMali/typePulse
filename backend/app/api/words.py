from fastapi import APIRouter, Query
from typing import List, Optional
import json
import random
from pathlib import Path

router = APIRouter(prefix="/words", tags=["words"])

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "words_en.json"

def load_word_data():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

word_cache = load_word_data()

PUNCTUATION_MARKS = [".", ",", "!", "?", ";", ":", "-", "--", "\"", "'"]

@router.get("", response_model=dict)
def get_words(
    count: int = Query(default=30, ge=5, le=200),
    punctuation: bool = Query(default=False),
    numbers: bool = Query(default=False),
    mode: str = Query(default="words", pattern="^(words|quote)$")
):
    """
    Returns randomized words or a famous developer quote.
    """
    if mode == "quote":
        quotes = word_cache.get("quotes", [])
        chosen = random.choice(quotes)
        return {
            "mode": "quote",
            "text": chosen["text"],
            "author": chosen["author"],
            "words": chosen["text"].split(" ")
        }

    common_words = word_cache.get("common_words", ["typing", "speed", "test"])
    selected_words = random.choices(common_words, k=count)
    
    formatted_words = []
    for i, w in enumerate(selected_words):
        word = w
        # Inject numbers occasionally if requested (~15% chance)
        if numbers and random.random() < 0.15:
            num = str(random.randint(0, 999))
            if random.random() < 0.5:
                word = num
            else:
                word = f"{word}{num}"
        
        # Inject punctuation if requested (~20% chance)
        if punctuation and random.random() < 0.20 and not word.isdigit():
            punct = random.choice([".", ",", "!", "?", ";"])
            # Capitalize first word or word after period
            if i == 0 or (i > 0 and formatted_words[-1].endswith(".")):
                word = word.capitalize()
            word = f"{word}{punct}"
        elif i == 0 and punctuation:
            word = word.capitalize()

        formatted_words.append(word)

    return {
        "mode": "words",
        "count": len(formatted_words),
        "text": " ".join(formatted_words),
        "words": formatted_words
    }
