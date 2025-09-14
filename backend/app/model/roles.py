from sqlalchemy import Table, Column, Integer, String, func, DateTime, ForeignKey
from app.config.db import Base, engine, meta_data
# Definición Core de la tabla roles (para compatibilidad con imports antiguos)
roles = Table(
    "roles",
    meta_data,
    Column("id_role", Integer, primary_key=True, autoincrement=True),
    Column("name", String(255), unique=True, nullable=False),
    Column("create_date", DateTime, server_default=func.now(), nullable=True),
    Column("delete_date", DateTime, nullable=True),
)
from sqlalchemy.orm import relationship


# SQLAlchemy ORM (Mapeo Relacional de Objetos) definición de modelos
class Role(Base):
    __tablename__ = "roles"
    id_role = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), unique=True, nullable=False)
    create_date = Column(DateTime)
    delete_date = Column(DateTime)
    permissions = relationship("Permission", secondary="role_permission", back_populates="roles")

class Permission(Base):
    __tablename__ = "permissions"
    id_permissions = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), unique=True, nullable=False)
    create_date = Column(DateTime)
    delete_date = Column(DateTime)
    roles = relationship("Role", secondary="role_permission", back_populates="permissions")

# Tabla intermedia para la relación muchos a muchos usando Base.metadata
role_permission = Table(
    "role_permission",
    Base.metadata,
    Column("id_role", Integer, ForeignKey("roles.id_role")),
    Column("id_permissions", Integer, ForeignKey("permissions.id_permissions"))
)

# Crear todas las tablas ORM
Base.metadata.create_all(engine)


