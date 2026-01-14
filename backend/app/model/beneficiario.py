from sqlalchemy import Column, Integer, String
from app.core.database import Base

class Beneficiario(Base):
    __tablename__ = "beneficiarios"
    
    id_beneficiario = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(255), nullable=False)
    documento = Column(String(50), nullable=True)
    def __repr__(self):
        return f"<Beneficiario(id_beneficiario={self.id_beneficiario}, nombre='{self.nombre}')>"
