# app/schemas/etapa_ejecucion.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

class EtapaEjecucionBase(BaseModel):
    id_obra: int
    id_estado_etapa: int
    fecha_inicio: date
    fecha_fin: Optional[date] = None
    descripcion: Optional[str] = None
    avance: float = Field(0.0, ge=0.0, le=100.0)

class EtapaEjecucionCreate(EtapaEjecucionBase):
    pass

class EtapaEjecucionUpdate(BaseModel):
    id_estado_etapa: Optional[int] = None
    fecha_inicio: Optional[date] = None
    fecha_fin: Optional[date] = None
    descripcion: Optional[str] = None
    avance: Optional[float] = Field(None, ge=0.0, le=100.0)

class EtapaEjecucionInDBBase(EtapaEjecucionBase):
    id_etapa_ejecucion: int

    class Config:
        from_attributes = True

class EtapaEjecucion(EtapaEjecucionInDBBase):
    pass
