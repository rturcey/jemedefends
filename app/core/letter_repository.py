from __future__ import annotations

import datetime
from decimal import Decimal
from typing import Protocol, cast
from uuid import UUID, uuid4

from sqlalchemy.ext.asyncio import AsyncConnection

from app.db.generated import letter as letter_sqlc
from app.db.generated import models as models_sqlc
from app.models.letters import DefectType, LetterRequest, LetterResponse, LetterStatus
from app.utils.exceptions import ProcessingError


class LetterRepositoryProtocol(Protocol):
    """Protocol defining letter repository interface."""

    async def create_letter(self, letter_data: LetterRequest) -> UUID:
        """Create a new letter and return its ID."""
        ...

    async def get_letter_by_id(self, letter_id: UUID) -> LetterResponse | None:
        """Get letter by ID."""
        ...

    async def update_letter_content(
        self,
        letter_id: UUID,
        content: str,
        status: LetterStatus,
    ) -> bool:
        """Update letter content and status."""
        ...

    async def update_letter_status(
        self,
        letter_id: UUID,
        status: LetterStatus,
    ) -> bool:
        """Update letter status."""
        ...

    async def get_letters_by_session(self, session_id: str) -> list[LetterResponse]:
        """Get all letters for a session."""
        ...


class PostgresLetterRepository:
    """PostgreSQL implementation of letter repository using SQLAlchemy."""

    def __init__(self, db_connection: AsyncConnection) -> None:
        """Initialize repository with SQLAlchemy AsyncConnection.

        Args:
            db_connection: SQLAlchemy AsyncConnection.
        """
        self._querier = letter_sqlc.AsyncQuerier(db_connection)

    async def create_letter(self, letter_data: LetterRequest) -> UUID:
        """Create a new letter in database.

        Args:
            letter_data: Letter request data.

        Returns:
            UUID of the created letter.

        Raises:
            ProcessingError: If letter creation fails.
        """
        try:
            # Use appropriate parameters for sqlc
            params = letter_sqlc.CreateLetterParams(
                session_id=letter_data.session_id,
                buyer_name=letter_data.buyer_name,
                buyer_address=letter_data.buyer_address,
                buyer_email=letter_data.buyer_email or "",
                seller_name=letter_data.seller_name,
                seller_address=letter_data.seller_address,
                purchase_date=letter_data.purchase_date,
                product_name=letter_data.product_name,
                order_reference=letter_data.order_reference or "",
                amount=letter_data.amount,
                defect_type=cast(models_sqlc.DefectTypeEnum, letter_data.defect_type),
                defect_description=letter_data.defect_description,
            )

            result = await self._querier.create_letter(params)
            if result:
                return result.id
            else:
                raise ProcessingError(
                    "Failed to create letter - no result returned",
                    error_code="LETTER_CREATION_NO_RESULT",
                )

        except Exception as e:
            raise ProcessingError(
                f"Failed to create letter: {e}",
                error_code="LETTER_CREATION_FAILED",
            ) from e

    async def get_letter_by_id(self, letter_id: UUID) -> LetterResponse | None:
        """Get letter by ID from database.

        Args:
            letter_id: UUID of the letter to retrieve.

        Returns:
            Letter response if found, None otherwise.

        Raises:
            ProcessingError: If retrieval fails.
        """
        try:
            result = await self._querier.get_letter_by_id(id=letter_id)
            if result:
                return LetterResponse(
                    id=str(result.id),
                    session_id=result.session_id,
                    buyer_name=result.buyer_name,
                    buyer_address=result.buyer_address,
                    buyer_email=result.buyer_email,
                    seller_name=result.seller_name,
                    seller_address=result.seller_address,
                    purchase_date=result.purchase_date,
                    product_name=result.product_name,
                    order_reference=result.order_reference,
                    amount=result.amount,
                    defect_type=cast(DefectType, result.defect_type),
                    defect_description=result.defect_description,
                    content=result.letter_content or "",
                    status=LetterStatus(result.status)
                    if result.status
                    else LetterStatus.DRAFT,
                    created_at=result.created_at,
                    updated_at=result.updated_at,
                )
            else:
                return None

        except Exception as e:
            raise ProcessingError(
                f"Failed to get letter: {e}",
                error_code="LETTER_RETRIEVAL_FAILED",
            ) from e

    async def update_letter_content(
        self,
        letter_id: UUID,
        content: str,
        status: LetterStatus,
    ) -> bool:
        """Update letter content and status.

        Args:
            letter_id: UUID of the letter to update.
            content: New content for the letter.
            status: New status for the letter.

        Returns:
            True if update was successful.

        Raises:
            ProcessingError: If update fails.
        """
        try:
            result = await self._querier.update_letter_content(
                id=letter_id,
                letter_content=content,
                status=cast(models_sqlc.LetterStatusEnum, status),
            )
            return result is not None

        except Exception as e:
            raise ProcessingError(
                f"Failed to update letter content: {e}",
                error_code="LETTER_CONTENT_UPDATE_FAILED",
            ) from e

    async def update_letter_status(
        self,
        letter_id: UUID,
        status: LetterStatus,
    ) -> bool:
        """Update letter status only.

        Args:
            letter_id: UUID of the letter to update.
            status: New status for the letter.

        Returns:
            True if update was successful.

        Raises:
            ProcessingError: If update fails.
        """
        try:
            result = await self._querier.update_letter_status(
                id=letter_id,
                status=cast(models_sqlc.LetterStatusEnum, status),
            )
            return result is not None

        except Exception as e:
            raise ProcessingError(
                f"Failed to update letter status: {e}",
                error_code="LETTER_STATUS_UPDATE_FAILED",
            ) from e

    async def get_letters_by_session(self, session_id: str) -> list[LetterResponse]:
        """Get all letters for a session.

        Args:
            session_id: Session identifier.

        Returns:
            List of letters for the session.

        Raises:
            ProcessingError: If retrieval fails.
        """
        try:
            # Use the method generated by sqlc
            results = [
                letter
                async for letter in self._querier.get_letters_by_session(
                    session_id=session_id
                )
            ]

            return [
                LetterResponse(
                    id=str(result.id),
                    session_id=result.session_id,
                    buyer_name=result.buyer_name,
                    buyer_address=result.buyer_address,
                    buyer_email=result.buyer_email,
                    seller_name=result.seller_name,
                    seller_address=result.seller_address,
                    purchase_date=result.purchase_date,
                    product_name=result.product_name,
                    order_reference=result.order_reference,
                    amount=result.amount,
                    defect_type=cast(DefectType, result.defect_type),
                    defect_description=result.defect_description,
                    content=result.letter_content or "",
                    status=LetterStatus(result.status)
                    if result.status
                    else LetterStatus.DRAFT,
                    created_at=result.created_at,
                    updated_at=result.updated_at,
                )
                for result in results
            ]

        except Exception as e:
            raise ProcessingError(
                f"Failed to get session letters: {e}",
                error_code="SESSION_LETTERS_RETRIEVAL_FAILED",
            ) from e

    async def delete_letter(self, letter_id: UUID) -> bool:
        """Delete a letter.

        Args:
            letter_id: UUID of the letter to delete.

        Returns:
            True if deletion was successful.

        Raises:
            ProcessingError: If deletion fails.
        """
        try:
            await self._querier.delete_letter(id=letter_id)
            return True
        except Exception as e:
            raise ProcessingError(
                f"Failed to delete letter: {e}",
                error_code="LETTER_DELETION_FAILED",
            ) from e

    async def get_recent_letters(
        self, limit: int = 10, offset: int = 0
    ) -> list[LetterResponse]:
        """Get recent letters with pagination.

        Args:
            limit: Maximum number of letters to return.
            offset: Number of letters to skip.

        Returns:
            List of recent letters.

        Raises:
            ProcessingError: If retrieval fails.
        """
        try:
            results = [
                letter
                async for letter in self._querier.get_recent_letters(
                    page_size=limit, page_offset=offset
                )
            ]

            return [
                LetterResponse(
                    id=str(result.id),
                    session_id=result.session_id,
                    buyer_name=result.buyer_name,
                    buyer_address=result.buyer_address,
                    buyer_email=result.buyer_email,
                    seller_name=result.seller_name,
                    seller_address=result.seller_address,
                    purchase_date=result.purchase_date,
                    product_name=result.product_name,
                    order_reference=result.order_reference,
                    amount=result.amount,
                    defect_type=cast(DefectType, result.defect_type),
                    defect_description=result.defect_description,
                    content=result.letter_content or "",
                    status=LetterStatus(result.status)
                    if result.status
                    else LetterStatus.DRAFT,
                    created_at=result.created_at,
                    updated_at=result.updated_at,
                )
                for result in results
            ]

        except Exception as e:
            raise ProcessingError(
                f"Failed to get recent letters: {e}",
                error_code="RECENT_LETTERS_RETRIEVAL_FAILED",
            ) from e


class MemoryLetterRepository:
    """In-memory implementation of letter repository for testing and development."""

    def __init__(self) -> None:
        """Initialize in-memory repository."""
        self._letters: dict[
            UUID, dict[str, str | bool | datetime.date | Decimal | UUID | None]
        ] = {}
        self._counter = 0

    async def create_letter(self, letter_data: LetterRequest) -> UUID:
        """Create letter in memory.

        Args:
            letter_data: Letter request data.

        Returns:
            UUID of the created letter.
        """
        letter_id = uuid4()

        self._letters[letter_id] = {
            "id": letter_id,
            "session_id": letter_data.session_id,
            "buyer_name": letter_data.buyer_name,
            "buyer_address": letter_data.buyer_address,
            "buyer_email": letter_data.buyer_email,
            "seller_name": letter_data.seller_name,
            "seller_address": letter_data.seller_address,
            "purchase_date": letter_data.purchase_date,
            "product_name": letter_data.product_name,
            "order_reference": letter_data.order_reference,
            "amount": letter_data.amount,
            "defect_type": letter_data.defect_type,
            "defect_description": letter_data.defect_description,
            "content": "",
            "status": LetterStatus.DRAFT,
            "created_at": datetime.datetime.now(),
            "updated_at": datetime.datetime.now(),
        }

        return letter_id

    async def get_letter_by_id(self, letter_id: UUID) -> LetterResponse | None:
        """Get letter from memory.

        Args:
            letter_id: UUID of the letter to retrieve.

        Returns:
            Letter response if found, None otherwise.
        """
        if letter_data := self._letters.get(letter_id):
            return LetterResponse(
                id=str(letter_data["id"]),
                session_id=str(letter_data["session_id"]),
                buyer_name=str(letter_data["buyer_name"]),
                buyer_address=str(letter_data["buyer_address"]),
                buyer_email=str(letter_data["buyer_email"])
                if letter_data["buyer_email"]
                else None,
                seller_name=str(letter_data["seller_name"]),
                seller_address=str(letter_data["seller_address"]),
                purchase_date=letter_data["purchase_date"],
                product_name=str(letter_data["product_name"]),
                order_reference=str(letter_data["order_reference"])
                if letter_data["order_reference"]
                else None,
                amount=letter_data["amount"],
                defect_type=letter_data["defect_type"],
                defect_description=str(letter_data["defect_description"]),
                content=str(letter_data["content"]),
                status=letter_data["status"],
                created_at=letter_data["created_at"],
                updated_at=letter_data["updated_at"],
            )
        else:
            return None

    async def update_letter_content(
        self, letter_id: UUID, content: str, status: LetterStatus
    ) -> bool:
        """Update letter content in memory.

        Args:
            letter_id: UUID of the letter to update.
            content: New content for the letter.
            status: New status for the letter.

        Returns:
            True if update was successful.
        """
        if letter_id in self._letters:
            self._letters[letter_id]["content"] = content
            self._letters[letter_id]["status"] = status
            self._letters[letter_id]["updated_at"] = datetime.datetime.now()
            return True
        return False

    async def update_letter_status(self, letter_id: UUID, status: LetterStatus) -> bool:
        """Update letter status in memory.

        Args:
            letter_id: UUID of the letter to update.
            status: New status for the letter.

        Returns:
            True if update was successful.
        """
        if letter_id in self._letters:
            self._letters[letter_id]["status"] = status
            self._letters[letter_id]["updated_at"] = datetime.datetime.now()
            return True
        return False

    async def get_letters_by_session(self, session_id: str) -> list[LetterResponse]:
        """Get all letters for a session from memory.

        Args:
            session_id: Session identifier.

        Returns:
            List of letters for the session.
        """
        letters: list[LetterResponse] = []
        letters.extend(
            LetterResponse(
                id=str(letter_data["id"]),
                session_id=str(letter_data["session_id"]),
                buyer_name=str(letter_data["buyer_name"]),
                buyer_address=str(letter_data["buyer_address"]),
                buyer_email=(
                    str(letter_data["buyer_email"])
                    if letter_data["buyer_email"]
                    else None
                ),
                seller_name=str(letter_data["seller_name"]),
                seller_address=str(letter_data["seller_address"]),
                purchase_date=letter_data["purchase_date"],
                product_name=str(letter_data["product_name"]),
                order_reference=(
                    str(letter_data["order_reference"])
                    if letter_data["order_reference"]
                    else None
                ),
                amount=letter_data["amount"],
                defect_type=letter_data["defect_type"],
                defect_description=str(letter_data["defect_description"]),
                content=str(letter_data["content"]),
                status=letter_data["status"],
                created_at=letter_data["created_at"],
                updated_at=letter_data["updated_at"],
            )
            for letter_data in self._letters.values()
            if letter_data["session_id"] == session_id
        )
        return letters

    async def delete_letter(self, letter_id: UUID) -> bool:
        """Delete letter from memory.

        Args:
            letter_id: UUID of the letter to delete.

        Returns:
            True if deletion was successful.
        """
        if letter_id in self._letters:
            del self._letters[letter_id]
            return True
        return False

    async def get_recent_letters(
        self, limit: int = 10, offset: int = 0
    ) -> list[LetterResponse]:
        """Get recent letters from memory.

        Args:
            limit: Maximum number of letters to return.
            offset: Number of letters to skip.

        Returns:
            List of recent letters.
        """
        # Sort by created_at in descending order
        sorted_letters = sorted(
            self._letters.values(),
            key=lambda x: x["created_at"],
            reverse=True,
        )

        # Apply pagination
        paginated = sorted_letters[offset : offset + limit]

        return [
            LetterResponse(
                id=str(letter_data["id"]),
                session_id=str(letter_data["session_id"]),
                buyer_name=str(letter_data["buyer_name"]),
                buyer_address=str(letter_data["buyer_address"]),
                buyer_email=str(letter_data["buyer_email"])
                if letter_data["buyer_email"]
                else None,
                seller_name=str(letter_data["seller_name"]),
                seller_address=str(letter_data["seller_address"]),
                purchase_date=letter_data["purchase_date"],
                product_name=str(letter_data["product_name"]),
                order_reference=str(letter_data["order_reference"])
                if letter_data["order_reference"]
                else None,
                amount=letter_data["amount"],
                defect_type=letter_data["defect_type"],
                defect_description=str(letter_data["defect_description"]),
                content=str(letter_data["content"]),
                status=letter_data["status"],
                created_at=letter_data["created_at"],
                updated_at=letter_data["updated_at"],
            )
            for letter_data in paginated
        ]
