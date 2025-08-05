"""API endpoints for payment processing and pricing."""

from __future__ import annotations

from typing import Annotated, Any
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException

from app.core.payment_service import StripePaymentService
from app.dependencies import get_payment_service
from app.models.letters import PaymentRequest, ServiceType

router = APIRouter()


@router.post("/create-payment-intent")
async def create_payment_intent(
    payment_request: PaymentRequest,
    payment_service: Annotated[StripePaymentService, Depends(get_payment_service)],
) -> dict[str, Any]:
    """Create a Stripe payment intent for a letter service.

    Args:
        payment_request: Payment request with letter ID and service type.
        payment_service: Payment service dependency.

    Returns:
        Dictionary with payment intent details.

    Raises:
        HTTPException: If letter ID is invalid or payment creation fails.
    """
    try:
        letter_id = UUID(payment_request.letter_id)

        payment_intent = await payment_service.create_payment_intent(
            letter_id=letter_id,
            service_type=payment_request.service_type,
            customer_email=payment_request.customer_email,
        )

        return {
            "client_secret": payment_intent.client_secret,
            "payment_intent_id": payment_intent.payment_intent_id,
            "amount": float(payment_intent.amount),
            "currency": payment_intent.currency,
        }
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid letter ID: {e}",
        ) from e
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Payment intent creation failed: {e!s}",
        ) from e


@router.post("/confirm-payment/{payment_intent_id}")
async def confirm_payment(
    payment_intent_id: str,
    payment_service: Annotated[StripePaymentService, Depends(get_payment_service)],
) -> dict[str, Any]:
    """Confirm a payment intent.

    Args:
        payment_intent_id: Stripe payment intent ID.
        payment_service: Payment service dependency.

    Returns:
        Dictionary with confirmation status.

    Raises:
        HTTPException: If payment confirmation fails.
    """
    try:
        is_confirmed = await payment_service.confirm_payment(payment_intent_id)

        if not is_confirmed:
            raise HTTPException(
                status_code=400,
                detail="Payment not confirmed",
            )

        return {
            "status": "confirmed",
            "payment_intent_id": payment_intent_id,
            "message": "Payment confirmed successfully",
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Payment confirmation failed: {e!s}",
        ) from e


@router.get("/pricing")
async def get_pricing() -> dict[str, Any]:
    """Get pricing information for available services.

    Returns:
        Dictionary with service pricing details.
    """
    return {
        "services": {
            ServiceType.PDF_ONLY.value: {
                "name": "PDF uniquement",
                "description": (
                    "Téléchargement du PDF de votre lettre de mise en demeure"
                ),
                "price": 1.99,
                "currency": "EUR",
            },
            ServiceType.PDF_AND_POSTAL.value: {
                "name": "PDF + Envoi postal",
                "description": ("PDF + Envoi de votre lettre par courrier recommandé"),
                "price": 7.99,
                "currency": "EUR",
            },
        },
    }
