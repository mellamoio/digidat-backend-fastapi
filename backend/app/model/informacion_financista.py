from sqlalchemy import Column, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

class InformacionFinancista(Base):
    __tablename__ = "informacionfinancista"
    
    id = Column(Integer, primary_key=True, index=True)
    id_obra = Column(Integer, ForeignKey('obras.id_obra'), nullable=False)
    detalle = Column(Text)
    id_responsable = Column(Integer, ForeignKey('responsables.id_responsable'))
    
    # Relaciones
    obra = relationship("Obra", back_populates="info_financista")
    responsable = relationship("Responsable", back_populates="info_financista")