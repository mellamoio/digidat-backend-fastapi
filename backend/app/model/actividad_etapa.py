from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.db import Base

class ActividadEtapa(Base):
    __tablename__ = "actividades_etapa"

    id_actividad = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_obra = Column(Integer, ForeignKey("obras.id_obra", ondelete="CASCADE"), nullable=False)
    id_estado_etapa = Column(Integer, ForeignKey("estados_etapa.id"), nullable=False)
    nombre_actividad = Column(String(100), nullable=False)
    fecha_registro = Column(TIMESTAMP, server_default=func.now())

    obra = relationship("Obra", back_populates="actividades")
    documentos = relationship("Documento", back_populates="actividad", foreign_keys="Documento.id_actividad")

    def __repr__(self):
        return f"<ActividadEtapa(id_actividad={self.id_actividad}, nombre_actividad='{self.nombre_actividad}')>"