from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class InformacionContratistaBase(BaseModel):
    id_responsable: int
    razon_social: str = Field(..., max_length=255)
    nit: str = Field(..., max_length=50)
    direccion: str = Field(..., max_length=255)
    telefono: str = Field(..., max_length=20)
    email: str = Field(..., max_length=100)
    representante_legal: str = Field(..., max_length=255)
    cargo_representante: str = Field(..., max_length=255)
    numero_contrato: str = Field(..., max_length=100)
    objeto_contrato: str = Field(..., max_length=500)
    valor_contrato: float
    fecha_inicio: datetime
    fecha_fin: datetime
    plazo_ejecucion: int  # Días de plazo para la ejecución

class InformacionContratistaCreate(InformacionContratistaBase):
    pass

class InformacionContratistaUpdate(BaseModel):
    id_responsable: Optional[int] = None
    razon_social: Optional[str] = Field(None, max_length=255)
    nit: Optional[str] = Field(None, max_length=50)
    direccion: Optional[str] = Field(None, max_length=255)
    telefono: Optional[str] = Field(None, max_length=20)
    email: Optional[str] = Field(None, max_length=100)
    representante_legal: Optional[str] = Field(None, max_length=255)
    cargo_representante: Optional[str] = Field(None, max_length=255)
    numero_contrato: Optional[str] = Field(None, max_length=100)
    objeto_contrato: Optional[str] = Field(None, max_length=500)
    valor_contrato: Optional[float] = None
    fecha_inicio: Optional[datetime] = None
    fecha_fin: Optional[datetime] = None
    plazo_ejecucion: Optional[int] = None

class InformacionContratistaInDBBase(InformacionContratistaBase):
    id_informacion_contratista: int
    fecha_creacion: datetime
    fecha_actualizacion: datetime

    class Config:
        from_attributes = True

class InformacionContratista(InformacionContratistaInDBBase):
    pass
