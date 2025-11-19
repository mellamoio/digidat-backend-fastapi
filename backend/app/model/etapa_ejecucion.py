# app/model/etapa_ejecucion.py
from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from app.config.db import Base

class EtapaEjecucion(Base):
    __tablename__ = "etapas_ejecucion"
    
    id_etapa = Column(Integer, primary_key=True, index=True, autoincrement=True)
<<<<<<< HEAD
    id_obra = Column(Integer, ForeignKey('obras.id_obra'), nullable=False)
    nombre_etapa = Column(String(100), nullable=False)
    fecha_registro = Column(TIMESTAMP, nullable=True)
    
    # Relaciones
    obra = relationship("Obra", back_populates="etapas")
    
    def __repr__(self):
        return f"<EtapaEjecucion(id={self.id_etapa}, nombre='{self.nombre_etapa}')>"
=======
    id_obra = Column(Integer, ForeignKey("obras.id_obra", ondelete="CASCADE"), nullable=False)
    id_estado = Column(Integer, ForeignKey("estados_etapa.id_estado"), nullable=True)
    fecha_registro = Column(TIMESTAMP, server_default=func.now())

    # Relaciones
    obra = relationship("Obra", back_populates="etapa_ejecucion")
    estado = relationship("EstadoEtapa", back_populates="etapas")
    documentos = relationship("Documento", back_populates="etapa", cascade="all, delete-orphan", passive_deletes=True)

    def __repr__(self):
        return f"<EtapaEjecucion(id_etapa={self.id_etapa}, id_obra={self.id_obra}, id_estado={self.id_estado})>"
>>>>>>> fd98077156a3a68778da09b098a82ff54cd639f5
