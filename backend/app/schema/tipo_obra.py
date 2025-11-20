from pydantic import BaseModel

class TipoObraBase(BaseModel):
    nombre: str
    descripcion: str | None = None

class TipoObraCreate(TipoObraBase):
    pass

class TipoObra(TipoObraBase):
    id: int
    
    class Config:
        from_attributes = True
