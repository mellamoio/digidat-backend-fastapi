from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ActividadEtapaBase(BaseModel):
    nombre_etapa: str
    id_obra: int
    id_estado_etapa: int
    orden: Optional[int] = 1


class ActividadEtapaCreate(ActividadEtapaBase):
    pass


class ActividadEtapaResponse(ActividadEtapaBase):
    id_etapa: int
    fecha_registro: Optional[datetime] = None

    class Config:
        from_attributes = True