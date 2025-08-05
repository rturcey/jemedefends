import base64
import logging
from pathlib import Path
from typing import Any

from weasyprint import HTML
from weasyprint.text.fonts import FontConfiguration

from app.models.letters import LetterRequest, PDFOptions
from app.utils.exceptions import ProcessingError

logger = logging.getLogger(__name__)


class PDFGenerator:
    """Générateur de PDF à partir de contenu HTML avec template Jinja2."""

    def __init__(self) -> None:
        """Initialise le générateur PDF avec la configuration des polices."""
        self.font_config = FontConfiguration()

        # Chemin exact du logo selon votre spécification
        self.logo_path = (
            Path(__file__).parent.parent / "static" / "images" / "logo_jemedefends.png"
        )

    def _find_logo_path(self) -> Path | None:
        """Trouve le chemin correct du logo."""
        # Tester d'abord le chemin principal
        if self.logo_path.exists():
            logger.info(f"✅ Logo trouvé: {self.logo_path}")
            return self.logo_path

        logger.warning("❌ Logo non trouvé dans le chemin {self.logo_path.absolute()}")
        return None

    def _get_logo_base64(self) -> str:
        """Convertit le logo en base64 ou retourne un placeholder."""
        if logo_path := self._find_logo_path():
            try:
                with open(logo_path, "rb") as img_file:
                    img_data = img_file.read()

                # Déterminer le type MIME
                if logo_path.suffix.lower() == ".png":
                    mime_type = "image/png"
                elif logo_path.suffix.lower() in [".jpg", ".jpeg"]:
                    mime_type = "image/jpeg"
                elif logo_path.suffix.lower() == ".svg":
                    mime_type = "image/svg+xml"
                else:
                    mime_type = "image/png"

                # Encoder en base64
                img_base64 = base64.b64encode(img_data).decode("utf-8")
                data_url = f"data:{mime_type};base64,{img_base64}"

                logger.info(f"✅ Logo converti en base64: {len(img_base64)} caractères")
                return data_url

            except Exception as e:
                logger.error(f"❌ Erreur lors de la conversion du logo: {e}")
                return self._create_logo_placeholder()

        logger.warning("⚠️ Logo non trouvé, utilisation d'un placeholder")
        return self._create_logo_placeholder()

    def _create_logo_placeholder(self) -> str:
        """Crée un logo placeholder en SVG."""
        svg_content = """<svg width="100" height="50" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="100" height="50" fill="#f0f0f0" stroke="#ccc" stroke-width="1"/>
            <text x="50" y="20" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#1a202c" font-weight="600">
                JeMeDéfends.fr
            </text>
            <text x="50" y="35" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" fill="#3182ce" font-style="italic">
                Le droit, simplement.
            </text>
        </svg>"""

        svg_base64 = base64.b64encode(svg_content.encode("utf-8")).decode("utf-8")
        return f"data:image/svg+xml;base64,{svg_base64}"

    def generate_pdf(
        self,
        html_content: str,
        options: PDFOptions,
        letter_data: LetterRequest | None = None,
    ) -> bytes:
        """
        Génère un PDF à partir du contenu HTML avec template Jinja2.

        Args:
            html_content: Contenu HTML de la lettre (déjà rendu par Jinja2)
            letter_data: Données de la lettre (optionnel, pour les logs)
            options: Options de génération PDF

        Returns:
            bytes: Contenu du PDF généré

        Raises:
            ProcessingError: Si la génération PDF échoue
        """
        try:
            session_info = letter_data.session_id if letter_data else "sans-session"
            logger.info(f"📄 Génération PDF pour la lettre {session_info}")

            # Le HTML contient déjà les variables Jinja2 remplacées
            # Nous devons juste traiter le logo si nécessaire
            html_with_logo = self._process_logo_in_html(html_content)

            # Base URL pour les ressources relatives
            base_path = Path(__file__).parent.parent
            base_url = f"file://{base_path.absolute()}/"

            logger.debug(f"🔗 Base URL utilisée: {base_url}")

            # Créer l'objet HTML WeasyPrint
            html_doc = HTML(string=html_with_logo, base_url=base_url)

            # Générer le PDF avec les options
            pdf_bytes = bytes(
                html_doc.write_pdf(
                    font_config=self.font_config,
                    presentational_hints=True,
                    optimize_images=True,
                )
            )

            logger.info(f"✅ PDF généré avec succès: {len(pdf_bytes)} bytes")
            return pdf_bytes

        except Exception as e:
            logger.error(f"❌ Erreur lors de la génération PDF: {e}")
            raise ProcessingError(
                f"Échec de la génération PDF: {e!s}",
                error_code="PDF_GENERATION_ERROR",
            ) from e

    def _process_logo_in_html(self, html_content: str) -> str:
        """
        Traite le logo dans le HTML déjà rendu.
        Remplace {{ logo_src }} par la donnée base64.
        """
        try:
            logo_base64 = self._get_logo_base64()

            processed_html = html_content.replace("{{ logo_src }}", logo_base64)

            logger.debug("✅ Logo traité dans le HTML")
            return processed_html

        except Exception as e:
            logger.warning(f"❌ Erreur lors du traitement du logo: {e}")
            # En cas d'erreur, retourner le HTML original
            return html_content

    def get_logo_data_url(self) -> str:
        """
        Méthode publique pour obtenir l'URL data du logo.
        Utile pour les tests ou l'utilisation externe.
        """
        return self._get_logo_base64()

    def check_logo_availability(self) -> dict[str, Any]:
        """
        Vérifie la disponibilité du logo et retourne des informations de diagnostic.
        """
        logo_path = self._find_logo_path()

        result = {
            "logo_found": logo_path is not None,
            "logo_path": str(logo_path) if logo_path else None,
            "file_exists": logo_path.exists() if logo_path else False,
            "file_size": logo_path.stat().st_size
            if logo_path and logo_path.exists()
            else 0,
        }

        if logo_path and logo_path.exists():
            try:
                logo_data = self._get_logo_base64()
                result["base64_length"] = len(logo_data)
                result["can_convert"] = True
            except Exception as e:
                result["can_convert"] = False
                result["conversion_error"] = str(e)

        return result
