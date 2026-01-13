from pydantic import BaseModel, Field, field_validator
from datetime import date
from decimal import Decimal
from typing import Optional

class PagoBase(BaseModel):
    concepto: str = Field(..., min_length=1, max_length=255)  # ✅ AGREGAR
    id_obra: int
    monto_pagado: Decimal = Field(..., gt=0, decimal_places=2)
    fecha_pago: date
    id_tipo_gasto: int
    es_reembolsable: bool = False
    id_estado_reembolso: int
    id_responsable: Optional[int] = None
    id_beneficiario: Optional[int] = None

class PagoCreate(PagoBase):
    pass

class PagoUpdate(BaseModel):
    concepto: Optional[str] = Field(None, min_length=1, max_length=255)
    id_obra: Optional[int] = None
    monto_pagado: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    fecha_pago: Optional[date] = None
    id_tipo_gasto: Optional[int] = None
    es_reembolsable: Optional[bool] = None
    id_estado_reembolso: Optional[int] = None
    id_responsable: Optional[int] = None
    id_beneficiario: Optional[int] = None

class TipoGastoInResponse(BaseModel):
    id: int
    nombre: str

    class Config:
        from_attributes = True

class PagoResponse(PagoBase):
    id_pago: int
    tipo_gasto: TipoGastoInResponse

    class Config:
        from_attributes = True
