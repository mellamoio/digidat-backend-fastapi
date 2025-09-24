# app/model/roles.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Table, func
from sqlalchemy.orm import relationship
from app.config.db import Base

role_permission = Table(
    "role_permission",
    Base.metadata,
    Column("id_role", Integer, ForeignKey("roles.id_role"), primary_key=True),
    Column("id_permissions", Integer, ForeignKey("permissions.id_permissions"), primary_key=True)
)

class Role(Base):
    __tablename__ = "roles"

    id_role = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), unique=True, nullable=False)
    create_date = Column(DateTime, server_default=func.now())
    delete_date = Column(DateTime, nullable=True)

    permissions = relationship(
        "Permission",
        secondary=role_permission,
        back_populates="roles"
    )

class Permission(Base):
    __tablename__ = "permissions"

    id_permissions = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), unique=True, nullable=False)
    create_date = Column(DateTime, server_default=func.now())
    delete_date = Column(DateTime, nullable=True)

    roles = relationship(
        "Role",
        secondary=role_permission,
        back_populates="permissions"
    )
