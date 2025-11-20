from pydantic import BaseModel
from typing import Optional


class EstadoEtapaBase(BaseModel):
    nombre: str
    orden: int
    color: Optional[str] = "#722AE9"


class EstadoEtapaCreate(EstadoEtapaBase):
    pass


class EstadoEtapaResponse(EstadoEtapaBase):
    id: int

    class Config:
        from_attributes = True