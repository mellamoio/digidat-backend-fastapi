from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP, ForeignKey
from app.config.db import Base

class Document(Base):
    __tablename__ = "document"
    id_document = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    path_document = Column(String(255), nullable=False)
    state_document = Column(Enum('activo', 'inactivo'), default='activo')
    id_project = Column(Integer, ForeignKey("project.id_project"))
    create_date = Column(TIMESTAMP)
    delete_date = Column(TIMESTAMP, nullable=True)