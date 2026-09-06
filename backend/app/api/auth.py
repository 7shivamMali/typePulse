from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select, func
from typing import Optional

from app.db.session import get_session
from app.db.models import (
    User, UserCreate, UserLogin, UserRead, Token, TestResult
)
from app.core.security import (
    get_password_hash, verify_password, create_access_token, get_current_user
)

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=Token)
def register(user_in: UserCreate, session: Session = Depends(get_session)):
    # Check username
    existing_user = session.exec(select(User).where(User.username == user_in.username)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username is already taken"
        )
    # Check email
    existing_email = session.exec(select(User).where(User.email == user_in.email)).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered"
        )
        
    hashed_pwd = get_password_hash(user_in.password)
    user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=hashed_pwd
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    
    token = create_access_token({"sub": user.username})
    return Token(
        access_token=token,
        token_type="bearer",
        user=UserRead(id=user.id, username=user.username, email=user.email, created_at=user.created_at)
    )

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == login_data.username)).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
        
    token = create_access_token({"sub": user.username})
    return Token(
        access_token=token,
        token_type="bearer",
        user=UserRead(id=user.id, username=user.username, email=user.email, created_at=user.created_at)
    )

@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Compute summary stats
    results = session.exec(select(TestResult).where(TestResult.user_id == current_user.id)).all()
    total_tests = len(results)
    best_wpm = max((r.wpm for r in results), default=0.0)
    avg_wpm = round(sum(r.wpm for r in results) / total_tests, 1) if total_tests > 0 else 0.0
    avg_acc = round(sum(r.accuracy for r in results) / total_tests, 1) if total_tests > 0 else 0.0
    
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "created_at": current_user.created_at,
        "stats": {
            "total_tests": total_tests,
            "best_wpm": best_wpm,
            "avg_wpm": avg_wpm,
            "avg_accuracy": avg_acc
        }
    }
