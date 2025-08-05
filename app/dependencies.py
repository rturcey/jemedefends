from collections.abc import AsyncGenerator
from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncConnection

from app.core.form_draft_repository import PostgresFormDraftRepository
from app.core.form_draft_service import FormDraftService
from app.core.letter_generator import LetterGenerator
from app.core.letter_repository import PostgresLetterRepository
from app.core.letter_service import LetterService
from app.core.payment_service import ServicePricing, StripePaymentService
from app.db.connection import get_db_connection


async def get_database() -> AsyncGenerator[AsyncConnection, None]:
    """Database dependency avec SQLAlchemy AsyncConnection."""
    async for db in get_db_connection():
        yield db


async def get_letter_repository(
    db: Annotated[AsyncConnection, Depends(get_database)],
) -> PostgresLetterRepository:
    """Letter repository dependency."""
    return PostgresLetterRepository(db)


async def get_letter_service(
    repository: Annotated[PostgresLetterRepository, Depends(get_letter_repository)],
) -> LetterService:
    """Letter service dependency."""
    generator = LetterGenerator()
    return LetterService(repository, generator)


async def get_payment_service() -> StripePaymentService:
    """Payment service dependency."""
    return StripePaymentService(
        pricing=ServicePricing(),
    )


def get_form_draft_repository(
    db: Annotated[AsyncConnection, Depends(get_database)],
) -> PostgresFormDraftRepository:
    return PostgresFormDraftRepository(db)


# ---- Service provider ----
def get_form_draft_service(
    repository: Annotated[
        PostgresFormDraftRepository, Depends(get_form_draft_repository)
    ],
) -> FormDraftService:
    return FormDraftService(repository)
