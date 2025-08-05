from dataclasses import dataclass
from decimal import Decimal
from typing import Protocol
from uuid import UUID

import stripe

from app.config import settings
from app.models.letters import ServiceType
from app.utils.exceptions import PaymentError


@dataclass(frozen=True)
class PaymentIntent:
    """Payment intent information."""

    client_secret: str
    payment_intent_id: str
    amount: Decimal
    currency: str


@dataclass(frozen=True)
class ServicePricing:
    """Service pricing configuration."""

    pdf_only_price: Decimal = Decimal("1.99")
    pdf_and_postal_price: Decimal = Decimal("7.99")
    currency: str = "eur"


class PaymentServiceProtocol(Protocol):
    """Protocol for payment service."""

    async def create_payment_intent(
        self,
        letter_id: UUID,
        service_type: ServiceType,
        customer_email: str | None = None,
    ) -> PaymentIntent:
        """Create Stripe payment intent."""
        ...


class StripePaymentService:
    """Stripe payment service implementation."""

    def __init__(self, pricing: ServicePricing) -> None:
        stripe.api_key = settings.STRIPE_SECRET_KEY
        self.pricing = pricing

    async def create_payment_intent(
        self,
        letter_id: UUID,
        service_type: ServiceType,
        customer_email: str | None = None,
    ) -> PaymentIntent:
        """Create Stripe payment intent for letter service."""
        amount = self._get_service_amount(service_type)

        try:
            intent = stripe.PaymentIntent.create(
                amount=int(amount * 100),  # Stripe expects cents
                currency=self.pricing.currency,
                metadata={
                    "letter_id": str(letter_id),
                    "service_type": service_type.value,
                },
                receipt_email=customer_email,
            )

            return PaymentIntent(
                client_secret=intent.client_secret,
                payment_intent_id=intent.id,
                amount=amount,
                currency=self.pricing.currency,
            )

        except stripe.StripeError as e:
            raise PaymentError(
                f"Stripe payment creation failed: {e}",
                error_code="STRIPE_ERROR",
            ) from e

    async def confirm_payment(self, payment_intent_id: str) -> bool:
        """Confirm payment status with Stripe."""
        try:
            intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            return intent.status == "succeeded"

        except stripe.StripeError as e:
            raise PaymentError(
                f"Payment confirmation failed: {e}",
                error_code="PAYMENT_CONFIRMATION_ERROR",
            ) from e

    def _get_service_amount(self, service_type: ServiceType) -> Decimal:
        """Get amount for service type."""
        match service_type:
            case ServiceType.PDF_ONLY:
                return self.pricing.pdf_only_price
            case ServiceType.PDF_AND_POSTAL:
                return self.pricing.pdf_and_postal_price
            case _:
                raise PaymentError(
                    f"Unknown service type: {service_type}",
                    error_code="UNKNOWN_SERVICE_TYPE",
                )
