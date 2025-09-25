from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .base import Base

class EstadoEtapa(Base):
    __tablename__ = "estados_etapa"
    
    id_estado = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), unique=True, nullable=False)
    
    # Relación con EtapaEjecucion
    etapas = relationship("EtapaEjecucion", back_populates="estado")