import enum
from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP, func
from app.config.db import Base

class AccionAuditoriaEnum(str, enum.Enum):
    INSERT = "INSERT"
    UPDATE = "UPDATE"
    DELETE = "DELETE"

class Auditoria(Base):
    __tablename__ = "auditoria"
    
    id_auditoria = Column(Integer, primary_key=True, index=True, autoincrement=True)
    tabla_afectada = Column(String(100), nullable=False)
    id_registro = Column(Integer, nullable=False)
    accion = Column(Enum(AccionAuditoriaEnum, name="accion_auditoria"), nullable=False)
    usuario = Column(String(100), nullable=False)
    fecha = Column(TIMESTAMP, server_default=func.now())

    def __repr__(self):
        return (f"<Auditoria(id={self.id_auditoria}, tabla='{self.tabla_afectada}', "
                f"accion='{self.accion}', usuario='{self.usuario}', fecha='{self.fecha}')>")
