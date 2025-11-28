from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP, func
from sqlalchemy.orm import relationship
from app.config.db import Base


class ActividadEtapa(Base):
    __tablename__ = "actividades_etapa"
    
    id_etapa = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_obra = Column(Integer, ForeignKey("obras.id_obra", ondelete="CASCADE"), nullable=False)
    nombre_etapa = Column(String(255), nullable=False)
    fecha_registro = Column(TIMESTAMP, server_default=func.current_timestamp())
    id_estado_etapa = Column(Integer, ForeignKey("estados_etapa.id", ondelete="CASCADE"), nullable=False)
    orden = Column(Integer, default=1)

    def __repr__(self):
        return f"<ActividadEtapa(id={self.id_etapa}, nombre='{self.nombre_etapa}', estado={self.id_estado_etapa})>"