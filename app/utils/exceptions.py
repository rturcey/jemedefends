# app/utils/exceptions.py
"""Custom exceptions for the application."""


class BaseError(Exception):
    """Base exception for the application."""

    def __init__(self, message: str, error_code: str = "GENERIC_ERROR") -> None:
        self.message = message
        self.error_code = error_code
        super().__init__(self.message)


class ValidationError(BaseError):
    """Raised when validation fails."""

    pass


class ProcessingError(BaseError):
    """Raised when processing fails."""

    pass


class PaymentError(BaseError):
    """Raised when payment operations fail."""

    pass


class PDFGenerationError(ProcessingError):
    """Raised when PDF generation fails."""

    def __init__(self, message: str = "PDF generation failed") -> None:
        super().__init__(message, "PDF_GENERATION_ERROR")


class TemplateError(ProcessingError):
    """Raised when template processing fails."""

    def __init__(self, message: str = "Template processing failed") -> None:
        super().__init__(message, "TEMPLATE_ERROR")


class DatabaseError(BaseError):
    """Raised when database operations fail."""

    def __init__(self, message: str = "Database operation failed") -> None:
        super().__init__(message, "DATABASE_ERROR")


class LetterNotFoundError(BaseError):
    """Raised when a letter is not found."""

    def __init__(self, letter_id: str) -> None:
        message = f"Letter not found: {letter_id}"
        super().__init__(message, "LETTER_NOT_FOUND")


class SessionError(BaseError):
    """Raised when session operations fail."""

    def __init__(self, message: str = "Session operation failed") -> None:
        super().__init__(message, "SESSION_ERROR")
