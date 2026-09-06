from fastapi import APIRouter, Query, Depends
from sqlmodel import Session, select
from typing import List

from app.db.session import get_session
from app.db.models import TestResult, User, LeaderboardEntry

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])

@router.get("", response_model=List[LeaderboardEntry])
def get_leaderboard(
    mode: str = Query(default="time 30"),
    limit: int = Query(default=20, ge=5, le=100),
    session: Session = Depends(get_session)
):
    """
    Returns top ranked typing runs for the requested mode.
    """
    statement = (
        select(TestResult, User)
        .join(User, TestResult.user_id == User.id)
        .where(TestResult.mode == mode)
        .order_by(TestResult.wpm.desc())
        .limit(limit)
    )
    results = session.exec(statement).all()
    
    leaderboard = []
    for rank, (test, user) in enumerate(results, start=1):
        leaderboard.append(
            LeaderboardEntry(
                rank=rank,
                username=user.username,
                wpm=test.wpm,
                raw_wpm=test.raw_wpm,
                accuracy=test.accuracy,
                mode=test.mode,
                created_at=test.created_at
            )
        )
        
    return leaderboard
