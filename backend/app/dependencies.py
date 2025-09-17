import logging
from collections.abc import AsyncGenerator
from typing import Annotated

from fastapi import Depends
from jinja2 import Environment, FileSystemLoader
from sqlalchemy.ext.asyncio import AsyncConnection

from app.core.form_draft_repository import PostgresFormDraftRepository
from app.core.form_draft_service import FormDraftService
from app.core.letter_generator import LetterGenerator
from app.core.letter_repository import SqlcLetterRepository
from app.core.letter_service import LetterService
from app.core.pdf_service import PDFService, create_pdf_service
from app.db.connection import get_db_connection
from core.ai_service import ScalewayAIService

logger = logging.getLogger(__name__)


async def get_database() -> AsyncGenerator[AsyncConnection, None]:
    logger.debug("Initializing database connection")
    async for db in get_db_connection():
        yield db


async def get_letter_repository(
    db: Annotated[AsyncConnection, Depends(get_database)],
) -> SqlcLetterRepository:
    logger.debug("Creating letter repository")
    return SqlcLetterRepository(db)


def get_pdf_service() -> PDFService:
    logger.debug("Creating PDF service")
    return create_pdf_service()


def get_template_env() -> Environment:
    logger.debug("Creating Jinja2 template environment")
    return Environment(
        loader=FileSystemLoader("app/templates/letters"), autoescape=True
    )


async def get_letter_service(
    repository: Annotated[SqlcLetterRepository, Depends(get_letter_repository)],
    pdf_service: Annotated[PDFService, Depends(get_pdf_service)],
    template_env: Annotated[Environment, Depends(get_template_env)],
) -> LetterService:
    logger.debug("Creating letter service")
    return LetterService(
        repository=repository,
        pdf_service=pdf_service,
        template_env=template_env,
        generator=LetterGenerator(),
    )


def get_form_draft_repository(
    db: Annotated[AsyncConnection, Depends(get_database)],
) -> PostgresFormDraftRepository:
    logger.debug("Creating form draft repository")
    return PostgresFormDraftRepository(db)


def get_form_draft_service(
    repository: Annotated[
        PostgresFormDraftRepository, Depends(get_form_draft_repository)
    ],
) -> FormDraftService:
    logger.debug("Creating form draft service")
    return FormDraftService(repository)


def get_ai_service() -> ScalewayAIService:
    logger.debug("Creating Scaleway AI service")
    return ScalewayAIService()
