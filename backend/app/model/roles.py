from sqlalchemy import Table, Column, Integer, String, func, DateTime
from config.db import meta_data, engine

roles = Table(
    "roles",
    meta_data,
    Column("id_role", Integer, primary_key=True, autoincrement=True),
    Column("name", String(255), unique=True, nullable=False),
    Column("create_date", DateTime, server_default=func.now(), nullable=True),
    Column("delete_date", DateTime, nullable=True),
)

meta_data.create_all(engine)