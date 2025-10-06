from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from decimal import Decimal
from enum import Enum
from typing import ClassVar

from pydantic import BaseModel, EmailStr, Field


class DefectType(str, Enum):
    MALFUNCTION = "malfunction"
    NON_CONFORMITY = "non_conformity"
    DELIVERY_ISSUE = "delivery_issue"
    WARRANTY_REFUSAL = "warranty_refusal"
    OTHER = "other"


class LetterStatus(str, Enum):
    DRAFT = "draft"
    GENERATED = "generated"
    PDF_CREATED = "pdf_created"
    SENT = "sent"


class ServiceType(str, Enum):
    PDF_ONLY = "pdf_only"
    PDF_AND_POSTAL = "pdf_and_postal"


class Address(BaseModel):
    line1: str = Field(..., min_length=2, max_length=120, description="Adresse ligne 1")
    line2: str | None = Field(
        None, min_length=2, max_length=120, description="Adresse ligne 2 (facultative)"
    )
    postal_code: str = Field(
        ...,
        min_length=2,
        max_length=20,
        description="Code postal (texte pour compatibilité internationale)",
    )
    city: str = Field(..., min_length=2, max_length=80, description="Ville")
    country: str = Field(..., min_length=2, max_length=60, description="Pays")


@dataclass(slots=True, frozen=True)
class Letter:
    id: str
    buyer_name: str
    buyer_email: str | None
    buyer_address: Address
    seller_name: str
    seller_address: Address
    order_reference: str | None
    purchase_date: date
    product_name: str
    product_price: Decimal
    defect_type: DefectType
    defect_description: str
    status: LetterStatus
    content: str | None
    used: bool
    digital: bool


class LetterRequest(BaseModel):
    buyer_name: str = Field(..., min_length=2, max_length=100)
    buyer_address: Address
    buyer_email: EmailStr | None = Field(None)
    seller_name: str = Field(..., min_length=2, max_length=100)
    seller_address: Address
    purchase_date: date = Field(...)
    product_name: str = Field(..., min_length=2, max_length=200)
    order_reference: str | None = Field(None, max_length=50)
    product_price: Decimal = Field(..., gt=0)
    defect_type: DefectType = Field(...)
    defect_description: str = Field(..., min_length=10, max_length=500)
    used: bool = Field(False)
    digital: bool = Field(False)

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
                "product_price": 599.99,
                "defect_type": "malfunction",
                "defect_description": "L'écran ne s'allume plus après 2 semaines d'utilisation normale.",
            }
        }


class PDFOptions(BaseModel):
    format: str = Field(
        default="A4",
        pattern="^(A4|Letter)$",
    )

    class Config:
        json_schema_extra: ClassVar = {"example": {"format": "A4"}}
