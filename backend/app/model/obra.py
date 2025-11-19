<<<<<<< HEAD
from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey, Table
=======
from sqlalchemy import Column, Integer, String, Date, Numeric, ForeignKey, TIMESTAMP
>>>>>>> fd98077156a3a68778da09b098a82ff54cd639f5
from sqlalchemy.orm import relationship
from app.config.db import Base
from app.model.informacion_financista import InformacionFinancista
from app.model.informacion_contratista import InformacionContratista

# Tabla intermedia
obra_centro_operacion = Table(
    'obra_centro_operacion',
    Base.metadata,
    Column('id_obra', Integer, ForeignKey('obras.id_obra'), primary_key=True),
    Column('id_centro_operacion', Integer, ForeignKey('centros_operacion.id'), primary_key=True)
)

class Obra(Base):
    __tablename__ = "obras"
    
    id_obra = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(255), nullable=False)
<<<<<<< HEAD
    tipo_id = Column(Integer, nullable=False)
    estado_id = Column(Integer, default=1)
    fecha_inicio = Column(Date, nullable=True)
    fecha_fin = Column(Date, nullable=True)
    costo_proyecto = Column(Float, default=0.0)
    id_responsable = Column(Integer, ForeignKey('usuarios.id_responsable'), nullable=True)
    id_empresa = Column(Integer, nullable=False, default=1)
    
    # Relaciones existentes
    etapas = relationship("EtapaEjecucion", back_populates="obra")
=======
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

>>>>>>> fd98077156a3a68778da09b098a82ff54cd639f5
    info_financista = relationship("InformacionFinancista", back_populates="obra")
    info_contratista = relationship("InformacionContratista", back_populates="obra")
    pagos = relationship("Pago", back_populates="obra")
    
<<<<<<< HEAD
    # Nuevas relaciones
    responsable = relationship("User", back_populates="obras", foreign_keys=[id_responsable])
    centros_operacion = relationship(
        "CentroOperacion",
        secondary=obra_centro_operacion,
        back_populates="obras"
    )

    def __repr__(self):
        return f"<Obra(id={self.id_obra}, nombre='{self.nombre}', costo_proyecto={self.costo_proyecto})>"
=======
    documentos = relationship("Documento", back_populates="obra", cascade="all, delete")
    beneficiario = relationship("Beneficiario", back_populates="obra")

    def __repr__(self):
        return f"<Obra(id={self.id_obra}, nombre='{self.nombre}', costo_obra={self.costo_obra})>"
>>>>>>> fd98077156a3a68778da09b098a82ff54cd639f5
