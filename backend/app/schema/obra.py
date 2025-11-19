from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date

class CentroOperacionBase(BaseModel):
    id: int
    nombre: str

    class Config:
        from_attributes = True

class ResponsableBase(BaseModel):
    id_responsable: int
    nombre: str

    class Config:
        from_attributes = True

class ObraBase(BaseModel):
    nombre: str = Field(..., max_length=255, description="Nombre de la obra")
    tipo_id: int = Field(..., description="Tipo de obra")
    id_responsable: int = Field(..., description="ID del usuario responsable")
    fecha_inicio: Optional[date] = Field(None, description="Fecha de inicio")
    fecha_fin: Optional[date] = Field(None, description="Fecha de conclusión")
    costo_proyecto: Optional[float] = Field(0.0, description="Costo del proyecto")
    id_empresa: int = Field(1, description="ID de la empresa")

class ObraCreate(ObraBase):
    centros_operacion: List[int] = Field(..., description="Lista de IDs de centros de operación (mínimo 1)")

class ObraUpdate(BaseModel):
    nombre: Optional[str] = Field(None, max_length=255)
    fecha_inicio: Optional[date] = None
    fecha_fin: Optional[date] = None
    tipo_id: Optional[int] = None
    costo_proyecto: Optional[float] = None
    id_responsable: Optional[int] = None
    centros_operacion: Optional[List[int]] = None

class ObraInDBBase(BaseModel):
    id_obra: int
    nombre: str
    tipo_id: int
    estado_id: int
    fecha_inicio: Optional[date] = None
    fecha_fin: Optional[date] = None
    costo_proyecto: Optional[float] = 0.0
    id_responsable: Optional[int] = None  # ← CAMBIADO A OPCIONAL
    id_empresa: int = 1

    class Config:
        from_attributes = True

class Obra(ObraInDBBase):
    pass

class ObraResponse(ObraInDBBase):
    centros_operacion: List[CentroOperacionBase] = []
    responsable: Optional[ResponsableBase] = None  # ← CAMBIADO A OPCIONAL

    class Config:
        from_attributes = True