from pydantic import BaseModel, Field
from typing import Optional

class EstadoEtapaBase(BaseModel):
    nombre_estado: str = Field(..., max_length=100)
    descripcion: Optional[str] = None

class EstadoEtapaCreate(EstadoEtapaBase):
    pass

class EstadoEtapaUpdate(BaseModel):
    nombre_estado: Optional[str] = Field(None, max_length=100)
    descripcion: Optional[str] = None

class EstadoEtapaInDBBase(EstadoEtapaBase):
    id_estado: int

    class Config:
        from_attributes = True

class EstadoEtapa(EstadoEtapaInDBBase):
    pass
