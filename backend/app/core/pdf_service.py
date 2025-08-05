import logging
from enum import Enum

from app.core.pdf_generator import PDFGenerator
from app.models.letters import PDFOptions
from app.utils.exceptions import ProcessingError

logger = logging.getLogger(__name__)


class PDFType(str, Enum):
    FINAL = "final"
    PREVIEW = "preview"


class PDFService:
    def __init__(self, pdf_generator: PDFGenerator) -> None:
        self.pdf_generator = pdf_generator

    async def generate_letter_pdf(
        self,
        html_content: str,
        *,
        pdf_type: PDFType = PDFType.FINAL,
        pdf_options: PDFOptions | None = None,
    ) -> bytes:
        try:
            logger.info(f"Generating PDF type={pdf_type}")

            if pdf_options is None:
                pdf_options = PDFOptions(format="A4")

            pdf_bytes = self.pdf_generator.generate_pdf(
                html_content,
            )

            logger.info(f"PDF generated: {len(pdf_bytes)} bytes")
            return pdf_bytes

        except Exception as e:
            logger.error(f"PDF generation error: {e}")
            raise ProcessingError(
                f"PDF generation failed: {e}",
                error_code="PDF_GENERATION_ERROR",
            ) from e


def create_pdf_service() -> PDFService:
    pdf_generator = PDFGenerator()
    return PDFService(pdf_generator)
