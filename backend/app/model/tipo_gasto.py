from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .base import Base

class TipoGasto(Base):
    __tablename__ = "tipos_gasto"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), unique=True, nullable=False)
    
    # Relación con Pagos
    pagos = relationship("Pago", back_populates="tipo_gasto")