from pydantic import BaseModel, Field,ConfigDict
from typing import Optional, List
from datetime import date


class CentroOperacionBase(BaseModel):
    id: int
    nombre: str

    model_config = ConfigDict(
        from_attributes=True
    )


class ResponsableBase(BaseModel):
    id_responsable: int
    nombre: str

    model_config = ConfigDict(
        from_attributes=True
    )


class ObraBase(BaseModel):
    nombre: str = Field(..., max_length=255)
    fecha_inicio: Optional[date] = None
    fecha_fin: Optional[date] = None
    tipo_id: int = Field(..., description="Tipo de obra")
    costo_proyecto: Optional[float] = 0.0
    id_responsable: Optional[int] = None
    id_empresa: int = Field(default=1, description="ID de la empresa")


class ObraCreate(ObraBase):
    centros_operacion: List[int] = Field(default=[], description="Lista de IDs de centros de operación")


class ObraUpdate(BaseModel):
    nombre: Optional[str] = Field(None, max_length=255)
    fecha_inicio: Optional[date] = None
    fecha_fin: Optional[date] = None
    tipo_id: Optional[int] = None
    costo_proyecto: Optional[float] = None
    id_responsable: Optional[int] = None
    centros_operacion: Optional[List[int]] = None


class ObraInDBBase(ObraBase):
    id_obra: int
    estado_id: int

    model_config = ConfigDict(
        from_attributes=True
    )


class Obra(ObraInDBBase):
    """Schema básico para compatibilidad con código existente"""
    pass


class ObraResponse(ObraInDBBase):
    """Schema completo con relaciones para las nuevas funcionalidades"""
    centros_operacion: List[CentroOperacionBase] = []
    responsable: Optional[ResponsableBase] = None

    model_config = ConfigDict(
        from_attributes=True
    )