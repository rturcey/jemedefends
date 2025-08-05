"""API endpoints for session management."""

from __future__ import annotations

from typing import Annotated, Any

from fastapi import APIRouter, Depends, Request, Response

from app.core.letter_service import LetterService
from app.core.session_manager import SessionConfig, SessionManager
from app.dependencies import get_letter_service

router = APIRouter()
session_manager = SessionManager(config=SessionConfig())


@router.get("/current")
async def get_current_session(
    request: Request,
    response: Response,
) -> dict[str, str]:
    """Get or create current session.

    Args:
        request: FastAPI request object.
        response: FastAPI response object.

    Returns:
        Dictionary with session ID.
    """
    session_id = session_manager.get_session_id(request)
    session_manager.set_session_cookie(response, session_id)

    return {"session_id": session_id}


@router.get("/letters")
async def get_session_letters(
    request: Request,
    letter_service: Annotated[LetterService, Depends(get_letter_service)],
) -> dict[str, Any]:
    """Get all letters for current session.

    Args:
        request: FastAPI request object.
        letter_service: Letter service dependency.

    Returns:
        Dictionary with session letters, count, and session ID.
    """
    session_id = session_manager.get_session_id(request)
    letters = await letter_service.get_session_letters(session_id)

    return {
        "session_id": session_id,
        "letters": letters,
        "count": len(letters),
    }
