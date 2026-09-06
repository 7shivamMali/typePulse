from fastapi import APIRouter, Depends, Query, HTTPException
from sqlmodel import Session, select
from typing import Optional
import json

from app.db.session import get_session
from app.db.models import TestResult, User
from app.core.security import get_current_user_optional

router = APIRouter(prefix="/ghost", tags=["ghost"])

@router.get("/pb")
def get_personal_best_ghost(
    mode: str = Query(default="time 30"),
    current_user: Optional[User] = Depends(get_current_user_optional),
    session: Session = Depends(get_session)
):
    """
    Returns the keystroke timeline of the user's personal best in this mode
    to render as an opponent ghost caret.
    """
    if not current_user:
        return {"has_ghost": False, "message": "Sign in to enable personal-best ghost racing"}
        
    best_run = session.exec(
        select(TestResult)
        .where(TestResult.user_id == current_user.id)
        .where(TestResult.mode == mode)
        .where(TestResult.keystrokes.is_not(None))
        .order_by(TestResult.wpm.desc())
    ).first()
    
    if not best_run or not best_run.keystrokes:
        return {"has_ghost": False, "message": "No recorded run with keystroke telemetry for this mode"}
        
    try:
        telemetry = json.loads(best_run.keystrokes)
        return {
            "has_ghost": True,
            "wpm": best_run.wpm,
            "accuracy": best_run.accuracy,
            "created_at": best_run.created_at,
            "timeline": telemetry
        }
    except Exception:
        return {"has_ghost": False, "message": "Corrupt telemetry"}
