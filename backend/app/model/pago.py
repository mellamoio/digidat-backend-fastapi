from sqlalchemy import Column, Integer, Numeric, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.config.db import Base


class Pago(Base):
    __tablename__ = "pagos"
    
    id_pago = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_obra = Column(Integer, ForeignKey("obras.id_obra"), nullable=False)
    monto_pagado = Column(Numeric(15, 2), nullable=False)
    fecha_pago = Column(Date, nullable=False)
    id_tipo_gasto = Column(Integer, ForeignKey("tipos_gasto.id"), nullable=False)
    id_estado_reembolso = Column(Integer, ForeignKey("estados_reembolso.id_estado_reembolso"), nullable=False)
    id_responsable = Column(Integer, ForeignKey("usuarios.id_responsable"))
    id_beneficiario = Column(Integer, ForeignKey("beneficiarios.id_beneficiario"))
    
    # Relaciones
    obra = relationship("Obra", back_populates="pagos")
    tipo_gasto = relationship("TipoGasto", back_populates="pagos")
    estado_reembolso = relationship("EstadoReembolso", back_populates="pagos")
    beneficiario = relationship("Beneficiario", back_populates="pagos")
    documentos = relationship(
        "Documento",
        back_populates="pago",
        cascade="all, delete-orphan",
        passive_deletes=True
    )

    def __repr__(self):
        return f"<Pago(id={self.id_pago}, monto={self.monto_pagado}, fecha={self.fecha_pago})>"
