from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.config.db import Base

class Beneficiario(Base):
    __tablename__ = "beneficiarios"
    
    id_beneficiario = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(255), nullable=False)
    direccion = Column(String(255), nullable=True)
    telefono = Column(String(20), nullable=True)
    email = Column(String(100), nullable=True)
    tipo = Column(String(50), nullable=False)
    documento = Column(String(50), nullable=True)
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())
    fecha_actualizacion = Column(DateTime(timezone=True), onupdate=func.now())
    
    pagos = relationship("Pago", back_populates="beneficiario")

    def __repr__(self):
        return f"<Beneficiario(id={self.id_beneficiario}, nombre='{self.nombre}', tipo='{self.tipo}')>"
