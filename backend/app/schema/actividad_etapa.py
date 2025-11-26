from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ActividadEtapaBase(BaseModel):
    id_obra: int
    id_estado_etapa: int
    nombre_actividad: str

class ActividadEtapaCreate(ActividadEtapaBase):
    pass

class ActividadEtapaUpdate(BaseModel):
    nombre_actividad: Optional[str] = None
    id_estado_etapa: Optional[int] = None

class ActividadEtapaInDBBase(ActividadEtapaBase):
    id_actividad: int
    fecha_registro: Optional[datetime] = None

    class Config:
        from_attributes = True

class ActividadEtapa(ActividadEtapaInDBBase):
    pass