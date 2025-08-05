# app/models/letters.py (Version mise à jour)
from datetime import date, datetime
from decimal import Decimal
from enum import Enum
from typing import ClassVar
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class DefectType(str, Enum):
    """Types de défauts pour les mises en demeure."""

    MALFUNCTION = "malfunction"
    NON_CONFORMITY = "non_conformity"
    DELIVERY_ISSUE = "delivery_issue"
    WARRANTY_REFUSAL = "warranty_refusal"
    OTHER = "other"


class LetterStatus(str, Enum):
    """Statuts des lettres."""

    DRAFT = "draft"
    GENERATED = "generated"
    PDF_CREATED = "pdf_created"
    SENT = "sent"


class ServiceType(str, Enum):
    """Types de services payants."""

    PDF_ONLY = "pdf_only"
    PDF_AND_POSTAL = "pdf_and_postal"


class LetterRequest(BaseModel):
    """Requête pour créer une lettre."""

    # Session (peut être défini automatiquement)
    session_id: str = Field(
        default="",
        min_length=0,
        max_length=255,
        description="ID de session (défini automatiquement)",
    )

    # Informations acheteur
    buyer_name: str = Field(
        ..., min_length=2, max_length=100, description="Nom et prénom de l'acheteur"
    )
    buyer_address: str = Field(
        ..., min_length=10, max_length=500, description="Adresse complète de l'acheteur"
    )
    buyer_email: EmailStr | None = Field(
        None, description="Email de l'acheteur (optionnel)"
    )

    # Informations vendeur
    seller_name: str = Field(
        ..., min_length=2, max_length=100, description="Nom de l'entreprise/vendeur"
    )
    seller_address: str = Field(
        ..., min_length=10, max_length=500, description="Adresse complète du vendeur"
    )

    # Informations achat
    purchase_date: date = Field(..., description="Date d'achat du produit")
    product_name: str = Field(
        ..., min_length=2, max_length=200, description="Nom du produit concerné"
    )
    order_reference: str | None = Field(
        None, max_length=50, description="Référence de commande (optionnel)"
    )
    amount: Decimal = Field(..., gt=0, description="Montant de l'achat en euros")

    # Informations défaut
    defect_type: DefectType = Field(..., description="Type de défaut constaté")
    defect_description: str = Field(
        ...,
        min_length=10,
        max_length=1000,
        description="Description détaillée du défaut",
    )

    class Config:
        json_schema_extra: ClassVar = {
            "example": {
                "buyer_name": "Jean Dupont",
                "buyer_address": "123 Rue de la Paix\n75001 Paris",
                "buyer_email": "jean.dupont@email.com",
                "seller_name": "Boutique Tech",
                "seller_address": "456 Avenue du Commerce\n69000 Lyon",
                "purchase_date": "2024-01-15",
                "product_name": "Smartphone XYZ",
                "order_reference": "CMD-2024-001",
                "amount": 599.99,
                "defect_type": "malfunction",
                "defect_description": "L'écran ne s'allume plus après 2 semaines d'utilisation normale.",
            }
        }


class LetterResponse(BaseModel):
    """Réponse avec les détails d'une lettre."""

    # Identifiants
    id: str = Field(..., description="ID unique de la lettre")
    session_id: str | None = Field(None, description="ID de session")

    # Informations acheteur
    buyer_name: str | None = Field(None, description="Nom de l'acheteur")
    buyer_address: str | None = Field(None, description="Adresse de l'acheteur")
    buyer_email: str | None = Field(None, description="Email de l'acheteur")

    # Informations vendeur
    seller_name: str | None = Field(None, description="Nom du vendeur")
    seller_address: str | None = Field(None, description="Adresse du vendeur")

    # Informations achat
    purchase_date: date | None = Field(None, description="Date d'achat")
    product_name: str | None = Field(None, description="Nom du produit")
    order_reference: str | None = Field(None, description="Référence de commande")
    amount: Decimal | None = Field(None, description="Montant")

    # Informations défaut
    defect_type: DefectType | None = Field(None, description="Type de défaut")
    defect_description: str | None = Field(None, description="Description du défaut")

    # Contenu et statut
    content: str = Field(default="", description="Contenu HTML de la lettre")
    status: LetterStatus = Field(
        default=LetterStatus.DRAFT, description="Statut de la lettre"
    )

    # Timestamps
    created_at: datetime = Field(..., description="Date de création")
    updated_at: datetime | None = Field(
        None, description="Date de dernière modification"
    )


class LetterSummary(BaseModel):
    """Version allégée d'une lettre pour les listes."""

    id: str
    buyer_name: str | None = None
    seller_name: str | None = None
    product_name: str | None = None
    amount: Decimal | None = None
    status: LetterStatus
    created_at: datetime


class PaymentRequest(BaseModel):
    """Requête de paiement."""

    letter_id: str = Field(..., description="ID de la lettre")
    service_type: ServiceType = Field(..., description="Type de service")
    customer_email: EmailStr | None = Field(None, description="Email du client")


class PDFOptions(BaseModel):
    """Options pour la génération PDF."""

    format: str = Field(
        default="A4",
        pattern="^(A4|Letter)$",
        description="Format du PDF (A4 ou Letter)",
    )

    class Config:
        json_schema_extra: ClassVar = {"example": {"format": "A4"}}


class EmailDeliveryOptions(BaseModel):
    """Options pour l'envoi d'email."""

    recipient: EmailStr = Field(..., description="Adresse email du destinataire")
    include_pdf: bool = Field(
        default=True, description="Inclure le PDF en pièce jointe"
    )
    custom_message: str | None = Field(
        None, max_length=500, description="Message personnalisé (optionnel)"
    )


class LetterStats(BaseModel):
    """Statistiques des lettres."""

    total_letters: int
    draft_count: int
    generated_count: int
    pdf_count: int
    sent_count: int


class SessionInfo(BaseModel):
    """Informations de session."""

    session_id: str
    letter_count: int
    latest_letter_id: str | None = None
    created_at: datetime


# ========================================
# MODÈLES POUR LES RÉPONSES API
# ========================================


class QuickGenerateResponse(BaseModel):
    """Réponse pour génération rapide."""

    letter_id: str
    status: str
    pdf_generated: bool
    email_sent: bool
    email_message: str | None = None
    session_id: str


class DownloadResponse(BaseModel):
    """Métadonnées pour téléchargement."""

    filename: str
    size: int
    content_type: str = "application/pdf"


class EmailResponse(BaseModel):
    """Réponse d'envoi email."""

    success: bool
    message: str
    recipient: str
    sent_at: datetime | None = None


class HealthResponse(BaseModel):
    """Réponse du health check."""

    status: str
    services: dict[str, str]
    timestamp: datetime


# ========================================
# MODÈLES POUR LA BASE DE DONNÉES
# ========================================


class LetterDB(BaseModel):
    """Modèle base de données (pour les migrations)."""

    id: UUID
    session_id: str
    buyer_name: str
    buyer_address: str
    buyer_email: str | None
    seller_name: str
    seller_address: str
    purchase_date: date
    product_name: str
    order_reference: str | None
    amount: Decimal
    defect_type: DefectType
    defect_description: str
    letter_content: str | None
    status: LetterStatus
    created_at: datetime
    updated_at: datetime | None

    class Config:
        from_attributes = True


# ========================================
# MODÈLES POUR LES ERREURS
# ========================================


class ErrorResponse(BaseModel):
    """Réponse d'erreur standardisée."""

    error: str
    code: str
    timestamp: datetime | None = None
    request_id: str | None = None


class ValidationErrorResponse(BaseModel):
    """Réponse d'erreur de validation."""

    error: str
    code: str
    field_errors: dict[str, list[str]] | None = None


# ========================================
# MODÈLES POUR LES VALIDATIONS
# ========================================


def validate_letter_data(letter_data: LetterRequest) -> list[str]:
    """Valide les données d'une lettre et retourne les erreurs."""
    errors = []

    if not letter_data.buyer_name.strip():
        errors.append("Le nom de l'acheteur est requis")

    if not letter_data.seller_name.strip():
        errors.append("Le nom du vendeur est requis")

    if not letter_data.product_name.strip():
        errors.append("Le nom du produit est requis")

    if not letter_data.defect_description.strip():
        errors.append("La description du défaut est requise")

    if letter_data.amount <= 0:
        errors.append("Le montant doit être positif")

    if len(letter_data.buyer_address.strip()) < 10:
        errors.append("L'adresse de l'acheteur est trop courte")

    if len(letter_data.seller_address.strip()) < 10:
        errors.append("L'adresse du vendeur est trop courte")

    # Vérifier que la date d'achat n'est pas dans le futur
    from datetime import date

    if letter_data.purchase_date > date.today():
        errors.append("La date d'achat ne peut pas être dans le futur")

    return errors


# ========================================
# UTILITAIRES
# ========================================


def letter_response_to_summary(letter: LetterResponse) -> LetterSummary:
    """Convertit une LetterResponse en LetterSummary."""
    return LetterSummary(
        id=letter.id,
        buyer_name=letter.buyer_name,
        seller_name=letter.seller_name,
        product_name=letter.product_name,
        amount=letter.amount,
        status=letter.status,
        created_at=letter.created_at,
    )


def format_amount(amount: float) -> str:
    """Formate un montant en euros."""
    return f"{amount:.2f} €".replace(".", ",")


def format_date(date_obj: date) -> str:
    """Formate une date en français."""
    return date_obj.strftime("%d/%m/%Y")
