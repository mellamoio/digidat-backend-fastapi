from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.config.db import Base

class EstadoReembolso(Base):
    __tablename__ = "estados_reembolso"
    
    id_estado_reembolso = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(100), unique=True, nullable=False)
    
    pagos = relationship("Pago", back_populates="estado_reembolso")

    def __repr__(self):
        return f"<EstadoReembolso(id={self.id_estado_reembolso}, nombre='{self.nombre}')>"
