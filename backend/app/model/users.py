import enum
from sqlalchemy import Column, Integer, String, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.config.db import Base

class StatusEnum(str, enum.Enum):
    ACTIVO = "ACTIVO"
    INACTIVO = "INACTIVO"

class User(Base):
    __tablename__ = "usuarios"
    id_responsable = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(255), nullable=False)
    cargo = Column(String(255), nullable=True)
    correo = Column(String(255), nullable=True, unique=True, index=True)
    contrasena_hash = Column(String(255), nullable=False)
    id_role = Column(Integer, ForeignKey("roles.id_role"), nullable=False)
    estado = Column(Enum(StatusEnum), nullable=False, default=StatusEnum.ACTIVO)
    
    rol = relationship("Role", back_populates="usuarios", lazy="select")

    """ documentos = relationship("Documento", back_populates="responsable") """

    obras = relationship("Obra", back_populates="responsable")


    informaciones_financistas = relationship("InformacionFinancista", back_populates="responsable")
    informaciones_contratista = relationship("InformacionContratista", back_populates="responsable")

    documentos = relationship("Documento", back_populates="responsable")

    def __repr__(self):
        return (
            f"<User(id_responsable={self.id_responsable}, "
            f"nombre='{self.nombre}', correo='{self.correo}', estado='{self.estado}')>"
        )