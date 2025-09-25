from sqlalchemy import Column, Integer, String, Text, Date, Numeric, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from .base import Base

class Obra(Base):
    __tablename__ = "obras"
    
    id_obra = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=False)
    descripcion = Column(Text)
    presupuesto = Column(Numeric(15, 2))
    fecha_inicio = Column(Date)
    fecha_fin = Column(Date)
    
    # Relaciones
    etapas = relationship("EtapaEjecucion", back_populates="obra")
    info_financista = relationship("InformacionFinancista", back_populates="obra")
    info_contratista = relationship("InformacionContratista", back_populates="obra")
    pagos = relationship("Pago", back_populates="obra")