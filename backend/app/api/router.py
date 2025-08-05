import logging

from fastapi import APIRouter

from app.api.v1.endpoints import form_drafts, letters

logger = logging.getLogger(__name__)

api_router = APIRouter()

logger.debug("Setting up API routes")

api_router.include_router(
    letters.router,
    prefix="/letters",
    tags=["letters"],
)
logger.debug("Letters router included")

api_router.include_router(
    form_drafts.router,
    tags=["form-drafts"],
)
logger.debug("Form drafts router included")


@api_router.get("/health")
async def health_check() -> dict[str, str]:
    logger.info("Health check requested")
    return {"status": "healthy", "service": "je-me-defends-backend"}
