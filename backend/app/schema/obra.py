from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime

class ObraBase(BaseModel):
    nombre: str = Field(..., max_length=255)
    costo_obra: Optional[float] = None
    fecha_inicio: Optional[date] = None
    fecha_fin: Optional[date] = None
    id_responsable: int
    id_beneficiario: int

class ObraCreate(ObraBase):
    pass

class ObraUpdate(BaseModel):
    nombre: Optional[str] = Field(None, max_length=255)
    costo_obra: Optional[float] = None
    fecha_inicio: Optional[date] = None
    fecha_fin: Optional[date] = None
    id_responsable: Optional[int] = None
    id_beneficiario: Optional[int] = None

class ObraInDBBase(ObraBase):
    id_obra: int
    delete_date: Optional[datetime] = None

    class Config:
        orm_mode = True

class Obra(ObraInDBBase):
    pass
