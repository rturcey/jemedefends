from __future__ import annotations

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncConnection, AsyncEngine, create_async_engine

from app.config import settings


class DatabasePool:
    """SQLAlchemy async engine manager."""

    def __init__(self) -> None:
        """Initialize database engine manager."""
        self._engine: AsyncEngine | None = None

    async def create_engine(self) -> None:
        """Create SQLAlchemy async engine."""
        # Convertir l'URL PostgreSQL pour SQLAlchemy
        # asyncpg://user:pass@host/db -> postgresql+asyncpg://user:pass@host/db
        sqlalchemy_url = settings.DATABASE_URL.replace(
            "postgresql://", "postgresql+asyncpg://"
        )
        if sqlalchemy_url.startswith("postgres://"):
            sqlalchemy_url = sqlalchemy_url.replace(
                "postgres://", "postgresql+asyncpg://"
            )

        self._engine = create_async_engine(
            sqlalchemy_url,
            pool_size=settings.DATABASE_POOL_SIZE,
            max_overflow=10,
            pool_pre_ping=True,
            echo=False,  # Mettre à True pour debug SQL
        )

    async def close_engine(self) -> None:
        """Close SQLAlchemy async engine."""
        if self._engine:
            await self._engine.dispose()

    async def get_connection(
        self,
    ) -> AsyncGenerator[AsyncConnection, None]:
        """Get database connection from engine."""
        if not self._engine:
            await self.create_engine()

        if self._engine:
            async with self._engine.begin() as connection:
                yield connection


# Global database pool instance
db_pool = DatabasePool()


async def get_db_connection() -> AsyncGenerator[AsyncConnection, None]:
    """Dependency for getting database connection."""
    async for connection in db_pool.get_connection():
        yield connection
