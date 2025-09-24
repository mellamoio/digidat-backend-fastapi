import os
from typing import Generator, AsyncGenerator
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from app.core.config import settings

# Configuración de la base de datos síncrona
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    echo=os.getenv("SQL_ECHO", "False").lower() == "true",
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Configuración de la base de datos asíncrona
async_engine = create_async_engine(
    settings.DATABASE_URL.replace("mysql+pymysql", "mysql+aiomysql"),
    pool_pre_ping=True,
    echo=os.getenv("SQL_ECHO", "False").lower() == "true",
)

AsyncSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# Base para los modelos
Base = declarative_base()

def create_tables():
    """Crea todas las tablas en la base de datos."""
    Base.metadata.create_all(bind=engine)

async def async_create_tables():
    """Crea todas las tablas de forma asíncrona."""
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Dependencia para inyección de dependencias síncrona
def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Dependencia para inyección de dependencias asíncrona
async def get_async_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

if __name__ == "__main__":
    import asyncio
    create_tables()
    asyncio.run(async_create_tables())
    print("¡Tablas creadas exitosamente!")