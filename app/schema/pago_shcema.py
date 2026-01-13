from pydantic import BaseModel, ConfigDict
from datetime import date
from decimal import Decimal
from typing import Optional


class PagoBase(BaseModel):
    id_obra: int
    id_beneficiario: int
    id_tipo_gasto: int
    id_estado_reembolso: int
    id_responsable: Optional[int]
    concepto_pago: str
    monto_pagado: Decimal
    fecha_pago: date

class PagoCreate(PagoBase):
    pass

class PagoUpdate(BaseModel):
    concepto_pago: Optional[str]
    monto_pagado: Optional[Decimal]
    fecha_pago: Optional[date]
    id_tipo_gasto: Optional[int]
    id_estado_reembolso: Optional[int]
    id_responsable: Optional[int]


class PagoResponse(PagoBase):
    id_pago: int

    model_config = ConfigDict(
        from_attributes=True
    )
