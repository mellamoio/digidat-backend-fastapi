from pydantic import BaseModel

class EstadoEtapaBase(BaseModel):
    id: int
    nombre: str
    orden: int
    color: str = '#722AE9'

    class Config:
        from_attributes = True

class EstadoEtapaResponse(EstadoEtapaBase):
    pass