from pydantic import BaseModel, Field
from typing import Optional

class BeneficiarioBase(BaseModel):
    nombre: str = Field(..., max_length=255)
    documento: Optional[str] = Field(None, max_length=50)

class BeneficiarioCreate(BeneficiarioBase):
    pass

class BeneficiarioUpdate(BaseModel):
    nombre: Optional[str] = Field(None, max_length=255)
    documento: Optional[str] = Field(None, max_length=50)

class Beneficiario(BeneficiarioBase):
    id_beneficiario: int

    class Config:
        from_attributes = True
