<<<<<<< HEAD
from sqlalchemy import Column, Integer, String
=======
from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
>>>>>>> fd98077156a3a68778da09b098a82ff54cd639f5
from app.config.db import Base

class EstadoEtapa(Base):
    __tablename__ = "estados_etapa"
    
<<<<<<< HEAD
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(100), nullable=False, unique=True)
    orden = Column(Integer, nullable=False, index=True)
    color = Column(String(20), default='#722AE9')

    def __repr__(self):
        return f"<EstadoEtapa(id={self.id}, nombre='{self.nombre}', orden={self.orden})>"
=======
    id_estado = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre_estado = Column(String(100), nullable=False, unique=True)
    descripcion = Column(Text, nullable=True)

    # Relación con etapas de ejecución
    etapas = relationship("EtapaEjecucion", back_populates="estado")

    def __repr__(self):
        return f"<EstadoEtapa(id_estado={self.id_estado}, nombre_estado='{self.nombre_estado}')>"
>>>>>>> fd98077156a3a68778da09b098a82ff54cd639f5
