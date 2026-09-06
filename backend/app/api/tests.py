from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime

from app.db.session import get_session
from app.db.models import TestResult, TestResultCreate, TestResultRead, User
from app.core.security import get_current_user_optional, get_current_user
from app.core.anti_cheat import validate_keystrokes

router = APIRouter(prefix="/tests", tags=["tests"])

@router.post("", response_model=TestResultRead)
def submit_test(
    test_in: TestResultCreate,
    current_user: Optional[User] = Depends(get_current_user_optional),
    session: Session = Depends(get_session)
):
    # 1. Anti-cheat check
    is_valid, reason = validate_keystrokes(
        wpm=test_in.wpm,
        duration=test_in.duration,
        keystrokes_json=test_in.keystrokes
    )
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Test rejected by integrity check: {reason}"
        )
        
    # 2. Check if Personal Best
    is_pb = False
    user_id = current_user.id if current_user else None
    
    if user_id:
        prev_best = session.exec(
            select(TestResult)
            .where(TestResult.user_id == user_id)
            .where(TestResult.mode == test_in.mode)
            .order_by(TestResult.wpm.desc())
        ).first()
        
        if not prev_best or test_in.wpm > prev_best.wpm:
            is_pb = True
            
    # 3. Create record
    test_record = TestResult(
        user_id=user_id,
        wpm=round(test_in.wpm, 1),
        raw_wpm=round(test_in.raw_wpm, 1),
        accuracy=round(test_in.accuracy, 1),
        consistency=round(test_in.consistency, 1),
        mode=test_in.mode,
        duration=round(test_in.duration, 2),
        characters=test_in.characters,
        keystrokes=test_in.keystrokes,
        is_pb=is_pb,
        created_at=datetime.utcnow()
    )
    session.add(test_record)
    session.commit()
    session.refresh(test_record)
    
    return test_record

@router.get("/history", response_model=List[TestResultRead])
def get_user_history(
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    results = session.exec(
        select(TestResult)
        .where(TestResult.user_id == current_user.id)
        .order_by(TestResult.created_at.desc())
        .limit(limit)
    ).all()
    return results
