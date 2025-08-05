from datetime import datetime
from typing import Any

from jinja2 import Environment, FileSystemLoader

from app.core.pdf_generator import PDFGenerator
from app.models.letters import LetterRequest


class LetterGenerator:
    """Générateur de lettres utilisant des templates Jinja2."""

    def __init__(self) -> None:
        self.env = Environment(
            loader=FileSystemLoader("app/templates/letters"), autoescape=True
        )

        # Instance du PDFGenerator pour obtenir le logo
        self.pdf_generator = PDFGenerator()

    def generate_pdf_mise_en_demeure(self, data: LetterRequest) -> str:
        """Génère le contenu HTML de la lettre de mise en demeure."""
        template = self.env.get_template("pdf_mise_en_demeure.html")

        # Préparer le contexte avec toutes les variables nécessaires
        context: dict[str, Any] = {
            # Variables de base
            "current_date": datetime.now().strftime("%d/%m/%Y"),
            "purchase_date_formatted": data.purchase_date.strftime("%d/%m/%Y"),
            "amount_formatted": f"{data.amount:.2f} €".replace(".", ","),
            # Logo en base64 pour le template
            "logo_src": self._get_logo_for_template(),
            # Image de signature (si fournie)
            "signature_image_src": getattr(data, "signature_image_src", None),
            # Toutes les données du modèle
            **data.model_dump(),
        }

        return template.render(context)

    def _get_logo_for_template(self) -> str:
        """Obtient le logo en base64 pour l'utiliser dans le template."""
        try:
            return self.pdf_generator.get_logo_data_url()
        except Exception as e:
            # En cas d'erreur, retourner un placeholder
            import logging

            logger = logging.getLogger(__name__)
            logger.warning(f"Impossible d'obtenir le logo pour le template: {e}")
            return self.pdf_generator._create_logo_placeholder()

    def generate_other_letter_type(
        self, data: LetterRequest, template_name: str
    ) -> str:
        """
        Génère d'autres types de lettres.
        Méthode extensible pour futurs templates.
        """
        template = self.env.get_template(f"{template_name}.html")

        context: dict[str, Any] = {
            "current_date": datetime.now().strftime("%d/%m/%Y"),
            "purchase_date_formatted": data.purchase_date.strftime("%d/%m/%Y"),
            "amount_formatted": f"{data.amount:.2f} €".replace(".", ","),
            "logo_src": self._get_logo_for_template(),
            **data.model_dump(),
        }

        return template.render(context)

    def get_available_templates(self) -> list[str]:
        """Retourne la liste des templates disponibles."""
        try:
            return self.env.list_templates()
        except Exception:
            return ["pdf_mise_en_demeure.html"]

    def validate_template_exists(self, template_name: str) -> bool:
        """Vérifie qu'un template existe."""
        try:
            self.env.get_template(template_name)
            return True
        except Exception:
            return False
