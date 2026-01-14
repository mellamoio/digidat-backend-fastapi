from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class DocumentoBase(BaseModel):
    nombre: str
    ruta: str
    mime_type: Optional[str] = None
    tamano_bytes: Optional[int] = None
    uploaded_by: Optional[int] = None
    id_obra: Optional[int] = None
    id_etapa: Optional[int] = None
    id_informacionfinancista: Optional[int] = Field(None, alias="id_informacion_financista")
    id_informacioncontratista: Optional[int] = Field(None, alias="id_informacion_contratista")
    id_pago: Optional[int] = None

    class Config:
        populate_by_name = True


class DocumentoCreate(DocumentoBase):
    pass


class DocumentoUpdate(BaseModel):
    nombre: Optional[str] = None
    ruta: Optional[str] = None
    mime_type: Optional[str] = None
    tamano_bytes: Optional[int] = None
    uploaded_by: Optional[int] = None
    id_obra: Optional[int] = None
    id_etapa: Optional[int] = None
    id_informacionfinancista: Optional[int] = Field(None, alias="id_informacion_financista")
    id_informacioncontratista: Optional[int] = Field(None, alias="id_informacion_contratista")
    id_pago: Optional[int] = None

    class Config:
        populate_by_name = True


class DocumentoResponse(DocumentoBase):
    id_documento: int
    create_date: datetime
    delete_date: Optional[datetime] = None

    class Config:
        from_attributes = True
        populate_by_name = True
