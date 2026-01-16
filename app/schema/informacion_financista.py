from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime


class InformacionFinancistaBase(BaseModel):
    id_tipo_financista: int
    id_obra: int
    aspecto: str
    comentarios: Optional[str] = None
    id_categoria_documento: Optional[Any] = None
    responsables: Optional[Any] = None


class InformacionFinancistaCreate(InformacionFinancistaBase):
    pass


class InformacionFinancistaUpdate(BaseModel):
    id_tipo_financista: Optional[int] = None
    aspecto: Optional[str] = None
    comentarios: Optional[str] = None
    id_categoria_documento: Optional[Any] = None
    responsables: Optional[Any] = None


class InformacionFinancistaResponse(InformacionFinancistaBase):
    id: int
    
    class Config:
        from_attributes = True
        arbitrary_types_allowed = True


class InformacionFinancistaResponseProcessed(BaseModel):
    id: int
    id_tipo_financista: int
    id_obra: int
    aspecto: str
    comentarios: Optional[str] = None
    id_categoria_documento: Optional[List[dict]] = []
    responsables: Optional[List[dict]] = []
    
    class Config:
        from_attributes = True
