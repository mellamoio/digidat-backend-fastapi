from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.config.db import Base

class InformacionFinancista(Base):
    __tablename__ = "informacion_financista"
    
    id_informacion_financista = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_responsable = Column(Integer, ForeignKey("responsables.id_responsable"), nullable=False)
    id_obra = Column(Integer, ForeignKey("obras.id_obra"), nullable=False)
    entidad = Column(String(255), nullable=False)
    nit = Column(String(50), nullable=False)
    direccion = Column(String(255), nullable=False)
    telefono = Column(String(20), nullable=False)
    email = Column(String(100), nullable=False)
    representante_legal = Column(String(255), nullable=False)
    cargo_representante = Column(String(255), nullable=False)
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())
    fecha_actualizacion = Column(DateTime(timezone=True), onupdate=func.now())
    
    responsable_rel = relationship("Responsable", back_populates="info_financista")
    obra = relationship("Obra", back_populates="info_financista")

    def __repr__(self):
        return f"<InformacionFinancista(id={self.id_informacion_financista}, entidad='{self.entidad}')>"
