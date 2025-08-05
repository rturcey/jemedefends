"""Repository for FormDraft using sqlc-generated queries (no SQLAlchemy)."""

from __future__ import annotations

import contextlib
import json
import os
import uuid
from typing import Any, Protocol

from fastapi import Request, Response
from itsdangerous import BadSignature, URLSafeSerializer
from sqlalchemy.ext.asyncio import AsyncConnection

from app.db.generated import form_draft as form_draft_sqlc
from app.models.form_draft import DraftEventType, FormDraft

DRAFT_COOKIE_NAME = os.getenv("DRAFT_COOKIE_NAME", "jmd_draft")
DRAFT_COOKIE_SECRET = os.getenv("DRAFT_COOKIE_SECRET", "change-me-please")
DRAFT_COOKIE_SALT = os.getenv("DRAFT_COOKIE_SALT", "draft-cookie-salt")

_serializer = URLSafeSerializer(DRAFT_COOKIE_SECRET, salt=DRAFT_COOKIE_SALT)


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


def _row_to_form_draft(row: Any) -> FormDraft:
    """Convertit une ligne renvoyée par sqlc en FormDraft (robuste aux formes)."""
    # Selon la génération sqlc, row peut être un objet avec __dict__, un namedtuple,
    # ou un mapping
    if hasattr(row, "__dict__"):
        data = {k: v for k, v in row.__dict__.items() if not k.startswith("_")}
    elif hasattr(row, "_asdict"):
        data = row._asdict()
    else:
        try:
            data = dict(row)
        except Exception as exc:
            raise TypeError(f"Unsupported sqlc row type: {type(row)!r}") from exc
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
        # 1) Si cookie présent et valide → on tente de charger
        if token := request.cookies.get(DRAFT_COOKIE_NAME):
            data = _unsign(token)
            if data and data.get("form_slug") == form_slug:
                draft_id = uuid.UUID(str(data["draft_id"]))
                row = await self._querier.get_draft(id=draft_id)
                if row:
                    return _row_to_form_draft(row)

        # 2) Sinon, on crée un draft
        ip, ua = _client_ip_ua(request)
        row = await self._querier.create_draft(
            form_slug=form_slug,
            last_ip=ip,
            data=json.dumps({}),
            ua=ua,
        )
        draft = _row_to_form_draft(row)

        # Utiliser l'ID renvoyé par la DB (et pas un uuid local)
        response.set_cookie(
            DRAFT_COOKIE_NAME,
            _sign(draft.id, form_slug),
            httponly=True,
            secure=True,
            samesite="lax",
            max_age=60 * 60 * 24 * 30,
        )
        return draft

    async def get_from_cookie(self, request: Request) -> FormDraft | None:
        token = request.cookies.get(DRAFT_COOKIE_NAME)
        if not token:
            return None
        data = _unsign(token)
        if not data:
            return None
        row = await self._querier.get_draft(id=uuid.UUID(str(data["draft_id"])))
        return _row_to_form_draft(row) if row else None

    async def update_data(
        self,
        draft_id: uuid.UUID,
        data: dict[str, Any],
        last_event: str | None = None,
    ) -> None:
        # 🔥 CORRECTION : Récupérer d'abord les données existantes
        existing_row = await self._querier.get_draft(id=draft_id)
        if existing_row and existing_row.data:
            existing_data = existing_row.data
            merged_data = {**existing_data, **data}
        else:
            merged_data = data

        await self._querier.update_draft_data(
            id=draft_id,
            data=json.dumps(merged_data),  # Sauvegarder les données fusionnées
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
        await self._querier.add_draft_event(
            draft_id=draft_id,
            event_type=event_type.value,
            meta=meta or {},
        )
