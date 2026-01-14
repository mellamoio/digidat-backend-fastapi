from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.model.roles import role_permission

class Permission(Base):
    __tablename__ = "permissions"

    id_permissions = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), unique=True, nullable=False, index=True)
    description = Column(String(500), nullable=True)
    code = Column(String(100), unique=True, nullable=False)
    create_date = Column(DateTime, server_default=func.now())
    update_date = Column(DateTime, onupdate=func.now())
    delete_date = Column(DateTime, nullable=True)

    roles = relationship(
        "Role",
        secondary=role_permission,
        back_populates="permissions",
        lazy="joined"
    )

    def __repr__(self):
        return f"<Permission(id={self.id_permissions}, name='{self.name}', code='{self.code}')>"
