from sqlalchemy import Column, Integer, String, Date, Numeric, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from app.config.db import Base
from app.model.informacion_financista import InformacionFinancista
from app.model.informacion_contratista import InformacionContratista

class Obra(Base):
    __tablename__ = "obras"
    
    id_obra = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(255), nullable=False)
    costo_obra = Column(Numeric(15, 2), nullable=True)
    fecha_inicio = Column(Date, nullable=True)
    fecha_fin = Column(Date, nullable=True)
    id_responsable = Column(Integer, ForeignKey("usuarios.id_responsable"), nullable=False)
    responsable = relationship("User", back_populates="obras")
    id_beneficiario = Column(Integer, ForeignKey("beneficiarios.id_beneficiario"), nullable=False)
    delete_date = Column(TIMESTAMP, nullable=True, default=None)
    
    # Relaciones
    etapa_ejecucion = relationship(
        "EtapaEjecucion",
        back_populates="obra",
        cascade="all, delete-orphan",
        passive_deletes=True
    )

    info_financista = relationship("InformacionFinancista", back_populates="obra")
    info_contratista = relationship("InformacionContratista", back_populates="obra")
    pagos = relationship("Pago", back_populates="obra")
    
    documentos = relationship("Documento", back_populates="obra", cascade="all, delete")
    beneficiario = relationship("Beneficiario", back_populates="obra")

    def __repr__(self):
        return f"<Obra(id={self.id_obra}, nombre='{self.nombre}', costo_obra={self.costo_obra})>"
