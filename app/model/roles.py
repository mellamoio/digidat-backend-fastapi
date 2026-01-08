from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Table, func
from sqlalchemy.orm import relationship
from app.config.db import Base

# Tabla intermedia role_permission
role_permission = Table(
    "role_permission",
    Base.metadata,
    Column("id_role", Integer, ForeignKey("roles.id_role"), primary_key=True),
    Column("id_permissions", Integer, ForeignKey("permissions.id_permissions"), primary_key=True),
)

class Role(Base):
    __tablename__ = "roles"
    id_role = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(String(255), nullable=True)
    create_date = Column(DateTime, server_default=func.now(), nullable=True)
    update_date = Column(DateTime, onupdate=func.now(), nullable=True)
    delete_date = Column(DateTime, nullable=True)
    permissions = relationship("Permission", secondary=role_permission, back_populates="roles", lazy="select")
    usuarios = relationship("User", back_populates="rol")

    def __repr__(self):
        return f"<Role(id_role={self.id_role}, name='{self.name}')>"

class Permission(Base):
    __tablename__ = "permissions"
    id_permissions = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), unique=True, nullable=False, index=True)
    description = Column(String(500), nullable=True)
    code = Column(String(100), unique=True, nullable=False)
    create_date = Column(DateTime, server_default=func.now(), nullable=True)
    update_date = Column(DateTime, onupdate=func.now(), nullable=True)
    roles = relationship("Role", secondary=role_permission, back_populates="permissions", lazy="select")

    def __repr__(self):
        return f"<Permission(id_permissions={self.id_permissions}, name='{self.name}')>"