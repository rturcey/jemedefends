"""Service for comprehensive letter management including generation, PDF, and email."""

from __future__ import annotations

import logging
import smtplib
from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path
from typing import Annotated
from uuid import UUID

from app.config import settings
from app.core.letter_generator import LetterGenerator
from app.core.letter_repository import LetterRepositoryProtocol
from app.core.pdf_generator import PDFGenerator
from app.models.letters import LetterRequest, LetterResponse, LetterStatus, PDFOptions
from app.utils.exceptions import ProcessingError, ValidationError

logger = logging.getLogger(__name__)

# Type alias for PDFOptions with default factory
DefaultPDFOptions = Annotated[PDFOptions, "PDF options with default A4 format"]


def default_pdf_options() -> PDFOptions:
    """Create default PDF options."""
    return PDFOptions(format="A4")


@dataclass(frozen=True)
class LetterResult:
    """Complete result of letter creation.

    Attributes:
        letter_id: UUID of the created letter.
        content: HTML content of the letter.
        pdf_bytes: Generated PDF bytes if requested.
        pdf_filename: Filename for the PDF.
        email_sent: Whether email was sent successfully.
        email_message: Status message for email sending.
        status: Current status of the letter.
    """

    letter_id: UUID
    content: str
    pdf_bytes: bytes | None = None
    pdf_filename: str | None = None
    email_sent: bool = False
    email_message: str | None = None
    status: LetterStatus = LetterStatus.GENERATED


class LetterService:
    """Unified service for complete letter management.

    Responsibilities:
    - Letter creation and generation
    - PDF generation
    - Email sending
    - Storage management
    """

    def __init__(
        self,
        repository: LetterRepositoryProtocol,
        generator: LetterGenerator,
        pdf_generator: PDFGenerator | None = None,
    ) -> None:
        """Initialize letter service.

        Args:
            repository: Letter repository for data persistence.
            generator: Letter content generator.
            pdf_generator: PDF generator (optional, will create default if None).
        """
        self.repository = repository
        self.generator = generator
        self.pdf_generator = pdf_generator or PDFGenerator()

        # Email configuration
        self.smtp_host = getattr(settings, "SMTP_HOST", "localhost")
        self.smtp_port = getattr(settings, "SMTP_PORT", 587)
        self.smtp_user = getattr(settings, "SMTP_USER", None)
        self.smtp_password = getattr(settings, "SMTP_PASSWORD", None)
        self.from_email = self.smtp_user or "noreply@jemedefends.fr"
        self.from_name = "JeMeDéfends.fr"

    # ========================================
    # PUBLIC API METHODS
    # ========================================

    async def create_letter(
        self,
        letter_data: LetterRequest,
        pdf_options: DefaultPDFOptions = default_pdf_options(),  # noqa: B008
        generate_pdf: bool = False,
        send_email: bool = False,
        email_address: str | None = None,
    ) -> LetterResult:
        """Main method: create a letter with options.

        Args:
            letter_data: Letter data for generation.
            pdf_options: PDF generation options (defaults to A4).
            generate_pdf: Whether to generate PDF.
            send_email: Whether to send email.
            email_address: Email destination address.

        Returns:
            LetterResult with all generated information.

        Raises:
            ProcessingError: If letter creation fails.
            ValidationError: If letter data is invalid.
        """
        self._validate_letter_data(letter_data)

        try:
            logger.info(f"🚀 Creating letter for session {letter_data.session_id}")
            logger.info(f"📄 PDF: {generate_pdf}, 📧 Email: {send_email}")

            # 1. Create letter and generate HTML content
            letter_id = await self.repository.create_letter(letter_data)
            html_content = self.generator.generate_pdf_mise_en_demeure(letter_data)

            # 2. Save content to database
            await self.repository.update_letter_content(
                letter_id=letter_id,
                content=html_content,
                status=LetterStatus.GENERATED,
            )

            result = LetterResult(
                letter_id=letter_id,
                content=str(html_content),
                status=LetterStatus.GENERATED,
            )

            # 3. Generate PDF if requested
            if generate_pdf:
                result = await self._add_pdf_to_result(result, letter_data, pdf_options)

            # 4. Send email if requested
            if send_email and email_address and result.pdf_bytes:
                result = await self._add_email_to_result(
                    result, letter_data, email_address
                )
            logger.info(
                f"✅ Letter created - ID: {letter_id}, PDF: {generate_pdf}, "
                f"Email: {send_email}"
            )
            return result

        except Exception as e:
            logger.error(f"❌ Letter creation error: {e}")
            raise ProcessingError(
                f"Letter creation failed: {e}",
                error_code="LETTER_CREATION_ERROR",
            ) from e

    async def get_letter(self, letter_id: UUID) -> LetterResponse | None:
        """Retrieve a letter by ID.

        Args:
            letter_id: UUID of the letter to retrieve.

        Returns:
            Letter response if found, None otherwise.

        Raises:
            ProcessingError: If retrieval fails.
        """
        try:
            return await self.repository.get_letter_by_id(letter_id)
        except Exception as e:
            logger.error(f"Failed to retrieve letter {letter_id}: {e}")
            raise ProcessingError(
                f"Failed to retrieve letter: {e}",
                error_code="LETTER_RETRIEVAL_ERROR",
            ) from e

    async def generate_pdf(
        self,
        letter_id: UUID,
        pdf_options: DefaultPDFOptions = default_pdf_options(),  # noqa: B008
    ) -> bytes:
        """Generate PDF for an existing letter.

        Args:
            letter_id: UUID of the letter.
            pdf_options: PDF generation options.

        Returns:
            PDF bytes.

        Raises:
            ProcessingError: If PDF generation fails.
        """
        try:
            logger.info(f"📄 Generating PDF for letter {letter_id}")

            letter = await self.repository.get_letter_by_id(letter_id)
            if not letter:
                raise ProcessingError(
                    f"Letter not found: {letter_id}",
                    error_code="LETTER_NOT_FOUND",
                )

            if not letter.content:
                raise ProcessingError(
                    f"Letter content not available: {letter_id}",
                    error_code="LETTER_CONTENT_MISSING",
                )

            # Convertir letter.content en string (gère TextClause et autres types SQLAlchemy)
            html_content = str(letter.content)

            # Validation supplémentaire pour s'assurer du contenu
            if not html_content or not html_content.strip():
                raise ProcessingError(
                    f"Letter content is empty for letter {letter_id}",
                    error_code="EMPTY_CONTENT",
                )

            # Generate PDF from stored HTML content
            pdf_bytes = self.pdf_generator.generate_pdf(
                html_content,
                pdf_options,
            )

            # Update status
            await self.repository.update_letter_status(
                letter_id=letter_id,
                status=LetterStatus.PDF_CREATED,
            )

            logger.info(f"✅ PDF generated: {len(pdf_bytes)} bytes")
            return pdf_bytes
        except ProcessingError:
            raise
        except Exception as e:
            logger.error(f"❌ PDF generation failed: {e}")
            raise ProcessingError(
                f"PDF generation failed: {e}",
                error_code="PDF_GENERATION_ERROR",
            ) from e

    async def send_email(
        self,
        letter_id: UUID,
        email_address: str,
        pdf_options: DefaultPDFOptions = default_pdf_options(),  # noqa: B008
        include_pdf: bool = True,
    ) -> tuple[bool, str]:
        """Send a letter by email.

        Args:
            letter_id: UUID of the letter to send.
            email_address: Destination email address.
            pdf_options: PDF generation options.
            include_pdf: Whether to include PDF attachment.

        Returns:
            Tuple of (success, message).

        Raises:
            ProcessingError: If email sending fails.
        """
        try:
            logger.info(f"📧 Sending email for letter {letter_id} to {email_address}")

            # Retrieve letter
            letter = await self.repository.get_letter_by_id(letter_id)
            if not letter:
                raise ProcessingError(
                    f"Letter not found: {letter_id}",
                    error_code="LETTER_NOT_FOUND",
                )

            pdf_bytes = (
                await self.generate_pdf(letter_id, pdf_options) if include_pdf else None
            )

            # Convert for email
            letter_data = self._letter_response_to_request(letter, email_address)

            # Send email
            return await self._send_email_internal(
                email_address, letter_data, pdf_bytes
            )

        except ProcessingError:
            raise
        except Exception as e:
            logger.error(f"❌ Email sending failed: {e}")
            raise ProcessingError(
                f"Email sending failed: {e}",
                error_code="EMAIL_SEND_ERROR",
            ) from e

    # ========================================
    # INTERNAL METHODS
    # ========================================

    async def _add_pdf_to_result(
        self,
        result: LetterResult,
        letter_data: LetterRequest,
        pdf_options: PDFOptions,
    ) -> LetterResult:
        """Add PDF to result.

        Args:
            result: Current letter result.
            letter_data: Letter request data.
            pdf_options: PDF generation options.

        Returns:
            Updated result with PDF.
        """
        pdf_bytes = self.pdf_generator.generate_pdf(
            result.content,
            pdf_options,
        )

        # Update status in database
        await self.repository.update_letter_status(
            letter_id=result.letter_id,
            status=LetterStatus.PDF_CREATED,
        )

        # Generate filename
        date_str = datetime.now().strftime("%Y%m%d")
        pdf_filename = f"pdf_mise_en_demeure_{date_str}.pdf"

        return LetterResult(
            letter_id=result.letter_id,
            content=result.content,
            pdf_bytes=pdf_bytes,
            pdf_filename=pdf_filename,
            email_sent=result.email_sent,
            email_message=result.email_message,
            status=LetterStatus.PDF_CREATED,
        )

    async def _add_email_to_result(
        self,
        result: LetterResult,
        letter_data: LetterRequest,
        email_address: str,
    ) -> LetterResult:
        """Add email sending to result.

        Args:
            result: Current letter result.
            letter_data: Letter request data.
            email_address: Destination email address.

        Returns:
            Updated result with email status.
        """
        email_sent, email_message = await self._send_email_internal(
            email_address, letter_data, result.pdf_bytes
        )

        return LetterResult(
            letter_id=result.letter_id,
            content=result.content,
            pdf_bytes=result.pdf_bytes,
            pdf_filename=result.pdf_filename,
            email_sent=email_sent,
            email_message=email_message,
            status=result.status,
        )

    async def _send_email_internal(
        self,
        email_address: str,
        letter_data: LetterRequest,
        pdf_bytes: bytes | None = None,
    ) -> tuple[bool, str]:
        """Internal email sending logic.

        Args:
            email_address: Destination email address.
            letter_data: Letter request data.
            pdf_bytes: Optional PDF bytes to attach.

        Returns:
            Tuple of (success, message).
        """
        try:
            # Create email message
            msg = self._create_email_message(email_address, letter_data, pdf_bytes)

            # Send based on configuration
            if self._is_smtp_configured():
                await self._send_via_smtp(msg, email_address)
                message = "Email sent successfully"
            else:
                await self._simulate_email_send(msg, email_address)
                message = "Email simulated (SMTP not configured)"

            return True, message

        except Exception as e:
            logger.error(f"❌ Email sending error: {e}")
            return False, f"Email sending error: {e!s}"

    def _create_email_message(
        self,
        email_address: str,
        letter_data: LetterRequest,
        pdf_bytes: bytes | None = None,
    ) -> MIMEMultipart:
        """Create email message.

        Args:
            email_address: Destination email address.
            letter_data: Letter request data.
            pdf_bytes: Optional PDF bytes to attach.

        Returns:
            Configured email message.
        """
        msg = MIMEMultipart()
        msg["From"] = f"{self.from_name} <{self.from_email}>"
        msg["To"] = email_address
        msg["Subject"] = f"Votre lettre de mise en demeure - {letter_data.product_name}"

        # Message body
        body = self._create_email_body(letter_data)
        msg.attach(MIMEText(body, "plain", "utf-8"))

        # PDF attachment if available
        if pdf_bytes:
            date_str = datetime.now().strftime("%Y%m%d")
            filename = f"pdf_mise_en_demeure_{date_str}.pdf"

            pdf_part = MIMEApplication(pdf_bytes, "pdf")
            pdf_part.add_header("Content-Disposition", "attachment", filename=filename)
            msg.attach(pdf_part)

        return msg

    def _create_email_body(self, letter_data: LetterRequest) -> str:
        """Create email body.

        Args:
            letter_data: Letter request data.

        Returns:
            Email body text.
        """
        return f"""Bonjour {letter_data.buyer_name},

Votre lettre de mise en demeure a été générée avec succès !

📄 Détails de votre lettre :
• Produit concerné : {letter_data.product_name}
• Date d'achat : {letter_data.purchase_date.strftime("%d/%m/%Y")}
• Montant : {letter_data.amount:.2f} €
• Destinataire : {letter_data.seller_name}

📋 Prochaines étapes recommandées :
1. Imprimer la lettre ci-jointe
2. L'envoyer en recommandé avec accusé de réception
3. Conserver une copie et la preuve d'envoi
4. Attendre la réponse dans les 14 jours calendaires

⚖️ Informations légales :
Cette lettre est basée sur les articles L.217-3 et suivants du Code de la consommation.

Cordialement,
L'équipe JeMeDéfends.fr
Le droit, simplement.

---
Cet email a été envoyé automatiquement.
"""

    def _is_smtp_configured(self) -> bool:
        """Check if SMTP is configured.

        Returns:
            True if SMTP is properly configured.
        """
        return bool(
            self.smtp_host
            and self.smtp_host != "localhost"
            and self.smtp_user
            and self.smtp_password
        )

    async def _send_via_smtp(self, msg: MIMEMultipart, recipient: str) -> None:
        """Send via real SMTP.

        Args:
            msg: Email message to send.
            recipient: Recipient email address.
        """
        with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
            server.starttls()
            if self.smtp_user and self.smtp_password:
                server.login(self.smtp_user, self.smtp_password)
            server.send_message(msg)

        logger.info(f"✅ SMTP email sent to {recipient}")

    async def _simulate_email_send(self, msg: MIMEMultipart, recipient: str) -> None:
        """Simulate email sending.

        Args:
            msg: Email message to simulate.
            recipient: Recipient email address.
        """
        logger.info(f"📧 SIMULATION - Email to {recipient}")
        logger.info(f"📋 Subject: {msg['Subject']}")

        # Save for debug if in development mode
        if getattr(settings, "DEBUG", False):
            debug_dir = Path("debug_emails")
            debug_dir.mkdir(exist_ok=True)

            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = (
                debug_dir / f"email_{timestamp}_{recipient.replace('@', '_')}.eml"
            )

            with open(filename, "w", encoding="utf-8") as f:
                f.write(msg.as_string())

    def _letter_response_to_request(
        self, letter: LetterResponse, email_address: str
    ) -> LetterRequest:
        """Convert LetterResponse to LetterRequest for email.

        Args:
            letter: Letter response from database.
            email_address: Email address for the request.

        Returns:
            Letter request object.
        """
        from app.models.letters import DefectType

        return LetterRequest(
            session_id=letter.session_id or "unknown",
            buyer_name=letter.buyer_name or "Client",
            buyer_address=letter.buyer_address or "Adresse non disponible",
            buyer_email=email_address,
            seller_name=letter.seller_name or "Destinataire",
            seller_address=letter.seller_address or "Adresse destinataire",
            purchase_date=letter.purchase_date or datetime.now().date(),
            product_name=letter.product_name or "Produit",
            amount=letter.amount or Decimal(0),
            defect_type=letter.defect_type or DefectType.OTHER,
            defect_description=letter.defect_description or "Voir lettre jointe",
            order_reference=letter.order_reference,
        )

    def _validate_letter_data(self, letter_data: LetterRequest) -> None:
        """Validate letter data.

        Args:
            letter_data: Letter data to validate.

        Raises:
            ValidationError: If validation fails.
        """
        if not letter_data.buyer_name.strip():
            raise ValidationError(
                "Buyer name is required",
                error_code="BUYER_NAME_REQUIRED",
            )

        if not letter_data.seller_name.strip():
            raise ValidationError(
                "Seller name is required",
                error_code="SELLER_NAME_REQUIRED",
            )

        if not letter_data.product_name.strip():
            raise ValidationError(
                "Product name is required",
                error_code="PRODUCT_NAME_REQUIRED",
            )

        if not letter_data.defect_description.strip():
            raise ValidationError(
                "Defect description is required",
                error_code="DEFECT_DESCRIPTION_REQUIRED",
            )

        if letter_data.amount <= 0:
            raise ValidationError(
                "Amount must be positive",
                error_code="INVALID_AMOUNT",
            )

    # ========================================
    # COMPATIBILITY METHODS
    # ========================================

    async def create_and_generate_letter(
        self, letter_data: LetterRequest
    ) -> LetterResult:
        """Compatibility method - create letter only without PDF.

        Args:
            letter_data: Letter request data.

        Returns:
            Letter result without PDF.
        """
        return await self.create_letter(
            letter_data=letter_data,
            generate_pdf=False,
            send_email=False,
        )

    async def generate_pdf_from_id(self, letter_id: UUID, options: PDFOptions) -> bytes:
        """Compatibility method - generate PDF from ID.

        Args:
            letter_id: UUID of the letter.
            options: PDF generation options.

        Returns:
            PDF bytes.
        """
        return await self.generate_pdf(letter_id, options)

    async def get_session_letters(self, session_id: str) -> list[LetterResponse]:
        """Retrieve all letters from a session.

        Args:
            session_id: Session identifier.

        Returns:
            List of letters for the session.

        Raises:
            ProcessingError: If retrieval fails.
        """
        try:
            return await self.repository.get_letters_by_session(session_id)
        except Exception as e:
            logger.error(f"Failed to retrieve letters for session {session_id}: {e}")
            raise ProcessingError(
                f"Failed to retrieve session letters: {e}",
                error_code="SESSION_LETTERS_RETRIEVAL_ERROR",
            ) from e
