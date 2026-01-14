from sqlalchemy import Column, Integer, String, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.config.db import Base

class InformacionFinancista(Base):
    """
    Modelo para almacenar información financiera asociada a una obra
    """
    __tablename__ = "informacionfinancista"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_tipo_financista = Column(Integer, nullable=False, default=1)
    id_obra = Column(
        Integer, 
        ForeignKey("obras.id_obra", ondelete="CASCADE"), 
        nullable=False,
        index=True
    )
    aspecto = Column(Text, nullable=False)
    comentarios = Column(Text, nullable=True)
    id_categoria_documento = Column(JSON, nullable=True)
    responsables = Column(JSON, nullable=True)
    
    # Relaciones
    obra = relationship(
        "Obra", 
        back_populates="info_financista",
        lazy="joined"
    )
    documentos = relationship(
        "Documento",
        back_populates="informacion_financista",
        cascade="all, delete-orphan",
        passive_deletes=True,
        lazy="select"
    )

    def __repr__(self):
        return f"<InformacionFinancista(id={self.id}, tipo={self.id_tipo_financista})>"