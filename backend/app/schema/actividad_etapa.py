from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class ActividadEtapaBase(BaseModel):
    nombre_etapa: str
    comentario_etapa: Optional[str] = None
    id_obra: int
    id_estado_etapa: int
    orden: Optional[int] = 1


class ActividadEtapaCreate(ActividadEtapaBase):
    pass


class ActividadEtapaEdit(BaseModel):
    nombre_etapa: Optional[str] = None
    comentario_etapa: Optional[str] = None

    model_config = ConfigDict(
        from_attributes=True
    )


class ActividadEtapaResponse(ActividadEtapaBase):
    id_etapa: int
    fecha_registro: Optional[datetime] = None

    model_config = ConfigDict(
        from_attributes=True
    )