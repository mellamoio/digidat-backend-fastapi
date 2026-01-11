from pydantic import BaseModel, ConfigDict
from typing import Optional


class EstadoEtapaBase(BaseModel):
    nombre: str
    orden: int
    color: Optional[str] = "#722AE9"


class EstadoEtapaCreate(EstadoEtapaBase):
    pass


class EstadoEtapaUpdate(BaseModel):
    nombre: Optional[str] = None
    orden: Optional[int] = None
    color: Optional[str] = None


class EstadoEtapaResponse(EstadoEtapaBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True
    )