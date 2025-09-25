# app/schemas/estado_etapa.py
from pydantic import BaseModel, Field
from typing import Optional

class EstadoEtapaBase(BaseModel):
    nombre: str = Field(..., max_length=100)
    descripcion: Optional[str] = None

class EstadoEtapaCreate(EstadoEtapaBase):
    pass

class EstadoEtapaUpdate(EstadoEtapaBase):
    nombre: Optional[str] = Field(None, max_length=100)

class EstadoEtapaInDBBase(EstadoEtapaBase):
    id_estado_etapa: int

    class Config:
        from_attributes = True

class EstadoEtapa(EstadoEtapaInDBBase):
    pass
