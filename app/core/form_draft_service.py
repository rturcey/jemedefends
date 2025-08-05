from __future__ import annotations

import logging
from typing import Any
from uuid import UUID

from fastapi import Request, Response

from app.core.form_draft_repository import FormDraftRepositoryProtocol
from app.models.form_draft import DraftEventType, DraftUpdateResult, FormDraft

logger = logging.getLogger(__name__)


class FormDraftService:
    """Unified service for form draft lifecycle.

    Responsibilities:
    - Create/get draft bound to a signed cookie
    - Autosave (local form -> server JSONB)
    - Record funnel events (enum)
    - Mark as submitted
    """

    def __init__(self, repository: FormDraftRepositoryProtocol) -> None:
        self.repo = repository

    # -------------------------
    # Public API
    # -------------------------

    async def get_or_create(
        self, form_slug: str, request: Request, response: Response
    ) -> FormDraft:
        """Return current draft from cookie or create a new one and set cookie."""
        draft = await self.repo.get_from_cookie_or_create(request, response, form_slug)
        logger.debug("Draft loaded/created: %s (%s)", draft.id, draft.form_slug)
        return draft

    async def get_current(self, request: Request) -> FormDraft | None:
        """Return current draft from cookie, or None."""
        draft = await self.repo.get_from_cookie(request)
        if draft:
            logger.debug("Draft from cookie: %s", draft.id)
        return draft

    async def autosave(
        self,
        form_slug: str,
        data: dict[str, Any],
        request: Request,
        response: Response,
    ) -> DraftUpdateResult:
        """Persist current form values into JSONB (server-side)."""
        draft = await self.repo.get_from_cookie_or_create(request, response, form_slug)

        # 🔥 CORRECTION : Fusionner avec les données existantes
        existing_data = draft.data or {}
        merged_data = {**existing_data, **data}

        logger.info(
            f"Draft autosave - existing: {len(existing_data)} fields, new: {len(data)} fields, merged: {len(merged_data)} fields"
        )
        logger.info(f"Merged data keys: {list(merged_data.keys())}")

        await self.repo.update_data(
            draft_id=draft.id, data=merged_data, last_event="autosave"
        )
        logger.info("Draft autosaved: %s (%s total fields)", draft.id, len(merged_data))
        return DraftUpdateResult(draft=draft, saved=True)

    async def record_basic_download(
        self,
        form_slug: str,
        request: Request,
        response: Response,
        meta: dict[str, Any] | None = None,
    ) -> None:
        draft = await self.repo.get_from_cookie_or_create(request, response, form_slug)
        await self._record_event_and_touch(
            draft.id, DraftEventType.BASIC_DOWNLOAD, meta
        )

    async def record_preview_view(
        self,
        form_slug: str,
        request: Request,
        response: Response,
        meta: dict[str, Any] | None = None,
    ) -> None:
        draft = await self.repo.get_from_cookie_or_create(request, response, form_slug)
        await self._record_event_and_touch(draft.id, DraftEventType.PREVIEW_VIEW, meta)

    async def record_pdf_download(
        self,
        form_slug: str,
        request: Request,
        response: Response,
        meta: dict[str, Any] | None = None,
    ) -> None:
        draft = await self.repo.get_from_cookie_or_create(request, response, form_slug)
        await self._record_event_and_touch(draft.id, DraftEventType.PDF_DOWNLOAD, meta)

    async def record_premium_checkout(
        self,
        form_slug: str,
        request: Request,
        response: Response,
        meta: dict[str, Any] | None = None,
    ) -> None:
        draft = await self.repo.get_from_cookie_or_create(request, response, form_slug)
        await self._record_event_and_touch(
            draft.id, DraftEventType.PREMIUM_CHECKOUT, meta
        )

    async def record_premium_paid(
        self,
        draft: FormDraft | None = None,
        *,
        draft_id: UUID | None = None,
        meta: dict[str, Any] | None = None,
    ) -> None:
        """À utiliser côté webhook Stripe (pas de Request/Response ici).
        Tu peux passer soit `draft`, soit `draft_id`.
        """
        _id = draft.id if draft else draft_id
        if not _id:
            logger.warning("premium_paid ignored: missing draft_id")
            return
        await self._record_event_and_touch(_id, DraftEventType.PREMIUM_PAID, meta)

    async def mark_submitted_and_clear_cookie(
        self, form_slug: str, request: Request, response: Response
    ) -> None:
        draft = await self.repo.get_from_cookie_or_create(request, response, form_slug)
        await self.repo.mark_submitted(draft.id)

    # -------------------------
    # Internal helpers
    # -------------------------

    async def _record_event_and_touch(
        self, draft_id: UUID, event: DraftEventType, meta: dict[str, Any] | None
    ) -> None:
        """Insert funnel event, and reflect last_event in draft row for fast reporting."""
        await self.repo.add_event(draft_id=draft_id, event_type=event, meta=meta or {})
        # On met aussi à jour last_event pour faciliter des reporting rapides.
        await self.repo.update_data(draft_id=draft_id, data={}, last_event=event.value)
        logger.debug("Draft %s event recorded: %s", draft_id, event.value)
