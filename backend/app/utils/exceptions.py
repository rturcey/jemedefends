class BaseError(Exception):
    def __init__(self, message: str, error_code: str = "GENERIC_ERROR") -> None:
        self.message = message
        self.error_code = error_code
        super().__init__(self.message)


class ValidationError(BaseError):
    pass


class ProcessingError(BaseError):
    pass


class PaymentError(BaseError):
    pass
