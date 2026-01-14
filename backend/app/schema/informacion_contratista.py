from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime


class InformacionContratistaBase(BaseModel):
    id_tipo_contratista: int
    id_obra: int
    aspecto: str
    comentarios: Optional[str] = None
    id_categoria_documento: Optional[Any] = None
    responsables: Optional[Any] = None


class InformacionContratistaCreate(InformacionContratistaBase):
    pass


class InformacionContratistaUpdate(BaseModel):
    id_tipo_contratista: Optional[int] = None
    aspecto: Optional[str] = None
    comentarios: Optional[str] = None
    id_categoria_documento: Optional[Any] = None
    responsables: Optional[Any] = None


class InformacionContratistaResponse(InformacionContratistaBase):
    id: int
    
    class Config:
        from_attributes = True
        arbitrary_types_allowed = True


class InformacionContratistaResponseProcessed(BaseModel):
    id: int
    id_tipo_contratista: int
    id_obra: int
    aspecto: str
    comentarios: Optional[str] = None
    id_categoria_documento: Optional[List[dict]] = []
    responsables: Optional[List[dict]] = []
    
    class Config:
        from_attributes = True
