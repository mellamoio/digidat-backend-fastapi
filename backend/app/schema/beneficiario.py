from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class BeneficiarioBase(BaseModel):
    nombre: str = Field(..., max_length=255)
    direccion: Optional[str] = Field(None, max_length=255)
    telefono: Optional[str] = Field(None, max_length=20)
    email: Optional[str] = Field(None, max_length=100)
    tipo: str = Field(..., max_length=50)

class BeneficiarioCreate(BeneficiarioBase):
    pass

class BeneficiarioUpdate(BeneficiarioBase):
    nombre: Optional[str] = Field(None, max_length=255)
    direccion: Optional[str] = Field(None, max_length=255)
    telefono: Optional[str] = Field(None, max_length=20)
    email: Optional[str] = Field(None, max_length=100)
    tipo: Optional[str] = Field(None, max_length=50)

class BeneficiarioInDBBase(BeneficiarioBase):
    id_beneficiario: int
    fecha_creacion: datetime
    fecha_actualizacion: datetime

    class Config:
        from_attributes = True

class Beneficiario(BeneficiarioInDBBase):
    pass