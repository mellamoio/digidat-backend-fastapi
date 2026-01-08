from typing import Optional
from pydantic import BaseModel, ConfigDict


class InformacionContratistaBase(BaseModel):
    id_responsable: int
    id_obra: int
    detalle: Optional[str] = None


class InformacionContratistaCreate(InformacionContratistaBase):
    pass


class InformacionContratistaUpdate(BaseModel):
    id_responsable: Optional[int] = None
    id_obra: Optional[int] = None
    detalle: Optional[str] = None


class InformacionContratistaResponse(InformacionContratistaBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True
    )
