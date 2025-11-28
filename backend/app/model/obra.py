from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.config.db import Base


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
    tipo_id = Column(Integer, nullable=False)
    estado_id = Column(Integer, default=1)
    fecha_inicio = Column(Date, nullable=True)
    fecha_fin = Column(Date, nullable=True)
    costo_proyecto = Column(Float, default=0.0)
    id_responsable = Column(Integer, ForeignKey('usuarios.id_responsable'), nullable=True)
    id_empresa = Column(Integer, nullable=False, default=1)

    # Relaciones
    actividades_etapa = relationship(
        "ActividadEtapa", 
        foreign_keys="ActividadEtapa.id_obra",
        cascade="all, delete-orphan", 
        passive_deletes=True
    )
    info_financista = relationship(
        "InformacionFinancista", 
        back_populates="obra", 
        passive_deletes=True
    )
    info_contratista = relationship(
        "InformacionContratista", 
        back_populates="obra", 
        passive_deletes=True
    )
    pagos = relationship(
        "Pago", 
        back_populates="obra", 
        passive_deletes=True
    )
    documentos = relationship(
        "Documento", 
        back_populates="obra", 
        passive_deletes=True
    )
    responsable = relationship(
        "User", 
        back_populates="obras", 
        foreign_keys=[id_responsable]
    )
    centros_operacion = relationship(
        "CentroOperacion",
        secondary=obra_centro_operacion,
        back_populates="obras"
    )

    def __repr__(self):
        return f"<Obra(id={self.id_obra}, nombre='{self.nombre}', costo_proyecto={self.costo_proyecto})>"