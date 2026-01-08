from typing import Optional
from pydantic import BaseModel, ConfigDict


class InformacionFinancistaBase(BaseModel):
    id_responsable: int
    id_obra: int
    detalle: Optional[str] = None


class InformacionFinancistaCreate(InformacionFinancistaBase):
    pass


class InformacionFinancistaUpdate(BaseModel):
    id_responsable: Optional[int] = None
    id_obra: Optional[int] = None
    detalle: Optional[str] = None


class InformacionFinancistaResponse(InformacionFinancistaBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True
    )
