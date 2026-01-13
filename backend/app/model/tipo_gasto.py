from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.config.db import Base


class TipoGasto(Base):
    __tablename__ = "tipos_gasto"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(100), unique=True, nullable=False)
    
    # Relación con pagos
    pagos = relationship("Pago", back_populates="tipo_gasto")

    def __repr__(self):
        return f"<TipoGasto(id={self.id}, nombre='{self.nombre}')>"
