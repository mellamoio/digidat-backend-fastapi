from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class EtapaEjecucionBase(BaseModel):
    id_obra: int
    id_estado: Optional[int] = Field(None, description="ID del estado actual de la obra")

class EtapaEjecucionCreate(EtapaEjecucionBase):
    pass

class EtapaEjecucionUpdate(BaseModel):
    id_estado: Optional[int] = None

class EtapaEjecucionInDBBase(EtapaEjecucionBase):
    id_etapa: int
    fecha_registro: Optional[datetime] = None

    class Config:
        from_attributes = True

class EtapaEjecucion(EtapaEjecucionInDBBase):
    pass
