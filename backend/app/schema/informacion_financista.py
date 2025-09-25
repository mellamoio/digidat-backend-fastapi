from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime

class InformacionFinancistaBase(BaseModel):
    id_responsable: int
    entidad: str = Field(..., max_length=255)
    nit: str = Field(..., max_length=50)
    direccion: str = Field(..., max_length=255)
    telefono: str = Field(..., max_length=20)
    email: str = Field(..., max_length=100)
    representante_legal: str = Field(..., max_length=255)
    cargo_representante: str = Field(..., max_length=255)

class InformacionFinancistaCreate(InformacionFinancistaBase):
    pass

class InformacionFinancistaUpdate(BaseModel):
    id_responsable: Optional[int] = None
    entidad: Optional[str] = Field(None, max_length=255)
    nit: Optional[str] = Field(None, max_length=50)
    direccion: Optional[str] = Field(None, max_length=255)
    telefono: Optional[str] = Field(None, max_length=20)
    email: Optional[str] = Field(None, max_length=100)
    representante_legal: Optional[str] = Field(None, max_length=255)
    cargo_representante: Optional[str] = Field(None, max_length=255)

class InformacionFinancistaInDBBase(InformacionFinancistaBase):
    id_informacion_financista: int
    fecha_creacion: datetime
    fecha_actualizacion: datetime

    class Config:
        from_attributes = True

class InformacionFinancista(InformacionFinancistaInDBBase):
    pass
