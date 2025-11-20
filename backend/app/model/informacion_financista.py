from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.config.db import Base


class InformacionFinancista(Base):
    __tablename__ = "informacionfinancista"  # ← Corregido: sin guion bajo
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_responsable = Column(Integer, ForeignKey("usuarios.id_responsable"), nullable=False)
    id_obra = Column(Integer, ForeignKey("obras.id_obra"), nullable=False)
    
    responsable = relationship("User", back_populates="informaciones_financistas")
    obra = relationship("Obra", back_populates="info_financista")
    documentos = relationship(
        "Documento",
        back_populates="informacion_financista",
        cascade="all, delete-orphan",
        passive_deletes=True
    )

    def __repr__(self):
        return f"<InformacionFinancista(id={self.id})>"