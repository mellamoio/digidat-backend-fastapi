from sqlalchemy import Column, Integer, ForeignKey, TIMESTAMP, func
from sqlalchemy.orm import relationship
from app.config.db import Base

class EtapaEjecucion(Base):
    __tablename__ = "etapas_ejecucion"
    
    id_etapa = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_obra = Column(Integer, ForeignKey("obras.id_obra", ondelete="CASCADE"), nullable=False)
    id_estado = Column(Integer, ForeignKey("estados_etapa.id_estado"), nullable=True)
    fecha_registro = Column(TIMESTAMP, server_default=func.now())

    # Relaciones
    obra = relationship("Obra", back_populates="etapa_ejecucion")
    estado = relationship("EstadoEtapa", back_populates="etapas")
    documentos = relationship("Documento", back_populates="etapa", cascade="all, delete-orphan", passive_deletes=True)

    def __repr__(self):
        return f"<EtapaEjecucion(id_etapa={self.id_etapa}, id_obra={self.id_obra}, id_estado={self.id_estado})>"
