from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy import MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

DATABASE_URL = settings.DATABASE_URL

meta_data = MetaData()
Base = declarative_base(metadata=meta_data)

if not DATABASE_URL:
    raise ValueError("No se encontró la variable de entorno DATABASE_URL en el archivo .env")

async_engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    pool_pre_ping=True,
    pool_recycle=3600,
    pool_size=10,
    max_overflow=20,
)

AsyncSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False
)

async def get_async_db() -> AsyncSession:
    """
    Obtiene una sesión de base de datos asíncrona.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise

async def async_create_tables():
    """Crea todas las tablas de forma asíncrona."""
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def async_drop_tables():
    """Elimina todas las tablas de forma asíncrona. ⚠️ Destruye todos los datos."""
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

if __name__ == "__main__":
    import asyncio
    
    print("Creando tablas en la base de datos...")
    asyncio.run(async_create_tables())
    print("¡Tablas creadas exitosamente!")