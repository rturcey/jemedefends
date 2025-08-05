from __future__ import annotations

import logging
from dataclasses import dataclass
from datetime import datetime
from typing import Annotated

from jinja2 import Environment

from app.core.letter_generator import LetterGenerator
from app.core.letter_repository import LetterRepositoryProtocol
from app.core.pdf_generator import PDFGenerator
from app.core.pdf_service import PDFService, PDFType
from app.models.letters import LetterRequest, LetterStatus, PDFOptions
from app.utils.exceptions import ProcessingError

logger = logging.getLogger(__name__)

DefaultPDFOptions = Annotated[PDFOptions, "PDF options with default A4 format"]


def default_pdf_options() -> PDFOptions:
    return PDFOptions(format="A4")


@dataclass(slots=True, frozen=True)
class LetterResult:
    id: str
    content: str
    status: LetterStatus


class LetterService:
    def __init__(
        self,
        repository: LetterRepositoryProtocol,
        pdf_service: PDFService,
        template_env: Environment,
        generator: LetterGenerator | None = None,
    ) -> None:
        self._repository = repository
        self._pdf_service = pdf_service
        self._template_env = template_env
        self._generator = generator or LetterGenerator()
        self._pdf_generator = PDFGenerator()

    async def create_letter(
        self,
        letter_data: LetterRequest,
    ) -> LetterResult:
        try:
            logger.info(f"Creating letter {letter_data}")

            letter = await self._repository.create_letter(letter_data)
            html_content = self._generator.generate_pdf_mise_en_demeure(letter)

            await self._repository.update_content(
                letter_id=letter.id,
                content=html_content,
                status=LetterStatus.GENERATED,
            )

            return LetterResult(
                id=letter.id,
                content=str(html_content),
                status=LetterStatus.GENERATED,
            )

        except Exception as e:
            logger.error(f"Letter creation failed: {e}")
            raise ProcessingError(
                f"Letter creation failed: {e}",
                error_code="LETTER_CREATION_ERROR",
            ) from e

    async def generate_pdf(
        self,
        letter_id: str,
        pdf_options: DefaultPDFOptions | None = None,
        signature_data_url: str | None = None,
        add_watermark: bool = False,
        pdf_type: PDFType = PDFType.FINAL,
    ) -> bytes:
        pdf_options = pdf_options or default_pdf_options()
        try:
            logger.info(f"Generating PDF for letter {letter_id}")

            letter = await self._repository.get_letter_by_id(letter_id)
            if not letter:
                raise ProcessingError(
                    f"Letter not found: {letter_id}",
                    error_code="LETTER_NOT_FOUND",
                )

            context = {
                "letter": letter,
                "current_date": datetime.now().strftime("%d/%m/%Y"),
                "purchase_date_formatted": letter.purchase_date.strftime("%d/%m/%Y"),
                "product_price_formatted": f"{letter.product_price:.2f} €".replace(
                    ".", ","
                ),
                "signature_data_url": signature_data_url,
                "add_watermark": add_watermark,
                "pdf_type": pdf_type.value,
                "logo_src": self._pdf_generator.get_logo_data_url(),
            }

            template = self._template_env.get_template("pdf_mise_en_demeure.html")
            html_content = template.render(context)

            pdf_bytes = await self._pdf_service.generate_letter_pdf(
                html_content,
                pdf_type=pdf_type,
                pdf_options=pdf_options,
            )

            if pdf_type == PDFType.FINAL:
                await self._repository.update_letter_status(
                    letter_id=letter_id,
                    status=LetterStatus.PDF_CREATED,
                )

            return pdf_bytes

        except ProcessingError:
            raise
        except Exception as e:
            logger.error(f"PDF generation failed: {e}")
            raise ProcessingError(
                f"PDF generation failed: {e}",
                error_code="PDF_GENERATION_ERROR",
            ) from e

    async def generate_basic_html(self, letter_id: str) -> str:
        try:
            logger.info("Generating basic HTML for letter %s", letter_id)

            letter = await self._repository.get_letter_by_id(letter_id)
            if not letter:
                raise ProcessingError(
                    f"Letter not found: {letter_id}",
                    error_code="LETTER_NOT_FOUND",
                )

            context = {
                "letter": letter,
                "current_date": datetime.now().strftime("%d/%m/%Y"),
                "purchase_date_formatted": letter.purchase_date.strftime("%d/%m/%Y"),
                "product_price_formatted": f"{letter.product_price:.2f} €".replace(
                    ".", ","
                ),
            }

            template = self._template_env.get_template("basic_mise_en_demeure.html")
            return template.render(context)
        except ProcessingError:
            raise
        except Exception as e:
            logger.error("Basic HTML generation failed: %s", e, exc_info=True)
            raise ProcessingError(
                f"Basic HTML generation failed: {e}",
                error_code="HTML_GENERATION_ERROR",
            ) from e
