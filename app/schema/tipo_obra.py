from pydantic import BaseModel, ConfigDict

class TipoObraBase(BaseModel):
    nombre: str
    descripcion: str | None = None

class TipoObraCreate(TipoObraBase):
    pass

class TipoObra(TipoObraBase):
    id: int
    
    model_config = ConfigDict(
        from_attributes=True
    )
