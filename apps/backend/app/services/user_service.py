from fastapi import HTTPException, status

from app.models.user import User
from app.repositories.user_repository import UserRepository


class UserService:
    def __init__(self, users: UserRepository) -> None:
        self.users = users

    def get_user(self, user_id: int) -> User:
        user = self.users.get_by_id(user_id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        return user

