from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .base import Base

class Beneficiario(Base):
    __tablename__ = "beneficiarios"
    
    id_beneficiario = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=False)
    documento = Column(String(50))
    
    # Relación con Pagos
    pagos = relationship("Pago", back_populates="beneficiario")