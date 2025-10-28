# app/core/letter_repository.py (extrait — votre fichier concerné)

from __future__ import annotations

import uuid
from typing import Protocol
from sqlalchemy.ext.asyncio import AsyncConnection

from app.db.generated import letter as letter_sqlc
from app.db.generated import models as models_sqlc
from app.models.letters import (
    Address, Letter, LetterRequest, LetterStatus, RemedyPreference
)
from app.utils.exceptions import ProcessingError
from pycountry import countries


class LetterRepositoryProtocol(Protocol):
    async def create_letter(self, letter: LetterRequest) -> Letter: ...
    async def get_letter_by_id(self, letter_id: str) -> Letter | None: ...
    async def update_content(self, letter_id: str, content: str, status: LetterStatus) -> bool: ...
    async def update_letter_status(self, letter_id: str, status: LetterStatus) -> bool: ...


class SqlcLetterRepository:
    def __init__(self, db_connection: AsyncConnection) -> None:
        self._querier = letter_sqlc.AsyncQuerier(db_connection)

    @staticmethod
    def _db_to_letter(db_letter: models_sqlc.Letter) -> Letter:
        return Letter(
            id=str(db_letter.id),
            buyer_name=db_letter.buyer_name,
            buyer_address=Address(
                line1=db_letter.buyer_address_line_1,
                line2=db_letter.buyer_address_line_2,
                postal_code=db_letter.buyer_postal_code,
                city=db_letter.buyer_city,
                country=db_letter.buyer_country,
            ),
            buyer_email=db_letter.buyer_email,
            buyer_phone=db_letter.buyer_phone,  # ✅
            seller_name=db_letter.seller_name,
            seller_address=Address(
                line1=db_letter.seller_address_line_1,
                line2=db_letter.seller_address_line_2,
                postal_code=db_letter.seller_postal_code,
                city=db_letter.seller_city,
                country=db_letter.seller_country,
            ),
            purchase_date=db_letter.purchase_date,
            product_name=db_letter.product_name,
            product_price=db_letter.product_price,
            order_reference=db_letter.order_reference,
            defect_description=db_letter.defect_description,
            remedy_preference=RemedyPreference(db_letter.remedy_preference),
            content=db_letter.content,
            status=LetterStatus(db_letter.status),
            used=db_letter.used,
            digital=db_letter.digital,
        )

    async def create_letter(self, letter_request: LetterRequest) -> Letter:
        try:
            buyer_country_name = countries.get(
                alpha_2=letter_request.buyer_address.country
            ).name
            seller_country_name = countries.get(
                alpha_2=letter_request.seller_address.country
            ).name
            params = letter_sqlc.CreateLetterParams(
                buyer_name=letter_request.buyer_name,
                buyer_email=letter_request.buyer_email,
                buyer_phone=letter_request.buyer_phone,
                buyer_address_line_1=letter_request.buyer_address.line1,
                buyer_address_line_2=letter_request.buyer_address.line2,
                buyer_postal_code=letter_request.buyer_address.postal_code,
                buyer_city=letter_request.buyer_address.city,
                buyer_country=buyer_country_name,
                seller_name=letter_request.seller_name,
                seller_address_line_1=letter_request.seller_address.line1,
                seller_address_line_2=letter_request.seller_address.line2,
                seller_postal_code=letter_request.seller_address.postal_code,
                seller_city=letter_request.seller_address.city,
                seller_country=seller_country_name,
                purchase_date=letter_request.purchase_date,
                product_name=letter_request.product_name,
                order_reference=letter_request.order_reference or None,
                product_price=letter_request.product_price,
                defect_description=letter_request.defect_description,
                remedy_preference=models_sqlc.RemedyPreferenceEnum(
                    letter_request.remedy_preference
                ),
                used=letter_request.used,
                digital=letter_request.digital,
            )

            letter = await self._querier.create_letter(params)
            if letter:
                return self._db_to_letter(letter)
            else:
                raise ProcessingError(
                    "Failed to create letter - no letter returned",
                    error_code="LETTER_CREATION_NO_LETTER",
                )

        except Exception as e:
            raise ProcessingError(
                f"Failed to create letter: {e}",
                error_code="LETTER_CREATION_FAILED",
            ) from e

    async def get_letter_by_id(self, letter_id: str) -> Letter | None:
        try:
            db_letter = await self._querier.get_letter_by_id(id=uuid.UUID(letter_id))
            return self._db_to_letter(db_letter) if db_letter else None
        except Exception as e:
            raise ProcessingError(
                f"Failed to get letter: {e}",
                error_code="LETTER_GET_FAILED",
            ) from e

    async def update_content(self, letter_id: str, content: str, status: LetterStatus) -> bool:
        try:
            await self._querier.update_content(
                id=uuid.UUID(letter_id),
                content=content,
                status=models_sqlc.LetterStatusEnum(status),
            )
            return True
        except Exception as e:
            raise ProcessingError(
                f"Failed to update content: {e}",
                error_code="LETTER_UPDATE_FAILED",
            ) from e

    async def update_letter_status(self, letter_id: str, status: LetterStatus) -> bool:
        try:
            await self._querier.update_letter_status(
                id=uuid.UUID(letter_id),
                status=models_sqlc.LetterStatusEnum(status),
            )
            return True
        except Exception as e:
            raise ProcessingError(
                f"Failed to update status: {e}",
                error_code="LETTER_STATUS_UPDATE_FAILED",
            ) from e
