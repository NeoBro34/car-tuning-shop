from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate


class UserRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_by_id(self, user_id: int) -> User | None:
        return self.db.get(User, user_id)

    def get_by_email(self, email: str) -> User | None:
        statement = select(User).where(User.email == email.lower())
        return self.db.scalar(statement)

    def list(self, limit: int, offset: int) -> list[User]:
        statement = select(User).order_by(User.id).limit(limit).offset(offset)
        return list(self.db.scalars(statement))

    def count(self) -> int:
        return self.db.scalar(select(func.count()).select_from(User)) or 0

    def create(self, payload: UserCreate, hashed_password: str) -> User:
        user = User(
            email=payload.email.lower(),
            full_name=payload.full_name,
            hashed_password=hashed_password,
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def update(self, user: User, data: dict[str, object]) -> User:
        for field, value in data.items():
            setattr(user, field, value)
        self.db.commit()
        self.db.refresh(user)
        return user
