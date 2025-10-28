"""
Modèles Pydantic pour les lettres - Minimal changes
"""
from datetime import date
from decimal import Decimal
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, field_validator


# ===== ENUMS =====

class DefectType(str, Enum):
    """Types de défauts"""
    MALFUNCTION = "malfunction"
    NON_CONFORMITY = "non_conformity"
    DELIVERY_ISSUE = "delivery_issue"
    WARRANTY_REFUSAL = "warranty_refusal"
    OTHER = "other"


class RemedyPreference(str, Enum):
    """NOUVEAU : Préférence réparation/remplacement"""
    REPAIRS = "repairs"
    REPLACEMENT = "replacement"
    TERMINATION = "termination"


class LetterStatus(str, Enum):
    """Statuts d'une lettre"""
    DRAFT = "draft"
    GENERATED = "generated"
    PDF_CREATED = "pdf_created"
    SENT = "sent"


# ===== MODELS =====

class Address(BaseModel):
    """Adresse postale"""
    line1: str
    line2: Optional[str] = None
    postal_code: str
    city: str
    country: str = "France"


class LetterRequest(BaseModel):
    """Request pour créer une lettre"""
    # Buyer
    buyer_name: str
    buyer_address: Address
    buyer_email: Optional[str] = None  # Facultatif
    buyer_phone: Optional[str] = None  # NOUVEAU : Facultatif

    # Seller
    seller_name: str
    seller_address: Address

    # Purchase
    purchase_date: date
    product_name: str
    product_price: Decimal
    order_reference: Optional[str] = None
    used: bool = False
    digital: bool = False

    # Problem
    defect_description: str
    remedy_preference: RemedyPreference  # NOUVEAU : Obligatoire

    @field_validator("buyer_phone")
    @classmethod
    def validate_phone(cls, v: Optional[str]) -> Optional[str]:
        """Valide le format du téléphone s'il est fourni"""
        if v is None or v.strip() == "":
            return None
        cleaned = v.strip()
        digits = ''.join(c for c in cleaned if c.isdigit())
        if len(digits) < 10:
            raise ValueError("Le numéro de téléphone doit contenir au moins 10 chiffres")
        return cleaned


class Letter(BaseModel):
    """Lettre complète"""
    id: str
    buyer_name: str
    buyer_address: Address
    buyer_email: Optional[str] = None
    buyer_phone: Optional[str] = None
    seller_name: str
    seller_address: Address
    purchase_date: date
    product_name: str
    product_price: Decimal
    order_reference: Optional[str] = None
    defect_description: str
    remedy_preference: RemedyPreference
    content: Optional[str] = None
    status: LetterStatus
    used: bool
    digital: bool


class PDFOptions(BaseModel):
    """Options de génération PDF"""
    format: str = "A4"
    signature_data_url: Optional[str] = None
    add_watermark: bool = False