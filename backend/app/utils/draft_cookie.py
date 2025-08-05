import os
import uuid

from fastapi import Request
from itsdangerous import BadSignature, URLSafeSerializer

DRAFT_COOKIE_NAME = os.getenv("DRAFT_COOKIE_NAME", "jmd_draft")
DRAFT_COOKIE_SECRET = os.getenv("DRAFT_COOKIE_SECRET", "change-me-please")
DRAFT_COOKIE_SALT = os.getenv("DRAFT_COOKIE_SALT", "draft-cookie-salt")

serializer = URLSafeSerializer(DRAFT_COOKIE_SECRET, salt=DRAFT_COOKIE_SALT)


def sign_draft_token(draft_id: uuid.UUID, form_slug: str) -> str:
    return serializer.dumps({"draft_id": str(draft_id), "form_slug": form_slug})


def unsign_draft_token(token: str) -> dict | None:
    try:
        data = serializer.loads(token)
        return data if "draft_id" in data and "form_slug" in data else None
    except BadSignature:
        return None


def get_client_ip_and_ua(request: Request) -> tuple[str | None, str | None]:
    ip = request.headers.get(
        "x-forwarded-for", request.client.host if request.client else None
    )
    ua = request.headers.get("user-agent")
    return ip, ua
