from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime

class UserBase(SQLModel):
    username: str = Field(index=True, unique=True, min_length=3, max_length=32)
    email: str = Field(index=True, unique=True)

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    test_results: List["TestResult"] = Relationship(back_populates="user")

class UserCreate(UserBase):
    password: str = Field(min_length=6)

class UserRead(UserBase):
    id: int
    created_at: datetime

class UserLogin(SQLModel):
    username: str
    password: str

class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead

class TestResultBase(SQLModel):
    wpm: float
    raw_wpm: float
    accuracy: float
    consistency: float
    mode: str
    duration: float
    characters: Optional[str] = None  # e.g., "150/2/0/0" (correct/incorrect/extra/missed)
    keystrokes: Optional[str] = None  # JSON timeline of [char, timestamp_ms]
    is_pb: bool = False

class TestResult(TestResultBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[int] = Field(default=None, foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    user: Optional[User] = Relationship(back_populates="test_results")

class TestResultCreate(TestResultBase):
    user_id: Optional[int] = None

class TestResultRead(TestResultBase):
    id: int
    user_id: Optional[int]
    created_at: datetime

class LeaderboardEntry(SQLModel):
    rank: int
    username: str
    wpm: float
    raw_wpm: float
    accuracy: float
    mode: str
    created_at: datetime
