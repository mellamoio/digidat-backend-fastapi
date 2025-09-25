from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .base import Base

class Responsable(Base):
    __tablename__ = "responsables"
    
    id_responsable = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=False)
    cargo = Column(String(255))
    
    # Relaciones
    info_financista = relationship("InformacionFinancista", back_populates="responsable")
    info_contratista = relationship("InformacionContratista", back_populates="responsable")
    pagos = relationship("Pago", back_populates="responsable")