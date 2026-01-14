from sqlalchemy import Column, Integer, String, Boolean, Text, TIMESTAMP
from sqlalchemy.sql import func
from app.config.db import Base


class CategoriaDocumento(Base):
    """
    Modelo para categorías de documentos
    """
    __tablename__ = "categoria_documento"
    
    id_categoria = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(Text, nullable=True)
    estado = Column(Boolean, default=True, nullable=False)
    fecha_creacion = Column(TIMESTAMP, server_default=func.now())

    def __repr__(self):
        return f"<CategoriaDocumento(id={self.id_categoria}, nombre={self.nombre})>"
