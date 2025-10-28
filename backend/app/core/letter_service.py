"""
Service de gestion des lettres - Mise à jour avec buyer_phone et remedy_preference
"""
import logging
from datetime import datetime
from decimal import Decimal
from typing import Optional, Annotated
from uuid import UUID

from jinja2 import Environment

from app.core.letter_repository import LetterRepositoryProtocol
from app.models.letters import LetterRequest, Letter, LetterStatus, PDFOptions
from core.letter_generator import LetterGenerator
from core.pdf_generator import PDFGenerator
from core.pdf_service import PDFService, PDFType
from utils.exceptions import ProcessingError

logger = logging.getLogger(__name__)


DefaultPDFOptions = Annotated[PDFOptions, "PDF options with default A4 format"]


def default_pdf_options() -> PDFOptions:
    return PDFOptions(format="A4")

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

    async def create_letter(self, letter_data: LetterRequest) -> Letter:
        """Créer une nouvelle lettre"""
        logger.info("Création d'une nouvelle lettre")

        letter = await self._repository.create_letter(letter_data)
        logger.info(f"Lettre créée avec ID: {letter.id}")
        return Letter.model_validate(letter)

    async def get_letter(self, letter_id: str) -> Optional[Letter]:
        """Récupérer une lettre par son ID"""
        logger.info(f"Récupération lettre ID: {letter_id}")

        letter = await self._repository.get_letter_by_id(letter_id)
        return Letter.model_validate(letter) if letter else None

    def _format_date(self, date_obj) -> str:
        """Formater une date pour affichage français"""
        if isinstance(date_obj, str):
            date_obj = datetime.fromisoformat(date_obj).date()

        months_fr = [
            "janvier", "février", "mars", "avril", "mai", "juin",
            "juillet", "août", "septembre", "octobre", "novembre", "décembre"
        ]

        return f"{date_obj.day} {months_fr[date_obj.month - 1]} {date_obj.year}"

    def _format_price(self, price: Decimal) -> str:
        """Formater un prix en euros"""
        return f"{price:.2f} €".replace(".", ",")

    async def generate_basic_html(self, letter_id: str) -> str:
        """
        Générer le HTML de base pour aperçu iframe
        Inclut buyer_phone et remedy_preference
        """
        logger.info(f"Génération HTML basique pour lettre {letter_id}")

        letter = await self.get_letter(letter_id)
        if not letter:
            raise ValueError(f"Lettre {letter_id} non trouvée")

        # Préparer les données pour le template
        template_data = {
            "letter": {
                "buyer_name": letter.buyer_name,
                "buyer_email": letter.buyer_email,
                "buyer_phone": letter.buyer_phone,
                "buyer_address_line_1": letter.buyer_address.line1,
                "buyer_address_line_2": letter.buyer_address.line2,
                "buyer_postal_code": letter.buyer_address.postal_code,
                "buyer_city": letter.buyer_address.city,
                "buyer_country": letter.buyer_address.country,
                "seller_name": letter.seller_name,
                "seller_address.line_1": letter.seller_address.line1,
                "seller_address.line_2": letter.seller_address.line2,
                "seller_postal_code": letter.seller_address.postal_code,
                "seller_city": letter.seller_address.city,
                "seller_country": letter.seller_address.country,
                "product_name": letter.product_name,
                "order_reference": letter.order_reference,
                "defect_description": letter.defect_description,
                "used": letter.used,
                "digital": letter.digital,
                "remedy_preference": letter.remedy_preference.value,
            },
            "purchase_date_formatted": self._format_date(letter.purchase_date),
            "product_price_formatted": self._format_price(letter.product_price),
            "current_date": datetime.now().strftime("%d/%m/%Y"),
        }

        # Charger et rendre le template
        template = self._template_env.get_template("basic_mise_en_demeure.html")
        html_content = template.render(**template_data)

        logger.info(f"HTML généré avec succès pour lettre {letter_id}")
        return html_content

    async def generate_pdf_html(
        self,
        letter_id: str,
        signature_data_url: Optional[str] = None,
    ) -> str:
        """
        Générer le HTML pour conversion PDF
        Inclut buyer_phone et remedy_preference
        """
        logger.info(f"Génération HTML PDF pour lettre {letter_id}")

        letter = await self.get_letter(letter_id)
        if not letter:
            raise ValueError(f"Lettre {letter_id} non trouvée")

        # Préparer les données pour le template PDF
        template_data = {
            "letter": {
                "buyer_name": letter.buyer_name,
                "buyer_email": letter.buyer_email,
                "buyer_phone": letter.buyer_phone,
                "buyer_address_line_1": letter.buyer_address.line1,
                "buyer_address_line_2": letter.buyer_address.line2,
                "buyer_postal_code": letter.buyer_address.postal_code,
                "buyer_city": letter.buyer_address.city,
                "buyer_country": letter.buyer_address.country,
                "seller_name": letter.seller_name,
                "seller_address.line_1": letter.seller_address.line1,
                "seller_address.line_2": letter.seller_address.line2,
                "seller_postal_code": letter.seller_address.postal_code,
                "seller_city": letter.seller_address.city,
                "seller_country": letter.seller_address.country,
                "product_name": letter.product_name,
                "order_reference": letter.order_reference,
                "defect_description": letter.defect_description,
                "used": letter.used,
                "digital": letter.digital,
                "remedy_preference": letter.remedy_preference.value,  # NOUVEAU
            },
            "purchase_date_formatted": self._format_date(letter.purchase_date),
            "product_price_formatted": self._format_price(letter.product_price),
            "current_date": datetime.now().strftime("%d/%m/%Y"),
            "signature_data_url": signature_data_url,  # Peut être None
        }

        # Charger et rendre le template PDF
        template = self._template_env.get_template("pdf_mise_en_demeure.html")
        html_content = template.render(**template_data)

        logger.info(f"HTML PDF généré avec succès pour lettre {letter_id}")
        return html_content

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
