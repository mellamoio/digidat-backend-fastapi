from sqlalchemy import Column, Integer, String, Text, Date, Numeric
from sqlalchemy.orm import relationship
from app.config.db import Base

class Obra(Base):
    __tablename__ = "obras"
    
    id_obra = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(255), nullable=False)
    descripcion = Column(Text, nullable=True)
    presupuesto = Column(Numeric(15, 2), nullable=True)
    fecha_inicio = Column(Date, nullable=True)
    fecha_fin = Column(Date, nullable=True)
    
    etapas = relationship("EtapaEjecucion", back_populates="obra")
    info_financista = relationship("InformacionFinancista", back_populates="obra")
    info_contratista = relationship("InformacionContratista", back_populates="obra")
    pagos = relationship("Pago", back_populates="obra")

    def __repr__(self):
        return f"<Obra(id={self.id_obra}, nombre='{self.nombre}', presupuesto={self.presupuesto})>"
