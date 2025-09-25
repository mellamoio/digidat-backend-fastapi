from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.config.db import Base

class EstadoEtapa(Base):
    __tablename__ = "estados_etapa"
    
    id_estado = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(100), unique=True, nullable=False)
    
    etapas = relationship("EtapaEjecucion", back_populates="estado")

    def __repr__(self):
        return f"<EstadoEtapa(id={self.id_estado}, nombre='{self.nombre}')>"
