from pydantic import BaseModel, Field


class TipoGastoBase(BaseModel):
    nombre: str = Field(..., max_length=100)


class TipoGastoCreate(TipoGastoBase):
    pass


class TipoGastoResponse(TipoGastoBase):
    id: int

    class Config:
        from_attributes = True
