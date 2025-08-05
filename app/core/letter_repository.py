from __future__ import annotations

from dataclasses import replace
from typing import Protocol, cast
from uuid import UUID, uuid4

from sqlalchemy.ext.asyncio import AsyncConnection

from app.db.generated import letter as letter_sqlc
from app.db.generated import models as models_sqlc
from app.models.letters import DefectType, Letter, LetterRequest, LetterStatus
from app.utils.exceptions import ProcessingError


class LetterRepositoryProtocol(Protocol):
    async def create_letter(self, letter: LetterRequest) -> Letter: ...

    async def get_letter_by_id(self, letter_id: str) -> Letter | None: ...

    async def update_content(
        self,
        letter_id: str,
        content: str,
        status: LetterStatus,
    ) -> bool: ...

    async def update_letter_status(
        self,
        letter_id: str,
        status: LetterStatus,
    ) -> bool: ...


class SqlcLetterRepository:
    def __init__(self, db_connection: AsyncConnection) -> None:
        self._querier = letter_sqlc.AsyncQuerier(db_connection)

    @staticmethod
    def _db_to_letter(db_letter: models_sqlc.Letter) -> Letter:
        return Letter(
            id=str(db_letter.id),
            buyer_name=db_letter.buyer_name,
            buyer_address=db_letter.buyer_address,
            buyer_email=db_letter.buyer_email,
            seller_name=db_letter.seller_name,
            seller_address=db_letter.seller_address,
            purchase_date=db_letter.purchase_date,
            product_name=db_letter.product_name,
            product_price=db_letter.product_price,
            order_reference=db_letter.order_reference,
            defect_type=DefectType(db_letter.defect_type),
            defect_description=db_letter.defect_description,
            content=db_letter.content,
            status=LetterStatus(db_letter.status),
            used=db_letter.used,
        )

    async def create_letter(self, letter_request: LetterRequest) -> Letter:
        try:
            params = letter_sqlc.CreateLetterParams(
                buyer_name=letter_request.buyer_name,
                buyer_address=letter_request.buyer_address,
                buyer_email=letter_request.buyer_email or None,
                seller_name=letter_request.seller_name,
                seller_address=letter_request.seller_address,
                purchase_date=letter_request.purchase_date,
                product_name=letter_request.product_name,
                order_reference=letter_request.order_reference or None,
                product_price=letter_request.product_price,
                defect_type=models_sqlc.DefectTypeEnum(letter_request.defect_type),
                defect_description=letter_request.defect_description,
                used=letter_request.used,
            )

            letter = await self._querier.create_letter(params)
            if letter:
                return self._db_to_letter(letter)
            else:
                raise ProcessingError(
                    "Failed to create letter - no letter returned",
                    error_code="LETTER_CREATION_NO_letter",
                )

        except Exception as e:
            raise ProcessingError(
                f"Failed to create letter: {e}",
                error_code="LETTER_CREATION_FAILED",
            ) from e

    async def get_letter_by_id(self, letter_id: str) -> Letter | None:
        try:
            db_letter = await self._querier.get_letter_by_id(id=UUID(letter_id))
            return self._db_to_letter(db_letter) if db_letter else None
        except Exception as e:
            raise ProcessingError(
                f"Failed to get letter: {e}",
                error_code="LETTER_RETRIEVAL_FAILED",
            ) from e

    async def update_content(
        self,
        letter_id: str,
        content: str,
        status: LetterStatus,
    ) -> bool:
        try:
            letter = await self._querier.update_content(
                id=UUID(letter_id),
                content=content,
                status=cast(models_sqlc.LetterStatusEnum, status),
            )
            return letter is not None

        except Exception as e:
            raise ProcessingError(
                f"Failed to update letter content: {e}",
                error_code="LETTER_CONTENT_UPDATE_FAILED",
            ) from e

    async def update_letter_status(
        self,
        letter_id: str,
        status: LetterStatus,
    ) -> bool:
        try:
            letter = await self._querier.update_letter_status(
                id=UUID(letter_id),
                status=cast(models_sqlc.LetterStatusEnum, status),
            )
            return letter is not None

        except Exception as e:
            raise ProcessingError(
                f"Failed to update letter status: {e}",
                error_code="LETTER_STATUS_UPDATE_FAILED",
            ) from e

    async def delete_letter(self, letter_id: str) -> bool:
        try:
            await self._querier.delete_letter(id=UUID(letter_id))
            return True
        except Exception as e:
            raise ProcessingError(
                f"Failed to delete letter: {e}",
                error_code="LETTER_DELETION_FAILED",
            ) from e

    async def list_letters(self, limit: int = 10, offset: int = 0) -> list[Letter]:
        try:
            letters = [
                letter
                async for letter in self._querier.list_letters(
                    page_size=limit, page_offset=offset
                )
            ]

            return [
                Letter(
                    id=str(letter.id),
                    buyer_name=letter.buyer_name,
                    buyer_address=letter.buyer_address,
                    buyer_email=letter.buyer_email,
                    seller_name=letter.seller_name,
                    seller_address=letter.seller_address,
                    purchase_date=letter.purchase_date,
                    product_name=letter.product_name,
                    order_reference=letter.order_reference,
                    product_price=letter.product_price,
                    defect_type=cast(DefectType, letter.defect_type),
                    defect_description=letter.defect_description,
                    content=letter.content or "",
                    status=LetterStatus(letter.status),
                    used=letter.used,
                )
                for letter in letters
            ]

        except Exception as e:
            raise ProcessingError(
                f"Failed to get recent letters: {e}",
                error_code="RECENT_LETTERS_RETRIEVAL_FAILED",
            ) from e


class MemoryLetterRepository:
    def __init__(self) -> None:
        self._letters: dict[str, Letter] = {}
        self._counter = 0

    async def create_letter(self, letter: LetterRequest) -> str:
        letter_id = str(uuid4())

        self._letters[letter_id] = Letter(
            id=letter_id,
            buyer_name=letter.buyer_name,
            buyer_address=letter.buyer_address,
            buyer_email=letter.buyer_email,
            seller_name=letter.seller_name,
            seller_address=letter.seller_address,
            purchase_date=letter.purchase_date,
            product_name=letter.product_name,
            order_reference=letter.order_reference,
            product_price=letter.product_price,
            defect_type=letter.defect_type,
            defect_description=letter.defect_description,
            content="",
            status=LetterStatus.DRAFT,
            used=letter.used,
        )

        return letter_id

    async def get_letter_by_id(self, letter_id: str) -> Letter | None:
        return self._letters.get(letter_id)

    async def update_content(
        self,
        letter_id: str,
        content: str,
        status: LetterStatus,
    ) -> bool:
        letter = self._letters.get(letter_id)
        if not letter:
            return False

        letter = replace(letter, status=status, content=content)
        return True

    async def update_letter_status(
        self,
        letter_id: str,
        status: LetterStatus,
    ) -> bool:
        letter = self._letters.get(letter_id)
        if not letter:
            return False

        letter = replace(letter, status=status)
        return True

    async def delete_letter(self, letter_id: str) -> bool:
        if letter_id in self._letters:
            del self._letters[letter_id]
            return True
        return False

    async def list_letters(
        self,
        limit: int = 10,
        offset: int = 0,
    ) -> list[Letter]:
        sorted_letters = sorted(
            self._letters.values(),
            key=lambda x: x.id,
            reverse=True,
        )

        paginated = sorted_letters[offset : offset + limit]

        return [
            Letter(
                id=letter.id,
                buyer_name=letter.buyer_name,
                buyer_address=letter.buyer_address,
                buyer_email=letter.buyer_email,
                seller_name=letter.seller_name,
                seller_address=letter.seller_address,
                purchase_date=letter.purchase_date,
                product_name=letter.product_name,
                order_reference=letter.order_reference,
                product_price=letter.product_price,
                defect_type=letter.defect_type,
                defect_description=letter.defect_description,
                content="",
                status=LetterStatus.DRAFT,
                used=letter.used,
            )
            for letter in paginated
        ]
