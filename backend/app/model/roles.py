from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Table, func
from sqlalchemy.orm import relationship
from app.config.db import Base

# Tabla de asociación muchos a muchos entre roles y permisos
role_permission = Table(
    "role_permission",
    Base.metadata,
    Column("id_role", Integer, ForeignKey("roles.id_role"), primary_key=True),
    Column("id_permissions", Integer, ForeignKey("permissions.id_permissions"), primary_key=True),
    Column("create_date", DateTime, server_default=func.now())
)

class Role(Base):
    """
    Modelo de datos para los roles de usuario en el sistema.
    """
    __tablename__ = "roles"

    id_role = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), unique=True, nullable=False, index=True)
    description = Column(String(500), nullable=True)
    create_date = Column(DateTime, server_default=func.now())
    update_date = Column(DateTime, onupdate=func.now())
    delete_date = Column(DateTime, nullable=True)

    # Relación muchos a muchos con Permission
    permissions = relationship(
        "Permission",
        secondary=role_permission,
        back_populates="roles",
        lazy="dynamic"
    )

    # Relación uno a muchos con usuarios (si es necesario)
    # users = relationship("User", back_populates="role")

    def __repr__(self):
        return f"<Role(id={self.id_role}, name='{self.name}')>"

class Permission(Base):
    """
    Modelo de datos para los permisos del sistema.
    """
    __tablename__ = "permissions"

    id_permissions = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), unique=True, nullable=False, index=True)
    description = Column(String(500), nullable=True)
    code = Column(String(100), unique=True, nullable=False)
    create_date = Column(DateTime, server_default=func.now())
    update_date = Column(DateTime, onupdate=func.now())

    # Relación muchos a muchos con Role
    roles = relationship(
        "Role",
        secondary=role_permission,
        back_populates="permissions",
        lazy="dynamic"
    )

    def __repr__(self):
        return f"<Permission(id={self.id_permissions}, name='{self.name}')>"

# Datos iniciales
DEFAULT_ROLES = [
    {"name": "admin", "description": "Administrador del sistema"},
    {"name": "user", "description": "Usuario estándar"},
    {"name": "guest", "description": "Invitado"}
]

DEFAULT_PERMISSIONS = [
    {"name": "user_create", "code": "user:create", "description": "Crear usuarios"},
    {"name": "user_read", "code": "user:read", "description": "Ver usuarios"},
    {"name": "user_update", "code": "user:update", "description": "Actualizar usuarios"},
    {"name": "user_delete", "code": "user:delete", "description": "Eliminar usuarios"}
]

def init_roles_and_permissions(db):
    """Inicializa roles y permisos por defecto en la base de datos"""
    # Crear permisos por defecto
    for perm_data in DEFAULT_PERMISSIONS:
        perm = db.query(Permission).filter(Permission.code == perm_data["code"]).first()
        if not perm:
            db.add(Permission(**perm_data))
    
    db.commit()
    
    # Crear roles por defecto
    admin_permissions = db.query(Permission).all()
    
    for role_data in DEFAULT_ROLES:
        role = db.query(Role).filter(Role.name == role_data["name"]).first()
        if not role:
            role = Role(**role_data)
            if role.name == "admin":
                role.permissions = admin_permissions
            db.add(role)
    
    db.commit()