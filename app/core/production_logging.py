import logging
import sys
from logging.handlers import RotatingFileHandler, TimedRotatingFileHandler
from pathlib import Path

import structlog

from app.config import settings


class ProductionLoggingSetup:
    """Production-ready logging configuration."""

    def __init__(self) -> None:
        self.log_dir = Path("logs")
        self.log_dir.mkdir(exist_ok=True)

    def configure_production_logging(self) -> None:
        """Configure logging for production environment."""
        # Create formatters
        json_formatter = logging.Formatter(
            '{"timestamp": "%(asctime)s", "level": "%(levelname)s", '
            '"logger": "%(name)s", "message": "%(message)s", '
            '"module": "%(module)s", "function": "%(funcName)s", '
            '"line": %(lineno)d}'
        )

        # Configure handlers
        handlers: list[logging.Handler] = []

        # Console handler for errors only
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(logging.ERROR)
        console_handler.setFormatter(json_formatter)
        handlers.append(console_handler)

        # Main application log (rotating)
        app_handler = RotatingFileHandler(
            filename=self.log_dir / "app.log",
            maxBytes=50 * 1024 * 1024,  # 50MB
            backupCount=10,
            encoding="utf-8",
        )
        app_handler.setLevel(logging.INFO)
        app_handler.setFormatter(json_formatter)
        handlers.append(app_handler)

        # Error log (time-based rotation)
        error_handler = TimedRotatingFileHandler(
            filename=self.log_dir / "errors.log",
            when="midnight",
            interval=1,
            backupCount=30,
            encoding="utf-8",
        )
        error_handler.setLevel(logging.ERROR)
        error_handler.setFormatter(json_formatter)
        handlers.append(error_handler)

        # HTTP requests log
        http_handler = TimedRotatingFileHandler(
            filename=self.log_dir / "http.log",
            when="midnight",
            interval=1,
            backupCount=7,
            encoding="utf-8",
        )
        http_handler.setLevel(logging.INFO)
        http_handler.setFormatter(json_formatter)

        # Configure root logger
        logging.basicConfig(
            level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO),
            handlers=handlers,
            format="%(message)s",
        )

        # Configure HTTP logger separately
        http_logger = logging.getLogger("http")
        http_logger.addHandler(http_handler)
        http_logger.setLevel(logging.INFO)

        # Configure structlog for production
        structlog.configure(
            processors=[
                structlog.stdlib.filter_by_level,
                structlog.stdlib.add_logger_name,
                structlog.stdlib.add_log_level,
                structlog.stdlib.PositionalArgumentsFormatter(),
                structlog.processors.TimeStamper(fmt="ISO"),
                structlog.processors.StackInfoRenderer(),
                structlog.processors.dict_tracebacks,
                structlog.processors.JSONRenderer(),
            ],
            context_class=dict,
            logger_factory=structlog.stdlib.LoggerFactory(),
            wrapper_class=structlog.stdlib.BoundLogger,
            cache_logger_on_first_use=True,
        )
