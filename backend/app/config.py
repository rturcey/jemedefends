from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Je me défends"
    DEBUG: bool = False
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"

    # API
    API_V1_STR: str = "/api/v1"
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:8080"]

    # Stripe
    STRIPE_SECRET_KEY: str = ""
    STRIPE_PUBLISHABLE_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""

    # Services externes
    POSTAL_API_URL: str = ""
    POSTAL_API_KEY: str = ""

    SCALEWAY_AI_API_URL: str = "https://api.scaleway.com/llm-inference/v1beta1"
    SCALEWAY_AI_API_KEY: str = ""
    SCALEWAY_AI_MODEL: str = "mistral-nemo-instruct-2407"  # Modèle FR par défaut
    SCALEWAY_AI_REGION: str = "fr-par"
    SCALEWAY_AI_PROJECT_ID: str = ""

    # Uploads
    UPLOAD_FOLDER: str = "uploads"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024

    # Database
    DATABASE_URL: str = ""
    DATABASE_POOL_SIZE: int = 10
    DATABASE_MAX_OVERFLOW: int = 20

    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/je_me_defends.log"
    LOG_ROTATION: str = "1 day"
    LOG_RETENTION: str = "30 days"
    ENABLE_SQL_LOGGING: bool = False

    # Email
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""

    model_config = {
        "env_file": ".env",
        "extra": "forbid",  # comportement par défaut - peut être omis
    }


settings = Settings()
