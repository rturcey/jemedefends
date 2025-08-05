from __future__ import annotations

import logging
from typing import Annotated, Any, TypedDict

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from pydantic import BaseModel

from app.core.form_draft_service import FormDraftService
from app.core.letter_service import LetterService
from app.dependencies import get_form_draft_service, get_letter_service
from app.models.form_draft import DraftEventType, DraftStatus
from app.models.letters import DefectType, LetterRequest

router = APIRouter(prefix="/form-drafts", tags=["form-drafts"])


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


@router.get("/{form_slug}")
async def get_form_draft(
    form_slug: str,
    request: Request,
    response: Response,
    form_draft_service: Annotated[FormDraftService, Depends(get_form_draft_service)],
) -> GetFormDraftResponse:
    d = await form_draft_service.get_or_create(form_slug, request, response)
    return {
        "data": d.data,
        "draft_id": str(d.id),
        "status": d.status,
        "last_event": d.last_event,
    }


@router.patch("/{form_slug}")
async def patch_form_draft(
    form_slug: str,
    payload: DraftPayload,
    request: Request,
    response: Response,
    form_draft_service: Annotated[FormDraftService, Depends(get_form_draft_service)],
) -> SimpleOK:
    r = await form_draft_service.autosave(
        form_slug=form_slug, data=payload.data, request=request, response=response
    )
    return {"ok": r.saved}


@router.post("/{form_slug}/events")
async def add_event(
    form_slug: str,
    payload: DraftEventPayload,
    request: Request,
    response: Response,
    form_draft_service: Annotated[FormDraftService, Depends(get_form_draft_service)],
) -> SimpleOK:
    evt, meta = payload.event_type, payload.meta
    if evt is DraftEventType.BASIC_DOWNLOAD:
        await form_draft_service.record_basic_download(
            form_slug, request, response, meta
        )
    elif evt is DraftEventType.PREVIEW_VIEW:
        await form_draft_service.record_preview_view(form_slug, request, response, meta)
    elif evt is DraftEventType.PDF_DOWNLOAD:
        await form_draft_service.record_pdf_download(form_slug, request, response, meta)
    elif evt is DraftEventType.PREMIUM_CHECKOUT:
        await form_draft_service.record_premium_checkout(
            form_slug, request, response, meta
        )
    elif evt is DraftEventType.PREMIUM_PAID:
        d = await form_draft_service.get_or_create(form_slug, request, response)
        await form_draft_service.record_premium_paid(draft_id=d.id, meta=meta)
    else:
        raise HTTPException(status_code=400, detail="Unknown event type")
    return {"ok": True}


# Remplacer l'endpoint submit dans app/api/v1/endpoints/form_drafts.py


# Remplacer l'endpoint submit dans app/api/v1/endpoints/form_drafts.py

@router.post("/submit/{form_slug}")
async def submit(
    form_slug: str,
    request: Request,
    response: Response,
    form_draft_service: Annotated[FormDraftService, Depends(get_form_draft_service)],
    letter_service: Annotated[LetterService, Depends(get_letter_service)],
) -> SubmitOK:
    """Submit a form draft and generate a letter.

    Returns both draft_id and letter_id for the client.
    """
    try:
        # 1. Récupérer le draft actuel
        draft = await form_draft_service.get_current(request)
        if not draft:
            raise HTTPException(
                status_code=404, detail="No draft found for this session"
            )

        # 🔥 DEBUG DÉTAILLÉ : Afficher les données du draft
        logger = logging.getLogger(__name__)
        logger.info(f"📋 Draft ID: {draft.id}")
        logger.info(f"📋 Draft status: {draft.status}")
        logger.info(f"📋 Draft data keys: {list(draft.data.keys()) if draft.data else 'No data'}")
        logger.info(f"📋 Draft data content: {draft.data}")

        if not draft.data:
            raise HTTPException(
                status_code=400,
                detail="Draft data is empty. Please fill the form first."
            )

        # 2. 🔥 SUPPRIMÉ : Validation manuelle qui était incorrecte
        # On laisse Pydantic faire la validation dans LetterRequest

        # 3. Convertir les données du draft en LetterRequest
        draft_data = draft.data

        try:
            logger.info(f"🔧 Starting conversion with {len(draft_data)} fields")
            letter_data = _convert_draft_to_letter_request(draft_data, form_slug)
            logger.info(f"✅ Letter data converted successfully")
            logger.info(f"📝 Letter preview: buyer={letter_data.buyer_name}, product={letter_data.product_name}")
        except Exception as e:
            logger.error(f"❌ Error converting draft to letter: {e}")
            logger.error(f"❌ Draft data was: {draft_data}")
            raise HTTPException(
                status_code=400,
                detail=f"Failed to convert form data: {str(e)}"
            ) from e

        # Le reste reste identique...
        # 4. Générer la lettre
        try:
            result = await letter_service.create_letter(
                letter_data=letter_data,
                generate_pdf=False,
                send_email=False,
            )
            logger.info(f"📝 Letter created with ID: {result.letter_id}")
        except Exception as e:
            logger.error(f"❌ Error creating letter: {e}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to generate letter: {str(e)}"
            ) from e

        # 5. Marquer le draft comme soumis
        await form_draft_service.mark_submitted_and_clear_cookie(
            form_slug, request, response
        )

        # 6. Retourner les deux IDs
        return {
            "ok": True,
            "draft_id": str(draft.id),
            "letter_id": str(result.letter_id),
        }

    except HTTPException:
        # Re-raise les HTTPException sans les wrapper
        raise
    except Exception as e:
        logger.error(f"❌ Unexpected error submitting draft: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        ) from e

def _convert_draft_to_letter_request(
    draft_data: dict[str, Any], form_slug: str
) -> LetterRequest:
    """Convert draft data to LetterRequest object."""
    from datetime import date
    from decimal import Decimal
    from uuid import uuid4

    logger = logging.getLogger(__name__)
    # 🔥 DEBUG : Afficher les données reçues ET les clés disponibles
    logger.info(f"🔧 Converting draft data keys: {list(draft_data.keys())}")
    logger.info(f"🔧 Full draft data: {draft_data}")

    # Fonction helper pour obtenir une valeur string non vide
    def get_string(key: str, default: str = "") -> str:
        value = draft_data.get(key, default)
        if value is None:
            return default
        result = str(value).strip()
        logger.info(f"  📋 {key}: '{result}' (length: {len(result)})")
        return result

    # 🔥 CORRECTION : Validation plus permissive avec meilleurs messages d'erreur
    buyer_name = get_string("buyer_name")
    if len(buyer_name) < 2:
        raise ValueError(f"buyer_name too short: '{buyer_name}' (need at least 2 chars). Available keys: {list(draft_data.keys())}")

    buyer_address = get_string("buyer_address")
    if len(buyer_address) < 10:
        raise ValueError(f"buyer_address too short: '{buyer_address}' (need at least 10 chars)")

    seller_name = get_string("seller_name")
    if len(seller_name) < 2:
        raise ValueError(f"seller_name too short: '{seller_name}' (need at least 2 chars)")

    seller_address = get_string("seller_address")
    if len(seller_address) < 10:
        raise ValueError(f"seller_address too short: '{seller_address}' (need at least 10 chars)")

    product_name = get_string("product_name")
    if len(product_name) < 2:
        raise ValueError(f"product_name too short: '{product_name}' (need at least 2 chars)")

    # Gestion de la date
    purchase_date_str = draft_data.get("purchase_date")
    if purchase_date_str:
        try:
            purchase_date = date.fromisoformat(str(purchase_date_str))
            logger.info(f"  📅 purchase_date: {purchase_date}")
        except (ValueError, TypeError) as e:
            logger.warning(f"Invalid date format '{purchase_date_str}': {e}")
            purchase_date = date.today()
    else:
        purchase_date = date.today()

    # 🔥 CORRECTION : Gestion du montant plus robuste
    amount_str = draft_data.get("amount", "0")
    logger.info(f"  💰 amount_str from draft: '{amount_str}' (type: {type(amount_str)})")

    try:
        # Nettoyer le montant (retirer espaces, virgules, etc.)
        amount_clean = str(amount_str).strip().replace(",", ".").replace(" ", "")
        amount = Decimal(amount_clean)
        logger.info(f"  💰 amount parsed: {amount}")

        if amount <= 0:
            raise ValueError(f"amount must be greater than 0, got: {amount}")
    except (ValueError, TypeError, decimal.InvalidOperation) as e:
        raise ValueError(f"Invalid amount '{amount_str}': {e}") from e

    # Générer un session_id si nécessaire
    session_id = str(draft_data.get("session_id", uuid4()))

    # Type de défaut avec validation
    defect_type = get_string("defect_type", "malfunction")
    valid_defect_types = ["malfunction", "non_conformity", "delivery_issue", "warranty_refusal"]
    if defect_type not in valid_defect_types:
        logger.warning(f"Invalid defect_type '{defect_type}', using 'malfunction'")
        defect_type = "malfunction"

    defect_description = get_string("defect_description")
    if len(defect_description) < 10:
        raise ValueError(f"defect_description too short: '{defect_description}' (need at least 10 chars)")

    logger.info(f"📋 Creating LetterRequest with: buyer='{buyer_name}', product='{product_name}', amount={amount}")

    # 🔥 AJOUT : Validation finale des champs requis
    required_fields = {
        "buyer_name": buyer_name,
        "buyer_address": buyer_address,
        "seller_name": seller_name,
        "seller_address": seller_address,
        "product_name": product_name,
        "defect_description": defect_description,
    }

    empty_fields = [field for field, value in required_fields.items() if not value or len(value.strip()) < 2]
    if empty_fields:
        logger.error(f"❌ Empty required fields: {empty_fields}")
        logger.error(f"❌ Draft data was: {draft_data}")
        raise ValueError(f"Required fields are empty: {empty_fields}")

    return LetterRequest(
        session_id=session_id,
        buyer_name=buyer_name,
        buyer_address=buyer_address,
        buyer_email=draft_data.get("buyer_email"),  # Optionnel
        seller_name=seller_name,
        seller_address=seller_address,
        purchase_date=purchase_date,
        product_name=product_name,
        order_reference=draft_data.get("order_reference"),  # Optionnel
        amount=amount,
        defect_type=DefectType(defect_type),
        defect_description=defect_description,
    )