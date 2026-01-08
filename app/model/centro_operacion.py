from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.config.db import Base

class CentroOperacion(Base):
    __tablename__ = "centros_operacion"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(255), nullable=False)
    
    # Relación con obras
    obras = relationship(
        "Obra",
        secondary="obra_centro_operacion",
        back_populates="centros_operacion"
    )

    def __repr__(self):
        return f"<CentroOperacion(id={self.id}, nombre='{self.nombre}')>"
