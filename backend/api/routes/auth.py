"""Authentication routes."""

import logging
from datetime import timedelta
from typing import Any, Dict, List

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from api.users.auth import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    authenticate_user,
    create_access_token,
    get_current_active_user,
)
from api.users.crud import (
    create_user,
    delete_user,
    get_users,
    update_user,
    update_user_password,
)
from api.users.data import User, UserCreate
from api.users.db import get_async_session
from api.users.utils import verify_password


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/auth/signin")
async def signin(
    request: Request,
    db: AsyncSession = Depends(get_async_session),  # noqa: B008
) -> Dict[str, Any]:
    """
    Authenticate a user and return an access token.

    Parameters
    ----------
    request : Request
        The incoming request object.
    db : AsyncSession
        The database session.

    Returns
    -------
    Dict[str, Any]
        A dictionary containing the access token, token type, and user information.

    Raises
    ------
    HTTPException
        If the credentials are invalid or missing.
    """
    data = await request.json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Username and password are required",
        )

    user = await authenticate_user(db, username, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role},
        expires_delta=access_token_expires,
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {"id": user.id, "username": user.username, "role": user.role},
    }


@router.post("/auth/signout")
async def signout(
    request: Request,
    current_user: User = Depends(get_current_active_user),  # noqa: B008
) -> Dict[str, str]:
    """
    Sign out the current user.

    Parameters
    ----------
    request : Request
        The incoming request object.
    current_user : User
        The current authenticated user.

    Returns
    -------
    Dict[str, str]
        A dictionary containing a success message.

    Raises
    ------
    HTTPException
        If the user is not authenticated.
    """
    return {"message": "Successfully signed out"}


@router.get("/auth/session")
async def get_session(
    current_user: User = Depends(get_current_active_user),  # noqa: B008
) -> Dict[str, Any]:
    """
    Get the current user's session information.

    Parameters
    ----------
    current_user : User
        The current authenticated user.

    Returns
    -------
    Dict[str, Any]
        A dictionary containing the user's session information.

    Raises
    ------
    HTTPException
        If the user is not authenticated.
    """
    if current_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return {
        "user": {
            "id": current_user.id,
            "username": current_user.username,
            "email": current_user.email,
            "role": current_user.role,
        }
    }


@router.post("/auth/signup", response_model=User)
async def signup(
    user: UserCreate,
    current_user: User = Depends(get_current_active_user),  # noqa: B008
    db: AsyncSession = Depends(get_async_session),  # noqa: B008
) -> User:
    """
    Create a new user (admin only).

    Parameters
    ----------
    user : UserCreate
        The user data to create.
    current_user : User
        The current authenticated user.
    db : AsyncSession
        The asynchronous database session.

    Returns
    -------
    User
        The created user.

    Raises
    ------
    HTTPException
        If the current user is not an admin.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create users",
        )
    return await create_user(db=db, user=user)


@router.get("/users", response_model=List[User])
async def get_users_(
    current_user: User = Depends(get_current_active_user),  # noqa: B008
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_async_session),  # noqa: B008
) -> List[User]:
    """
    Get a list of users (admin only).

    Parameters
    ----------
    current_user : User
        The current authenticated user.
    skip : int, optional
        The number of users to skip, by default 0.
    limit : int, optional
        The maximum number of users to return, by default 100.
    db : AsyncSession
        The asynchronous database session.

    Returns
    -------
    List[User]
        A list of users.

    Raises
    ------
    HTTPException
        If the current user is not an admin.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view users"
        )
    return list(await get_users(db, skip=skip, limit=limit))


@router.put("/users/{user_id}", response_model=User)
async def update_user_(
    user_id: int,
    user_update: UserCreate,
    current_user: User = Depends(get_current_active_user),  # noqa: B008
    db: AsyncSession = Depends(get_async_session),  # noqa: B008
) -> User:
    """
    Update a user (admin only).

    Parameters
    ----------
    user_id : int
        The ID of the user to update.
    user_update : UserCreate
        The updated user data.
    current_user : User
        The current authenticated user.
    db : AsyncSession
        The asynchronous database session.

    Returns
    -------
    User
        The updated user.

    Raises
    ------
    HTTPException
        If the current user is not an admin.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update users",
        )
    return await update_user(db=db, user_id=user_id, user_update=user_update)


@router.post("/auth/update-password")
async def update_password(
    request: Request,
    current_user: User = Depends(get_current_active_user),  # noqa: B008
    db: AsyncSession = Depends(get_async_session),  # noqa: B008
) -> Dict[str, str]:
    """
    Update the current user's password.

    Parameters
    ----------
    request : Request
        The incoming request object.
    current_user : User
        The current authenticated user.
    db : AsyncSession
        The database session.

    Returns
    -------
    Dict[str, str]
        A dictionary containing a success message.

    Raises
    ------
    HTTPException
        If the current password is incorrect or the new password is invalid.
    """
    data = await request.json()
    current_password = data.get("currentPassword")
    new_password = data.get("newPassword")

    if not current_password or not new_password:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Current password and new password are required",
        )

    if not verify_password(current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect current password",
        )

    try:
        await update_user_password(db, current_user.id, new_password)
        await db.commit()
    except HTTPException as he:
        # Re-raise HTTP exceptions
        raise he
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while updating the password",
        ) from e

    return {"message": "Password updated successfully"}


@router.delete("/users/{user_id}")
async def delete_user_(
    user_id: int,
    current_user: User = Depends(get_current_active_user),  # noqa: B008
    db: AsyncSession = Depends(get_async_session),  # noqa: B008
) -> Dict[str, str]:
    """
    Delete a user (admin only).

    Parameters
    ----------
    user_id : int
        The ID of the user to delete.
    current_user : User
        The current authenticated user.
    db : AsyncSession
        The asynchronous database session.

    Returns
    -------
    Dict[str, str]
        A dictionary containing a success message.

    Raises
    ------
    HTTPException
        If the current user is not an admin or if the user is not found.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete users",
        )

    success = await delete_user(db=db, user_id=user_id)
    if success:
        return {"message": "User deleted successfully"}
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
