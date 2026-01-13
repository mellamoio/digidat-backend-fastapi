from pydantic import BaseModel, Field


# Schema base
class TipoGastoBase(BaseModel):
    nombre: str = Field(..., max_length=100)


# Schema para crear
class TipoGastoCreate(TipoGastoBase):
    pass


# Schema para respuesta
class TipoGastoResponse(TipoGastoBase):
    id: int

    class Config:
        from_attributes = True
