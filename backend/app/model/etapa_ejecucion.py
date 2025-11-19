# app/model/etapa_ejecucion.py
from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from app.config.db import Base

class EtapaEjecucion(Base):
    __tablename__ = "etapas_ejecucion"
    
    id_etapa = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_obra = Column(Integer, ForeignKey('obras.id_obra'), nullable=False)
    nombre_etapa = Column(String(100), nullable=False)
    fecha_registro = Column(TIMESTAMP, nullable=True)
    
    # Relaciones
    obra = relationship("Obra", back_populates="etapas")
    
    def __repr__(self):
        return f"<EtapaEjecucion(id={self.id_etapa}, nombre='{self.nombre_etapa}')>"