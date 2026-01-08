from sqlalchemy import Column, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.config.db import Base


class InformacionContratista(Base):
    __tablename__ = "informacioncontratista"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_obra = Column(Integer, ForeignKey("obras.id_obra"), nullable=False)
    detalle = Column(Text, nullable=True)
    id_responsable = Column(Integer, ForeignKey("usuarios.id_responsable"), nullable=True)
    
    obra = relationship("Obra", back_populates="info_contratista")
    responsable = relationship("User", back_populates="informaciones_contratista")
    documentos = relationship(
        "Documento",
        back_populates="informacion_contratista",
        cascade="all, delete-orphan",
        passive_deletes=True
    )

    def __repr__(self):
        return f"<InformacionContratista(id={self.id}, id_obra={self.id_obra})>"