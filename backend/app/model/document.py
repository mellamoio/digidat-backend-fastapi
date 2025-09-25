import enum
from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP, ForeignKey, func
from sqlalchemy.orm import relationship
from app.config.db import Base

class StateDocumentEnum(str, enum.Enum):
    ACTIVO = "activo"
    INACTIVO = "inactivo"

class Document(Base):
    __tablename__ = "document"
    
    id_document = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    path_document = Column(String(255), nullable=False)
    state_document = Column(Enum(StateDocumentEnum), default=StateDocumentEnum.ACTIVO, nullable=False)
    id_project = Column(Integer, ForeignKey("project.id_project"), nullable=False)
    create_date = Column(TIMESTAMP, server_default=func.now())
    delete_date = Column(TIMESTAMP, nullable=True)

    project = relationship("Project", back_populates="documents")

    def __repr__(self):
        return f"<Document(id={self.id_document}, name='{self.name}', state='{self.state_document}')>"
