from sqlalchemy import Column, Integer, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from .base import Base

class EtapaEjecucion(Base):
    __tablename__ = "etapas_ejecucion"
    
    id_etapa = Column(Integer, primary_key=True, index=True)
    id_obra = Column(Integer, ForeignKey('obras.id_obra'), nullable=False)
    id_estado = Column(Integer, ForeignKey('estados_etapa.id_estado'), nullable=False)
    fecha_registro = Column(TIMESTAMP, server_default='CURRENT_TIMESTAMP')
    
    # Relaciones
    obra = relationship("Obra", back_populates="etapas")
    estado = relationship("EstadoEtapa", back_populates="etapas")