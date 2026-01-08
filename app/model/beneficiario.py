from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.config.db import Base


class Beneficiario(Base):
    __tablename__ = "beneficiarios"
    
    id_beneficiario = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(255), nullable=False)
    documento = Column(String(50), nullable=True)
    
    # Agregar esta relación si quieres mantenerla:
    pagos = relationship("Pago", back_populates="beneficiario")

    def __repr__(self):
        return f"<Beneficiario(id_beneficiario={self.id_beneficiario}, nombre='{self.nombre}')>"