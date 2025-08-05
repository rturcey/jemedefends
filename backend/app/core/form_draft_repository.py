from __future__ import annotations

import contextlib
import json
import logging
import os
import uuid
from typing import Any, Protocol

from fastapi import Request, Response
from itsdangerous import BadSignature, URLSafeSerializer
from sqlalchemy.ext.asyncio import AsyncConnection

from app.db.generated import form_draft as form_draft_sqlc
from app.models.form_draft import DraftEventType, FormDraft

logger = logging.getLogger(__name__)

DRAFT_COOKIE_NAME = os.getenv("DRAFT_COOKIE_NAME", "jmd_draft")
DRAFT_COOKIE_SECRET = os.getenv("DRAFT_COOKIE_SECRET", "change-me-please")
DRAFT_COOKIE_SALT = os.getenv("DRAFT_COOKIE_SALT", "draft-cookie-salt")

_serializer = URLSafeSerializer(DRAFT_COOKIE_SECRET, salt=DRAFT_COOKIE_SALT)

IS_PRODUCTION = os.getenv("ENVIRONMENT", "development") == "production"


def _sign(draft_id: uuid.UUID, form_slug: str) -> str:
    return _serializer.dumps({"draft_id": str(draft_id), "form_slug": form_slug})


def _unsign(token: str) -> dict[str, Any] | None:
    with contextlib.suppress(BadSignature):
        data: dict[str, Any] = _serializer.loads(token)
        if "draft_id" in data and "form_slug" in data:
            return data
    return None


def _client_ip_ua(request: Request) -> tuple[str | None, str | None]:
    ip = request.headers.get("x-forwarded-for") or (
        request.client.host if request.client else None
    )
    ua = request.headers.get("user-agent")
    return ip, ua


def _safe_json_dumps(data: dict[str, Any]) -> str:
    """Safely serialize data to JSON with UTF-8 encoding."""
    try:
        return json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    except (TypeError, ValueError) as e:
        logger.warning("JSON serialization failed, cleaning data: %s", e)
        # Nettoyer les données problématiques
        cleaned_data = _clean_data_for_json(data)
        return json.dumps(cleaned_data, ensure_ascii=False, separators=(",", ":"))


def _clean_data_for_json(data: Any) -> Any:
    """Recursively clean data to ensure JSON serialization."""
    if isinstance(data, dict):
        return {key: _clean_data_for_json(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [_clean_data_for_json(item) for item in data]
    elif isinstance(data, str):
        # Nettoyer les caractères non-UTF8
        try:
            data.encode("utf-8")
            return data
        except UnicodeEncodeError:
            return data.encode("utf-8", errors="replace").decode("utf-8")
    elif isinstance(data, bytes):
        # Convertir les bytes en string UTF-8
        try:
            return data.decode("utf-8")
        except UnicodeDecodeError:
            return data.decode("utf-8", errors="replace")
    else:
        return data


def _row_to_form_draft(row: Any) -> FormDraft:
    """Convertit une ligne renvoyée par sqlc en FormDraft (robuste aux formes)."""
    if hasattr(row, "__dict__"):
        data = {k: v for k, v in row.__dict__.items() if not k.startswith("_")}
    elif hasattr(row, "_asdict"):
        data = row._asdict()
    else:
        try:
            data = dict(row)
        except Exception as exc:
            raise TypeError(f"Unsupported sqlc row type: {type(row)!r}") from exc

    # Nettoyer les données JSONB si nécessaire
    if data.get("data"):
        try:
            # S'assurer que les données JSON sont propres
            if isinstance(data["data"], str):
                data["data"] = json.loads(data["data"])
            data["data"] = _clean_data_for_json(data["data"])
        except (json.JSONDecodeError, TypeError) as e:
            logger.warning("Failed to clean JSON data: %s", e)
            data["data"] = {}

    return FormDraft(**data)


class FormDraftRepositoryProtocol(Protocol):
    async def get_from_cookie_or_create(
        self, request: Request, response: Response, form_slug: str
    ) -> FormDraft: ...

    async def get_from_cookie(self, request: Request) -> FormDraft | None: ...

    async def update_data(
        self,
        draft_id: uuid.UUID,
        data: dict[str, Any],
        last_event: str | None = None,
    ) -> None: ...

    async def mark_submitted(self, draft_id: uuid.UUID) -> None: ...

    async def add_event(
        self,
        draft_id: uuid.UUID,
        event_type: DraftEventType,
        meta: dict[str, Any] | None,
    ) -> None: ...


class PostgresFormDraftRepository(FormDraftRepositoryProtocol):
    """Repository fin au-dessus du code sqlc (psycopg AsyncConnection)."""

    def __init__(self, db_connection: AsyncConnection):
        self._querier = form_draft_sqlc.AsyncQuerier(db_connection)

    async def get_from_cookie_or_create(
        self, request: Request, response: Response, form_slug: str
    ) -> FormDraft:
        if token := request.cookies.get(DRAFT_COOKIE_NAME):
            data = _unsign(token)
            if data and data.get("form_slug") == form_slug:
                draft_id = uuid.UUID(str(data["draft_id"]))
                row = await self._querier.get_draft(id=draft_id)
                if row:
                    return _row_to_form_draft(row)

        ip, ua = _client_ip_ua(request)
        row = await self._querier.create_draft(
            form_slug=form_slug,
            data=_safe_json_dumps({}),
        )
        draft = _row_to_form_draft(row)

        response.set_cookie(
            DRAFT_COOKIE_NAME,
            _sign(draft.id, form_slug),
            httponly=True,
            secure=IS_PRODUCTION,
            samesite="lax",
            max_age=60 * 60 * 24 * 30,
            path="/",
        )
        return draft

    async def get_from_cookie(self, request: Request) -> FormDraft | None:
        token = request.cookies.get(DRAFT_COOKIE_NAME)
        if not token:
            logger.warning("Cookie %s not found", DRAFT_COOKIE_NAME)
            return None

        data = _unsign(token)
        if not data:
            logger.warning("Failed to unsign token: %s", token[:20])
            return None

        try:
            draft_id = uuid.UUID(str(data["draft_id"]))
            logger.info("Attempting to retrieve draft: %s", draft_id)

            row = await self._querier.get_draft(id=draft_id)
            if row:
                draft = _row_to_form_draft(row)
                logger.info(
                    "Draft retrieved successfully: %s (%d fields)",
                    draft.id,
                    len(draft.data or {}),
                )
                return draft
            else:
                logger.warning("Draft %s not found in database", draft_id)
                return None

        except (ValueError, KeyError) as e:
            logger.error("Error retrieving draft: %s", e)
            return None

    async def update_data(
        self,
        draft_id: uuid.UUID,
        data: dict[str, Any],
        last_event: str | None = None,
    ) -> None:
        existing_row = await self._querier.get_draft(id=draft_id)
        if existing_row and existing_row.data:
            existing_data = existing_row.data
            merged_data = {**existing_data, **data}
        else:
            merged_data = data

        # Nettoyer et sérialiser les données
        cleaned_data = _clean_data_for_json(merged_data)
        json_data = _safe_json_dumps(cleaned_data)

        await self._querier.update_draft_data(
            id=draft_id,
            data=json_data,
            last_event=last_event,
        )

    async def mark_submitted(self, draft_id: uuid.UUID) -> None:
        await self._querier.mark_draft_submitted(id=draft_id)

    async def add_event(
        self,
        draft_id: uuid.UUID,
        event_type: DraftEventType,
        meta: dict[str, Any] | None,
    ) -> None:
        # Nettoyer les métadonnées
        cleaned_meta = _clean_data_for_json(meta or {})
        json_meta = _safe_json_dumps(cleaned_meta)

        await self._querier.add_draft_event(
            draft_id=draft_id,
            event_type=event_type.value,
            meta=json_meta,
        )
