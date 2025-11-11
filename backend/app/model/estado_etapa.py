from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from app.config.db import Base

class EstadoEtapa(Base):
    __tablename__ = "estados_etapa"
    
    id_estado = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre_estado = Column(String(100), nullable=False, unique=True)
    descripcion = Column(Text, nullable=True)

    # Relación con etapas de ejecución
    etapas = relationship("EtapaEjecucion", back_populates="estado")

    def __repr__(self):
        return f"<EstadoEtapa(id_estado={self.id_estado}, nombre_estado='{self.nombre_estado}')>"
