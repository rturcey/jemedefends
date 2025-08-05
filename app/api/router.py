from fastapi import APIRouter

from app.api.v1.endpoints import form_drafts, letters, payments

api_router = APIRouter()

api_router.include_router(
    letters.router,
    prefix="/letters",
    tags=["letters"],
)

api_router.include_router(
    payments.router,
    prefix="/payments",
    tags=["payments"],
)

api_router.include_router(
    form_drafts.router,
    tags=["form-drafts"],
)



@api_router.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "healthy", "service": "je-me-defends-backend"}
