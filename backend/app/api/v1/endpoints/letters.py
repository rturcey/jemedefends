from __future__ import annotations

import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from starlette.responses import HTMLResponse, Response

from app.core.letter_service import LetterService
from app.core.pdf_service import PDFType
from app.dependencies import get_letter_service
from app.models.letters import Letter
from app.utils.exceptions import ProcessingError
from core.ai_service import (ScalewayAIService, ReformulationResponse,
                             ReformulationRequest)

logger = logging.getLogger(__name__)

router = APIRouter()


class GeneratePDFPayload(BaseModel):
    letter_id: str
    signature_data_url: str | None = None
    add_watermark: bool = False
    pdf_type: str = "final"


class PreviewBasicPayload(BaseModel):
    letter_id: str

class ReformulateTextPayload(BaseModel):
    text: str
    type: str = "reformulated"
    context: str | None = None

@router.get("/{letter_id}")
async def get_letter(
    letter_id: str,
    letter_service: Annotated[LetterService, Depends(get_letter_service)],
) -> Letter:
    logger.info("GET /letters/%s - Fetching letter", letter_id)
    try:
        letter = await letter_service._repository.get_letter_by_id(letter_id)
        if not letter:
            logger.warning("Letter %s not found", letter_id)
            raise HTTPException(status_code=404, detail="Letter not found")

        logger.info("Letter %s retrieved successfully", letter_id)
        return letter
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error getting letter %s: %s", letter_id, e, exc_info=True)
        raise HTTPException(
            status_code=500, detail=f"Failed to get letter: {e!s}"
        ) from e


@router.post("/preview-basic")
async def preview_basic(
    payload: PreviewBasicPayload,
    letter_service: Annotated[LetterService, Depends(get_letter_service)],
) -> HTMLResponse:
    logger.info("POST /letters/preview-basic - Letter ID: %s", payload.letter_id)
    try:
        letter_id = payload.letter_id
        html_content = await letter_service.generate_basic_html(letter_id)
        logger.info("Basic preview generated successfully for letter %s", letter_id)
        return HTMLResponse(content=html_content)
    except ValueError as e:
        logger.warning("Invalid letter ID format: %s", payload.letter_id)
        raise HTTPException(status_code=400, detail=f"Invalid letter ID: {e}") from e
    except ProcessingError as e:
        logger.error("Processing error for letter %s: %s", payload.letter_id, e.message)
        raise HTTPException(status_code=500, detail=e.message) from e
    except Exception as e:
        logger.error(
            "Error generating basic preview for %s: %s",
            payload.letter_id,
            e,
            exc_info=True,
        )
        raise HTTPException(
            status_code=500, detail=f"Preview generation failed: {e!s}"
        ) from e


@router.post("/generate-pdf")
async def generate_pdf(
    payload: GeneratePDFPayload,
    letter_service: Annotated[LetterService, Depends(get_letter_service)],
) -> Response:
    logger.info(
        "POST /letters/generate-pdf - Letter ID: %s, Type: %s, Signature: %s, Watermark: %s",
        payload.letter_id,
        payload.pdf_type,
        "provided" if payload.signature_data_url else "none",
        payload.add_watermark,
    )
    try:
        letter_id = payload.letter_id

        if payload.pdf_type not in ("preview", "final"):
            logger.warning("Invalid PDF type requested: %s", payload.pdf_type)
            raise HTTPException(
                status_code=400, detail="pdf_type must be 'preview' or 'final'"
            )

        pdf_type = PDFType.PREVIEW if payload.pdf_type == "preview" else PDFType.FINAL

        logger.debug(
            "Starting PDF generation - Letter: %s, Type: %s", letter_id, pdf_type
        )
        pdf_bytes = await letter_service.generate_pdf(
            letter_id=letter_id,
            signature_data_url=payload.signature_data_url,
            add_watermark=payload.add_watermark,
            pdf_type=pdf_type,
        )

        pdf_size = len(pdf_bytes)
        logger.info(
            "PDF generated successfully for letter %s - Size: %d bytes",
            letter_id,
            pdf_size,
        )

        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=letter_{letter_id}.pdf"
            },
        )
    except ValueError as e:
        logger.warning("Invalid letter ID format: %s", payload.letter_id)
        raise HTTPException(status_code=400, detail=f"Invalid letter ID: {e}") from e
    except ProcessingError as e:
        logger.error("Processing error for letter %s: %s", payload.letter_id, e.message)
        raise HTTPException(status_code=500, detail=e.message) from e
    except Exception as e:
        logger.error(
            "Error generating PDF for %s: %s", payload.letter_id, e, exc_info=True
        )
        raise HTTPException(
            status_code=500, detail=f"PDF generation failed: {e!s}"
        ) from e

@router.post("/reformulate-text")
async def reformulate_text(payload: ReformulateTextPayload) -> ReformulationResponse:
    """
    Reformule un texte via l'IA générative Scaleway.

    Types disponibles :
    - "corrected" : correction orthographique/grammaticale uniquement
    - "reformulated" : reformulation professionnelle complète
    """
    logger.info(
        "POST /letters/reformulate-text - Type: %s, Text length: %d chars",
        payload.type,
        len(payload.text)
    )

    try:
        # Validation du type
        if payload.type not in ("corrected", "reformulated"):
            raise HTTPException(
                status_code=400,
                detail="Type must be 'corrected' or 'reformulated'"
            )

        # Validation longueur texte
        if len(payload.text.strip()) < 10:
            raise HTTPException(
                status_code=400,
                detail="Le texte doit contenir au moins 10 caractères"
            )

        if len(payload.text) > 2000:
            raise HTTPException(
                status_code=400,
                detail="Le texte ne peut pas dépasser 2000 caractères"
            )

        # Instanciation du service AI
        ai_service = ScalewayAIService()

        # Création de la requête
        reformulation_request = ReformulationRequest(
            text=payload.text.strip(),
            type=payload.type,  # type: ignore
            context=payload.context
        )

        # Reformulation
        result = await ai_service.reformulate_text(reformulation_request)

        if not result.success:
            logger.warning("Reformulation failed: %s", result.error)
            raise HTTPException(
                status_code=500,
                detail=result.error or "Erreur lors de la reformulation"
            )

        logger.info(
            "Text reformulated successfully - Original: %d chars, New: %d chars",
            len(result.original_text),
            len(result.reformulated_text)
        )

        return result

    except HTTPException:
        raise
    except ProcessingError as e:
        logger.error("Processing error during reformulation: %s", e.message)
        raise HTTPException(status_code=500, detail=e.message) from e
    except Exception as e:
        logger.error("Unexpected error during reformulation: %s", e, exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Erreur technique lors de la reformulation: {str(e)[:100]}"
        ) from e