<<<<<<< HEAD
from pydantic import BaseModel

class EstadoEtapaBase(BaseModel):
    id: int
    nombre: str
    orden: int
    color: str = '#722AE9'
=======
from pydantic import BaseModel, Field
from typing import Optional

class EstadoEtapaBase(BaseModel):
    nombre_estado: str = Field(..., max_length=100)
    descripcion: Optional[str] = None

class EstadoEtapaCreate(EstadoEtapaBase):
    pass

class EstadoEtapaUpdate(BaseModel):
    nombre_estado: Optional[str] = Field(None, max_length=100)
    descripcion: Optional[str] = None

class EstadoEtapaInDBBase(EstadoEtapaBase):
    id_estado: int
>>>>>>> fd98077156a3a68778da09b098a82ff54cd639f5

    class Config:
        from_attributes = True

class EstadoEtapaResponse(EstadoEtapaBase):
    pass