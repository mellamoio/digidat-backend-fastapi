from app.config.db import Base
from sqlalchemy import Column, Integer, String, Text, ForeignKey, TIMESTAMP, func
from sqlalchemy.orm import relationship


class Documento(Base):
    __tablename__ = "documentos"

    id_documento = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=False)
    ruta = Column(String(1000), nullable=False)
    mime_type = Column(String(255))
    tamano_bytes = Column(Integer)
    uploaded_by = Column(Integer, ForeignKey("usuarios.id_responsable", ondelete="SET NULL"))
    id_obra = Column(Integer, ForeignKey("obras.id_obra", ondelete="SET NULL"))
    id_etapa = Column(Integer, ForeignKey("actividades_etapa.id_etapa", ondelete="SET NULL"))
    id_informacionfinancista = Column(Integer, ForeignKey("informacionfinancista.id", ondelete="SET NULL"))
    id_informacioncontratista = Column(Integer, ForeignKey("informacioncontratista.id", ondelete="SET NULL"))
    id_pago = Column(Integer, ForeignKey("pagos.id_pago", ondelete="SET NULL"))
    create_date = Column(TIMESTAMP, server_default=func.now())
    delete_date = Column(TIMESTAMP, nullable=True)

    # Relaciones - SIN back_populates para ActividadEtapa para evitar ciclos
    obra = relationship("Obra", back_populates="documentos", foreign_keys=[id_obra])
    informacion_financista = relationship("InformacionFinancista", back_populates="documentos", foreign_keys=[id_informacionfinancista])
    informacion_contratista = relationship("InformacionContratista", back_populates="documentos", foreign_keys=[id_informacioncontratista])
    pago = relationship("Pago", back_populates="documentos", foreign_keys=[id_pago])
    responsable = relationship("User", back_populates="documentos", foreign_keys=[uploaded_by])
