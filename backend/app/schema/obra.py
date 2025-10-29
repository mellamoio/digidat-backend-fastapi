# app/schemas/obra.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

class ObraBase(BaseModel):
    nombre: str = Field(..., max_length=255)
    descripcion: Optional[str] = None
    presupuesto: Optional[float] = None
    fecha_inicio: Optional[date] = None
    fecha_fin: Optional[date] = None

class ObraCreate(ObraBase):
    pass

class ObraUpdate(ObraBase):
    nombre: Optional[str] = Field(None, max_length=255)

class ObraInDBBase(ObraBase):
    id_obra: int

    class Config:
        from_attributes = True

class Obra(ObraInDBBase):
    pass