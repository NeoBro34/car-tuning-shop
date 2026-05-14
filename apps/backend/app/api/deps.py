from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserRole

bearer_scheme = HTTPBearer()


def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(bearer_scheme)],
    db: Annotated[Session, Depends(get_db)],
) -> User:
    payload = decode_access_token(credentials.credentials)
    user_id = payload.get("sub")

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
        )

    try:
        parsed_user_id = int(user_id)
    except (TypeError, ValueError) as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
        ) from exc

    user = UserRepository(db).get_by_id(parsed_user_id)
    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User is inactive or does not exist",
        )

    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def normalize_role(role: str) -> str:
    legacy_roles = {
        "customer": UserRole.USER.value,
        "user": UserRole.USER.value,
        "admin": UserRole.ADMIN.value,
        "super_admin": UserRole.SUPER_ADMIN.value,
    }
    return legacy_roles.get(role, role).upper()


def require_roles(*allowed_roles: UserRole):
    allowed = {role.value for role in allowed_roles}

    def dependency(current_user: CurrentUser) -> User:
        if normalize_role(current_user.role) not in allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )
        return current_user

    return dependency


def get_current_admin_user(current_user: CurrentUser) -> User:
    if normalize_role(current_user.role) not in {
        UserRole.ADMIN.value,
        UserRole.SUPER_ADMIN.value,
    }:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    return current_user


AdminUser = Annotated[User, Depends(get_current_admin_user)]
SuperAdminUser = Annotated[
    User,
    Depends(require_roles(UserRole.SUPER_ADMIN)),
]
