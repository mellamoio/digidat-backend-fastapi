from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP
from .base import Base

class Auditoria(Base):
    __tablename__ = "auditoria"
    
    id_auditoria = Column(Integer, primary_key=True, index=True)
    tabla_afectada = Column(String(100), nullable=False)
    id_registro = Column(Integer, nullable=False)
    accion = Column(Enum('INSERT', 'UPDATE', 'DELETE', name='accion_auditoria'), nullable=False)
    usuario = Column(String(100), nullable=False)
    fecha = Column(TIMESTAMP, server_default='CURRENT_TIMESTAMP')