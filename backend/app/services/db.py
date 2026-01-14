# app/services/db.py
"""
Archivo de compatibilidad para imports antiguos.
Redirige a app.core.database
"""
from app.core.database import (
    Base,
    engine,
    async_engine,
    SessionLocal,
    AsyncSessionLocal,
    get_db,
    get_async_db,
    create_tables,
    async_create_tables
)

__all__ = [
    'Base',
    'engine',
    'async_engine',
    'SessionLocal',
    'AsyncSessionLocal',
    'get_db',
    'get_async_db',
    'create_tables',
    'async_create_tables'
]