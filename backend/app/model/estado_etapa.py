from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.config.db import Base


class EstadoEtapa(Base):
    __tablename__ = "estados_etapa"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(100), nullable=False, unique=True)
    orden = Column(Integer, nullable=False)
    color = Column(String(20), default="#722AE9")
    
    # Relationship con cascade delete - SIN back_populates
    actividades = relationship(
        "ActividadEtapa",
        foreign_keys="ActividadEtapa.id_estado_etapa",
        cascade="all, delete-orphan",
        passive_deletes=True
    )

    def __repr__(self):
        return f"<EstadoEtapa(id={self.id}, nombre='{self.nombre}')>"