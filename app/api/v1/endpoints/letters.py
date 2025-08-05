"""API endpoints for letter generation, PDF creation, and email sending."""

from __future__ import annotations

from collections.abc import Mapping
from datetime import date, datetime
from decimal import Decimal
from typing import Annotated, Any, cast
from uuid import UUID

from fastapi import (
    APIRouter,
    Body,
    Depends,
    File,
    Form,
    HTTPException,
    Query,
    Request,
    Response,
    UploadFile,
)
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, EmailStr, TypeAdapter
from starlette.templating import _TemplateResponse as TemplateResponseType

from app.core.form_draft_service import FormDraftService
from app.core.letter_service import LetterService
from app.core.session_manager import SessionConfig, SessionManager
from app.dependencies import get_form_draft_service, get_letter_service
from app.models.form_draft import FormDraft
from app.models.letters import LetterRequest, LetterResponse, PDFOptions
from app.utils.exceptions import ProcessingError, ValidationError

router = APIRouter()
session_manager = SessionManager(config=SessionConfig())

# Types utilitaires
TemplateContext = dict[str, object]


# =========================
# Helpers (format & ctx)
# =========================
def _fmt_date_human(d: date | None) -> str:
    return "" if d is None else d.strftime("%d/%m/%Y")


def _fmt_amount_eur(amount: Decimal | float | int | None) -> str:
    if amount is None:
        return ""
    # Normalise en Decimal pour un formatage stable
    dec = amount if isinstance(amount, Decimal) else Decimal(str(amount))
    return f"{dec:.2f}".replace(".", ",") + " €"


def _ctx_from_draft(draft: FormDraft, *, signature: str | None) -> TemplateContext:
    # On assume que FormDraft.data est Mapping[str, object] | None
    data: Mapping[str, object] = draft.data or {}

    def _get_str(key: str) -> str:
        v = data.get(key)
        return v if isinstance(v, str) else ""

    def _get_date(key: str) -> date | None:
        v = data.get(key)
        return v if isinstance(v, date) else None

    def _get_num(key: str) -> Decimal | float | int | None:
        v = data.get(key)
        return v if isinstance(v, (Decimal, float, int)) else None

    buyer_addr = _get_str("buyer_address").replace("\n", "<br>")
    seller_addr = _get_str("seller_address").replace("\n", "<br>")

    return {
        "buyer_name": _get_str("buyer_name"),
        "buyer_address": buyer_addr,
        "seller_name": _get_str("seller_name"),
        "seller_address": seller_addr,
        "current_date": datetime.now().strftime("%d/%m/%Y"),
        "purchase_date_formatted": _fmt_date_human(_get_date("purchase_date")),
        "product_name": _get_str("product_name"),
        "order_reference": _get_str("order_reference"),
        "amount_formatted": _fmt_amount_eur(_get_num("amount")),
        "defect_description": _get_str("defect_description"),
        "signature_image_src": signature,
        # branding
        "logo_src": "/static/images/logo-pdf.svg",
    }


def _ctx_from_letter(
    letter: LetterResponse, *, signature: str | None
) -> TemplateContext:
    buyer_addr = (letter.buyer_address or "").replace("\n", "<br>")
    seller_addr = (letter.seller_address or "").replace("\n", "<br>")

    return {
        "buyer_name": letter.buyer_name or "",
        "buyer_address": buyer_addr,
        "seller_name": letter.seller_name or "",
        "seller_address": seller_addr,
        "current_date": datetime.now().strftime("%d/%m/%Y"),
        "purchase_date_formatted": _fmt_date_human(letter.purchase_date),
        "product_name": letter.product_name or "",
        "order_reference": letter.order_reference or "",
        "amount_formatted": _fmt_amount_eur(letter.amount),
        "defect_description": letter.defect_description or "",
        "signature_image_src": signature,
        "logo_src": "/static/images/logo-pdf.svg",
    }


# ========================================
# MAIN ENDPOINTS EXISTANTS (inchangés)
# ========================================


class QuickGenerateRequest(BaseModel):
    letter_data: LetterRequest
    download_pdf: bool = True
    send_email: bool = False
    email_address: EmailStr | None = None
    pdf_format: str = "A4"


@router.post("/quick-generate", response_model=None)
async def quick_generate_multipart(
    letter_data: Annotated[str, Form()],
    request: Request,
    response: Response,
    letter_service: Annotated[LetterService, Depends(get_letter_service)],
    attachments: Annotated[list[UploadFile] | None, File()] = None,
    download_pdf: Annotated[bool, Form()] = True,
    send_email: Annotated[bool, Form()] = False,
    email_address: Annotated[str | None, Form()] = None,
    pdf_format: Annotated[str, Form()] = "A4",
) -> Response | dict[str, object]:
    try:
        parsed_letter_data = TypeAdapter(LetterRequest).validate_json(letter_data)

        session_id = session_manager.get_session_id(request)
        session_manager.set_session_cookie(response, session_id)
        parsed_letter_data.session_id = session_id

        pdf_options = PDFOptions(format=pdf_format)

        # `attachments` est actuellement non utilisé ; conservé pour compat compatibilité
        _ = attachments

        result = await letter_service.create_letter(
            letter_data=parsed_letter_data,
            generate_pdf=download_pdf,
            send_email=send_email,
            email_address=email_address,
            pdf_options=pdf_options,
        )

        if download_pdf and result.pdf_bytes:
            return Response(
                content=result.pdf_bytes,
                media_type="application/pdf",
                headers={
                    "Content-Disposition": f"attachment; filename={result.pdf_filename}",
                    "Content-Length": str(len(result.pdf_bytes)),
                    "X-Letter-ID": str(result.letter_id),
                    "X-Email-Sent": str(result.email_sent),
                    "X-Email-Message": result.email_message or "",
                },
            )

        return {
            "letter_id": str(result.letter_id),
            "status": result.status.value,
            "pdf_generated": result.pdf_bytes is not None,
            "email_sent": result.email_sent,
            "email_message": result.email_message or "",
            "session_id": session_id,
        }

    except (ValidationError, ProcessingError) as e:
        raise HTTPException(
            status_code=400 if isinstance(e, ValidationError) else 500,
            detail={"error": e.message, "code": e.error_code},
        ) from e


# ========================================
# PREVIEWS (PDF TEMPLATE)
# ========================================


class PreviewFromDraftPayload(BaseModel):
    # Data URL "image/png;base64,..." ou None
    signature_data_url: str | None = None
    # Filigrane (1 = actif)
    wm: int = 1


@router.post("/letters/preview-from-draft")
async def preview_from_draft(
    request: Request,
    response: Response,
    draft_svc: Annotated[FormDraftService, Depends(get_form_draft_service)],
    payload: PreviewFromDraftPayload = Body(...),
) -> TemplateResponseType:
    draft = await draft_svc.get_or_create(
        form_slug="mise_en_demeure_v1", request=request, response=response
    )
    await draft_svc.record_preview_view(
        form_slug="mise_en_demeure_v1", request=request, response=response
    )

    ctx: TemplateContext = _ctx_from_draft(draft, signature=payload.signature_data_url)
    ctx.update(
        {
            "request": request,
            "show_watermark": bool(payload.wm),
            "watermark_text": "APERÇU NON VALABLE",
        }
    )
    templates = cast(Jinja2Templates, request.app.state.templates)
    return templates.TemplateResponse("letters/pdf_mise_en_demeure.html", ctx)


@router.get("/letters/{letter_id}/preview")
async def preview_letter(
    letter_id: UUID,
    request: Request,
    letter_service: Annotated[LetterService, Depends(get_letter_service)],
    wm: int = Query(0, description="1 pour activer le filigrane"),
    signature_data_url: str | None = Query(default=None),
) -> TemplateResponseType:
    letter = await letter_service.get_letter(letter_id)
    if not letter:
        raise HTTPException(status_code=404, detail="Letter not found")

    ctx: TemplateContext = _ctx_from_letter(letter, signature=signature_data_url)
    ctx.update(
        {
            "request": request,
            "show_watermark": bool(wm),
            "watermark_text": "APERÇU NON VALABLE",
        }
    )

    templates = cast(Jinja2Templates, request.app.state.templates)
    return templates.TemplateResponse("letters/pdf_mise_en_demeure.html", ctx)


@router.get("/{letter_id}/preview")
async def preview_letter(
    letter_id: UUID,
    letter_service: Annotated[LetterService, Depends(get_letter_service)],
    wm: int = 0,  # Paramètre watermark
) -> Response:
    """Prévisualise le contenu HTML d'une lettre.

    Args:
        letter_id: UUID de la lettre.
        letter_service: Service de lettres.
        wm: Watermark (0=sans, 1=avec watermark).

    Returns:
        Contenu HTML de la lettre.

    Raises:
        HTTPException: Si la lettre n'existe pas.
    """
    try:
        letter = await letter_service.get_letter(letter_id)
        if not letter:
            raise HTTPException(status_code=404, detail="Letter not found")

        # Ajouter un watermark si demandé
        content = letter.content or ""
        if wm == 1:
            watermark_style = (
                "position: fixed; top: 50%; left: 50%; "
                "transform: translate(-50%, -50%) rotate(-45deg); "
                "font-size: 72px; color: rgba(255,0,0,0.1); z-index: 1000; "
                "pointer-events: none;"
            )
            watermark_div = f'<div style="{watermark_style}">APERÇU</div>'
            content = content.replace("<body>", f"<body>{watermark_div}")

        return Response(
            content=content,
            media_type="text/html",
            headers={"Cache-Control": "no-cache"},
        )

    except ProcessingError as e:
        raise HTTPException(
            status_code=500,
            detail={
                "error": e.message,
                "code": e.error_code,
            },
        ) from e


@router.get("/{letter_id}/preview-pdf")
async def preview_pdf_content(
    letter_id: UUID,
    letter_service: Annotated[LetterService, Depends(get_letter_service)],
) -> dict[str, Any]:
    """Obtient le contenu formaté pour la prévisualisation PDF.

    Args:
        letter_id: UUID de la lettre.
        letter_service: Service de lettres.

    Returns:
        Dictionnaire avec le contenu formaté.

    Raises:
        HTTPException: Si la lettre n'existe pas.
    """
    try:
        letter = await letter_service.get_letter(letter_id)
        if not letter:
            raise HTTPException(status_code=404, detail="Letter not found")

        # Extraire les informations formatées pour l'aperçu
        return {
            "buyer_name": letter.buyer_name,
            "buyer_address": letter.buyer_address.replace("\n", "<br>"),
            "seller_name": letter.seller_name,
            "seller_address": letter.seller_address.replace("\n", "<br>"),
            "purchase_date": letter.purchase_date.strftime("%d/%m/%Y"),
            "product_name": letter.product_name,
            "amount": f"{letter.amount:.2f} €".replace(".", ","),
            "defect_description": letter.defect_description,
            "order_reference": letter.order_reference or "Non spécifié",
            "current_date": datetime.now().strftime("%d/%m/%Y"),
            "letter_id": str(letter_id),
        }

    except ProcessingError as e:
        raise HTTPException(
            status_code=500,
            detail={
                "error": e.message,
                "code": e.error_code,
            },
        ) from e


# ========================================
# GENERATE-ONLY (inchangé)
# ========================================


@router.post("/generate")
async def generate_letter_only(
    letter_data: LetterRequest,
    request: Request,
    response: Response,
    letter_service: Annotated[LetterService, Depends(get_letter_service)],
) -> dict[str, object]:
    try:
        session_id = session_manager.get_session_id(request)
        session_manager.set_session_cookie(response, session_id)
        letter_data.session_id = session_id

        result = await letter_service.create_letter(
            letter_data=letter_data,
            generate_pdf=False,
            send_email=False,
        )
        return {
            "letter_id": str(result.letter_id),
            "content": result.content,
            "status": result.status.value,
            "session_id": session_id,
        }

    except (ValidationError, ProcessingError) as e:
        raise HTTPException(
            status_code=400 if isinstance(e, ValidationError) else 500,
            detail={"error": e.message, "code": e.error_code},
        ) from e


# ========================================
# EXISTING LETTERS (inchangé)
# ========================================


@router.get("/{letter_id}")
async def get_letter(
    letter_id: UUID,
    letter_service: Annotated[LetterService, Depends(get_letter_service)],
) -> LetterResponse:
    letter = await letter_service.get_letter(letter_id)
    if not letter:
        raise HTTPException(status_code=404, detail="Letter not found")
    return letter


@router.get("/{letter_id}/download", response_model=None)
async def download_pdf(
    letter_id: UUID,
    letter_service: Annotated[LetterService, Depends(get_letter_service)],
    format: str = "A4",
) -> Response:
    try:
        pdf_options = PDFOptions(format=format)
        pdf_bytes = await letter_service.generate_pdf(letter_id, pdf_options)

        date_str = datetime.now().strftime("%Y%m%d")
        filename = f"pdf_mise_en_demeure_{date_str}.pdf"

        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={filename}",
                "Content-Length": str(len(pdf_bytes)),
            },
        )
    except ProcessingError as e:
        raise HTTPException(
            status_code=500, detail={"error": e.message, "code": e.error_code}
        ) from e


@router.post("/{letter_id}/send-email")
async def send_letter_email(
    letter_id: UUID,
    email_address: EmailStr,
    letter_service: Annotated[LetterService, Depends(get_letter_service)],
    include_pdf: bool = True,
) -> dict[str, object | None]:
    try:
        success, message = await letter_service.send_email(
            letter_id=letter_id,
            email_address=email_address,
            include_pdf=include_pdf,
        )
        return {
            "success": success,
            "message": message,
            "recipient": email_address,
            "sent_at": datetime.now().isoformat() if success else None,
        }
    except ProcessingError as e:
        raise HTTPException(
            status_code=500, detail={"error": e.message, "code": e.error_code}
        ) from e


# ========================================
# UTILS (inchangé)
# ========================================


@router.get("/session/{session_id}")
async def get_session_letters(
    session_id: str,
    letter_service: Annotated[LetterService, Depends(get_letter_service)],
) -> list[LetterResponse]:
    try:
        return await letter_service.get_session_letters(session_id)
    except ProcessingError as e:
        raise HTTPException(
            status_code=500, detail={"error": e.message, "code": e.error_code}
        ) from e


@router.get("/health")
async def health_check(
    letter_service: Annotated[LetterService, Depends(get_letter_service)],
) -> dict[str, object]:
    return {
        "status": "healthy",
        "services": {"letter_generation": "available"},
    }
