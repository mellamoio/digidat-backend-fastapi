import os
from typing import Generator, AsyncGenerator
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from app.core.config import settings

# =====================================
# MOTOR SÍNCRONO (para get_db)
# =====================================
# Convertir aiomysql a pymysql para conexión síncrona
sync_database_url = settings.DATABASE_URL.replace("mysql+aiomysql", "mysql+pymysql")

engine = create_engine(
    sync_database_url,
    pool_pre_ping=True,
    pool_recycle=3600,
    connect_args={
        "connect_timeout": 60,
    },
    echo=os.getenv("SQL_ECHO", "False").lower() == "true",
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# =====================================
# MOTOR ASÍNCRONO (para get_async_db)
# =====================================
async_engine = create_async_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600,
    connect_args={
        "connect_timeout": 60,
    },
    echo=os.getenv("SQL_ECHO", "False").lower() == "true",
)

async def close_engines():
    # Cierra engine async (aiomysql)
    await async_engine.dispose()

    # Cierra engine sync (pymysql)
    engine.dispose()

AsyncSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

Base = declarative_base()


def create_tables():
    """Crea todas las tablas en la base de datos."""
    try:
        Base.metadata.create_all(bind=engine)
        print("Tablas creadas correctamente")
    except Exception as e:
        print(f"Error al crear tablas: {e}")
        raise


async def async_create_tables():
    """Crea todas las tablas de forma asíncrona."""
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


def get_db() -> Generator:
    """Dependencia para obtener sesión síncrona de BD"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_async_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependencia para obtener sesión asíncrona de BD"""
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
    print("Tablas creadas exitosamente!")
