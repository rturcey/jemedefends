import hashlib
import secrets
from dataclasses import dataclass
from datetime import datetime

from fastapi import Request, Response


@dataclass(frozen=True)
class SessionConfig:
    """Configuration for session management."""

    cookie_name: str = "jmd_session"
    max_age: int = 86400 * 30  # 30 days
    secure: bool = False  # Set to True in production with HTTPS
    http_only: bool = True
    same_site: str = "lax"


class SessionManager:
    """Manages cookie-based sessions for anonymous users."""

    def __init__(self, config: SessionConfig) -> None:
        self.config = config

    def generate_session_id(self) -> str:
        """Generate a cryptographically secure session ID."""
        timestamp = datetime.now().isoformat()
        random_bytes = secrets.token_bytes(32)

        combined = f"{timestamp}{random_bytes.hex()}"
        return hashlib.sha256(combined.encode()).hexdigest()

    def get_session_id(self, request: Request) -> str:
        """Get session ID from request cookies or generate a new one."""
        session_id = request.cookies.get(self.config.cookie_name)

        if not session_id or not self._is_valid_session_id(session_id):
            session_id = self.generate_session_id()

        return session_id

    def set_session_cookie(
        self,
        response: Response,
        session_id: str,
    ) -> None:
        """Set session cookie in response."""
        response.set_cookie(
            key=self.config.cookie_name,
            value=session_id,
            max_age=self.config.max_age,
            secure=self.config.secure,
            httponly=self.config.http_only,
            samesite=self.config.same_site or "none",
        )

    def _is_valid_session_id(self, session_id: str) -> bool:
        """Validate session ID format and length."""
        if not isinstance(session_id, str):
            return False

        if len(session_id) != 64:  # SHA256 hex length
            return False

        try:
            int(session_id, 16)  # Check if valid hex
            return True
        except ValueError:
            return False
