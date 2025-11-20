from sqlalchemy import Column, Integer, String
from app.config.db import Base


class EstadoEtapa(Base):
    __tablename__ = "estados_etapa"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(100), nullable=False, unique=True)
    orden = Column(Integer, nullable=False)
    color = Column(String(20), default="#722AE9")

    def __repr__(self):
        return f"<EstadoEtapa(id={self.id}, nombre='{self.nombre}')>"