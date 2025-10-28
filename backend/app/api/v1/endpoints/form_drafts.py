from __future__ import annotations

import logging
from typing import Annotated, Any, TypedDict

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from pydantic import BaseModel

from app.core.form_draft_service import FormDraftService
from app.core.letter_service import LetterService
from app.dependencies import get_form_draft_service, get_letter_service
from app.models.form_draft import DraftEventType, DraftStatus
from app.models.letters import Address, RemedyPreference, LetterRequest

router = APIRouter(prefix="/form-drafts", tags=["form-drafts"])

logger = logging.getLogger(__name__)


class DraftPayload(BaseModel):
    data: dict[str, Any]


class DraftEventPayload(BaseModel):
    event_type: DraftEventType
    meta: dict[str, Any] | None = None


class GetFormDraftResponse(TypedDict):
    data: dict[str, Any] | None
    draft_id: str
    status: DraftStatus
    last_event: str | None


class SimpleOK(TypedDict):
    ok: bool


class SubmitOK(TypedDict):
    ok: bool
    draft_id: str | None
    letter_id: str | None
    redirect_url: str | None


@router.get("/{form_slug}")
async def get_form_draft(
    form_slug: str,
    request: Request,
    response: Response,
    form_draft_service: Annotated[FormDraftService, Depends(get_form_draft_service)],
) -> GetFormDraftResponse:
    client_ip = request.client.host if request.client else "unknown"
    logger.info("GET /form-drafts/%s - Client: %s", form_slug, client_ip)

    try:
        d = await form_draft_service.get_or_create(form_slug, request, response)
        logger.info(
            "Draft retrieved/created - ID: %s, Status: %s, Data keys: %s",
            d.id,
            d.status,
            list(d.data.keys()) if d.data else [],
        )
        return {
            "data": d.data,
            "draft_id": str(d.id),
            "status": d.status,
            "last_event": d.last_event,
        }
    except Exception as e:
        logger.error(
            "Error getting/creating draft for %s: %s", form_slug, e, exc_info=True
        )
        raise HTTPException(
            status_code=500, detail=f"Draft retrieval failed: {e!s}"
        ) from e


@router.patch("/{form_slug}")
async def patch_form_draft(
    form_slug: str,
    payload: DraftPayload,
    request: Request,
    response: Response,
    form_draft_service: Annotated[FormDraftService, Depends(get_form_draft_service)],
) -> SimpleOK:
    client_ip = request.client.host if request.client else "unknown"
    data_keys = list(payload.data.keys()) if payload.data else []
    logger.info(
        "PATCH /form-drafts/%s - Client: %s, Data keys: %s",
        form_slug,
        client_ip,
        data_keys,
    )

    try:
        r = await form_draft_service.autosave(
            form_slug=form_slug, data=payload.data, request=request, response=response
        )
        logger.info("Autosave completed - Saved: %s, Draft ID: %s", r.saved, r.draft.id)
        return {"ok": r.saved}
    except Exception as e:
        logger.error("Error autosaving draft for %s: %s", form_slug, e, exc_info=True)
        raise HTTPException(status_code=500, detail=f"Autosave failed: {e!s}") from e


@router.post("/{form_slug}/events")
async def add_event(
    form_slug: str,
    payload: DraftEventPayload,
    request: Request,
    response: Response,
    form_draft_service: Annotated[FormDraftService, Depends(get_form_draft_service)],
) -> SimpleOK:
    client_ip = request.client.host if request.client else "unknown"
    logger.info(
        "POST /form-drafts/%s/events - Client: %s, Event: %s",
        form_slug,
        client_ip,
        payload.event_type,
    )

    try:
        evt, meta = payload.event_type, payload.meta

        if evt is DraftEventType.BASIC_DOWNLOAD:
            logger.debug("Recording basic download event for %s", form_slug)
            await form_draft_service.record_basic_download(
                form_slug, request, response, meta
            )
        elif evt is DraftEventType.PREVIEW_VIEW:
            logger.debug("Recording preview view event for %s", form_slug)
            await form_draft_service.record_preview_view(
                form_slug, request, response, meta
            )
        elif evt is DraftEventType.PDF_DOWNLOAD:
            logger.debug("Recording PDF download event for %s", form_slug)
            await form_draft_service.record_pdf_download(
                form_slug, request, response, meta
            )
        else:
            logger.warning("Unknown event type: %s for form %s", evt, form_slug)
            raise HTTPException(status_code=400, detail="Unknown event type")

        logger.info("Event %s recorded successfully for %s", evt, form_slug)
        return {"ok": True}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(
            "Error recording event %s for %s: %s",
            payload.event_type,
            form_slug,
            e,
            exc_info=True,
        )
        raise HTTPException(
            status_code=500, detail=f"Event recording failed: {e!s}"
        ) from e


@router.post("/submit/{form_slug}")
async def submit(
    form_slug: str,
    request: Request,
    response: Response,
    form_draft_service: Annotated[FormDraftService, Depends(get_form_draft_service)],
    letter_service: Annotated[LetterService, Depends(get_letter_service)],
) -> SubmitOK:
    client_ip = request.client.host if request.client else "unknown"
    logger.info("POST /form-drafts/submit/%s - Client: %s", form_slug, client_ip)

    try:
        draft = await form_draft_service.get_current(request)
        if not draft:
            logger.warning(
                "No draft found for submission - Form: %s, Client: %s",
                form_slug,
                client_ip,
            )
            raise HTTPException(
                status_code=404, detail="No draft found for this session"
            )

        if not draft.data:
            logger.warning("Empty draft data for submission - Draft ID: %s", draft.id)
            raise HTTPException(
                status_code=400,
                detail="Draft data is empty. Please fill the form first.",
            )

        logger.info("Starting letter creation from draft %s", draft.id)

        try:
            remedy_preference = RemedyPreference(
                draft.data.get("remedy_preference", "repairs")
            )
        except ValueError:
            logger.warning(
                "Invalid remedy_preference in draft %s: %s",
                draft.id,
                draft.data.get("remedy_preference"),
            )
            remedy_preference = RemedyPreference.REPAIRS
        buyer_address = Address(
            line1=draft.data.get("buyer_address_line_1", ""),
            line2=draft.data.get("buyer_address_line_2", None),
            postal_code=draft.data.get("buyer_postal_code", ""),
            city=draft.data.get("buyer_city", ""),
            country=draft.data.get("seller_country", "France"),
        )

        seller_address = Address(
            line1=draft.data.get("seller_address_line_1", ""),
            line2=draft.data.get("seller_address_line_2", None),
            postal_code=draft.data.get("seller_postal_code", ""),
            city=draft.data.get("seller_city", ""),
            country=draft.data.get("seller_country", "France"),
        )

        buyer_email = draft.data.get("buyer_email", None)
        buyer_phone = draft.data.get("buyer_phone", None)
        if buyer_email == "":
            buyer_email = None
        letter_request = LetterRequest(
            buyer_name=draft.data.get("buyer_name", ""),
            buyer_address=buyer_address,
            buyer_email=buyer_email,
            buyer_phone=buyer_phone,
            order_reference=draft.data.get("order_reference", None),
            seller_name=draft.data.get("seller_name", ""),
            seller_address=seller_address,
            purchase_date=draft.data.get("purchase_date", ""),
            product_name=draft.data.get("product_name", ""),
            product_price=draft.data.get("product_price", ""),
            remedy_preference=remedy_preference,
            defect_description=draft.data.get("defect_description", ""),
            used=draft.data.get("used", False),
            digital=draft.data.get("digital", False),
        )

        logger.debug(
            "Letter request data: buyer=%s, seller=%s, product=%s",
            letter_request.buyer_name,
            letter_request.seller_name,
            letter_request.product_name,
        )

        letter = await letter_service.create_letter(letter_request)

        await form_draft_service.mark_submitted_and_clear_cookie(
            form_slug=draft.form_slug,
            request=request,
            response=response,
        )
        logger.info("Letter %s created successfully from draft %s", letter.id, draft.id)

        return {
            "ok": True,
            "draft_id": str(draft.id),
            "letter_id": str(letter.id),
            "redirect_url": "/resultats",
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error submitting form %s: %s", form_slug, e, exc_info=True)
        raise HTTPException(
            status_code=500, detail=f"Form submission failed: {e!s}"
        ) from e
