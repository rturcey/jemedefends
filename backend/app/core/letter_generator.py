from datetime import datetime
from typing import Any

from jinja2 import Environment, FileSystemLoader

from app.core.pdf_generator import PDFGenerator
from app.models.letters import Letter


class LetterGenerator:
    def __init__(self) -> None:
        self.env = Environment(
            loader=FileSystemLoader("app/templates/letters"), autoescape=True
        )
        self.pdf_generator = PDFGenerator()

    def generate_pdf_mise_en_demeure(self, letter: Letter) -> str:
        template = self.env.get_template("pdf_mise_en_demeure.html")

        context: dict[str, Any] = {
            "letter": letter,
            "current_date": datetime.now().strftime("%d/%m/%Y"),
            "purchase_date_formatted": letter.purchase_date.strftime("%d/%m/%Y"),
            "product_price_formatted": f"{letter.product_price:.2f} €".replace(
                ".", ","
            ),
            "logo_src": self._get_logo_for_template(),
            "signature_image_src": getattr(letter, "signature_image_src", None),
        }

        return template.render(context)

    def _get_logo_for_template(self) -> str:
        try:
            return self.pdf_generator.get_logo_data_url()
        except Exception:
            return self.pdf_generator._create_logo_placeholder()
