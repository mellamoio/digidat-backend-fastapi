from sqlalchemy import Column, Integer, ForeignKey, TIMESTAMP, func
from sqlalchemy.orm import relationship
from app.config.db import Base

class EtapaEjecucion(Base):
    __tablename__ = "etapas_ejecucion"
    
    id_etapa = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_obra = Column(Integer, ForeignKey("obras.id_obra"), nullable=False)
    id_estado = Column(Integer, ForeignKey("estados_etapa.id_estado"), nullable=False)
    fecha_registro = Column(TIMESTAMP, server_default=func.now())
    
    obra = relationship("Obra", back_populates="etapas")
    estado = relationship("EstadoEtapa", back_populates="etapas")

    def __repr__(self):
        return f"<EtapaEjecucion(id={self.id_etapa}, id_obra={self.id_obra}, id_estado={self.id_estado})>"
