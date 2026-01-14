from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CategoriaDocumentoBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    estado: bool = True


class CategoriaDocumentoCreate(CategoriaDocumentoBase):
    pass


class CategoriaDocumentoUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    estado: Optional[bool] = None


class CategoriaDocumentoResponse(CategoriaDocumentoBase):
    id_categoria: int
    fecha_creacion: datetime
    
    class Config:
        from_attributes = True
