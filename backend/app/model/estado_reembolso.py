from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .base import Base

class EstadoReembolso(Base):
    __tablename__ = "estados_reembolso"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), unique=True, nullable=False)
    
    # Relación con Pagos
    pagos = relationship("Pago", back_populates="estado_reembolso")