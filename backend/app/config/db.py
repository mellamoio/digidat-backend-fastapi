from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
import os
from dotenv import load_dotenv

load_dotenv()

meta_data = MetaData()

Base = declarative_base(metadata=meta_data)

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("No se encontró la variable de entorno DATABASE_URL en el archivo .env")

engine = create_engine(
    DATABASE_URL,
    echo=True,
    future=True,
    pool_pre_ping=True,
    pool_recycle=3600,
    pool_size=10,
    max_overflow=20,
)

ASYNC_DATABASE_URL = DATABASE_URL.replace("mysql+pymysql", "mysql+aiomysql")
async_engine = create_async_engine(
    ASYNC_DATABASE_URL,
    echo=True,
    pool_pre_ping=True,
    pool_recycle=3600,
    pool_size=10,
    max_overflow=20,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False
)

AsyncSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False
)

def get_db() -> scoped_session:
    """
    Obtiene una sesión de base de datos síncrona.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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

def create_tables():
    """Crea todas las tablas definidas en los modelos."""
    Base.metadata.create_all(bind=engine)

async def async_create_tables():
    """Crea todas las tablas de forma asíncrona."""
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

def drop_tables():
    """Elimina todas las tablas de la base de datos. ⚠️ Destruye todos los datos."""
    Base.metadata.drop_all(bind=engine)

async def async_drop_tables():
    """Elimina todas las tablas de forma asíncrona. ⚠️ Destruye todos los datos."""
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

if __name__ == "__main__":
    import asyncio
    
    print("Creando tablas en la base de datos...")
    create_tables()
    asyncio.run(async_create_tables())
    print("¡Tablas creadas exitosamente!")