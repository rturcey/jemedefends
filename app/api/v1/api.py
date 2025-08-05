from fastapi import APIRouter

from app.api.v1.endpoints import letters, payments

api_router = APIRouter()

# api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(letters.router, prefix="/letters", tags=["letters"])
# api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(payments.router, prefix="/payments", tags=["payments"])
# api_router.include_router(postal.router, prefix="/postal", tags=["postal"])
