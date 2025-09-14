import enum
from sqlalchemy import Table, Column, DateTime,ForeignKey, func
from sqlalchemy.sql.sqltypes import Integer, String
from sqlalchemy import Enum as SqlEnum
from app.config.db import engine, meta_data

class MyEnum(str, enum.Enum):
    ACTIVO = 'activo'
    INACTIVO = 'inactivo'

users = Table("users", meta_data,
    Column("id_user", Integer, primary_key=True),
    Column("name", String(255), nullable=False),
    Column("email", String(500), nullable=False),
    Column("password_hash", String(500), nullable=False),
    Column("status", SqlEnum(MyEnum, values_callable=lambda enum: [e.value for e in enum]),nullable=False),
    Column("url_photo", String(1000), nullable=True),
    Column("create_date", DateTime, server_default=func.now(), nullable=True),
    Column("delete_date", DateTime, nullable=True),
    Column("id_role", Integer, ForeignKey("roles.id_role"), nullable=False),  # FK a rol
)

meta_data.create_all(engine)