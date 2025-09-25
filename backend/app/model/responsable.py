from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.config.db import Base

class Responsable(Base):
    __tablename__ = "responsables"
    
    id_responsable = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)
    cargo = Column(String(100), nullable=True)
    telefono = Column(String(20), nullable=True)
    email = Column(String(100), nullable=True)
    
    info_financista = relationship("InformacionFinancista", back_populates="responsable_rel")
    info_contratista = relationship("InformacionContratista", back_populates="responsable_rel")
    pagos = relationship("Pago", back_populates="responsable")

    def __repr__(self):
        return f"<Responsable(id={self.id_responsable}, nombre='{self.nombre}')>"
