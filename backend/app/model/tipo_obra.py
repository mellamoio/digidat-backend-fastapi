from sqlalchemy import Column, Integer, String
from app.core.database import Base

class TipoObra(Base):
    __tablename__ = "tipos_obra"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), unique=True, nullable=False)
    descripcion = Column(String(255), nullable=True)
