from sqlalchemy import Column, Integer, String, DateTime
from app.config.db import Base
from sqlalchemy.orm import relationship
from app.model.roles import role_permission

class Permission(Base):
    __tablename__ = "permissions"
    id_permissions = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), unique=True, nullable=False)
    create_date = Column(DateTime)
    delete_date = Column(DateTime)
    roles = relationship("Role", secondary=role_permission, back_populates="permissions")