from sqlalchemy import Column, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.config.db import Base

class InformacionContratista(Base):
    __tablename__ = "informacion_contratista"
    
    id_informacion_contratista = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_obra = Column(Integer, ForeignKey("obras.id_obra"), nullable=False)
    detalle = Column(Text, nullable=True)
    id_responsable = Column(Integer, ForeignKey("responsables.id_responsable"), nullable=True)
    
    obra = relationship("Obra", back_populates="info_contratista")
    responsable_rel = relationship("Responsable", back_populates="info_contratista")

    def __repr__(self):
        return f"<InformacionContratista(id={self.id_informacion_contratista}, id_obra={self.id_obra})>"
