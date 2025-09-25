# app/schemas/responsable.py
from pydantic import BaseModel, Field
from typing import Optional

class ResponsableBase(BaseModel):
    nombre: str = Field(..., max_length=100)
    cargo: Optional[str] = Field(None, max_length=100)
    telefono: Optional[str] = Field(None, max_length=20)
    email: Optional[str] = Field(None, max_length=100)

class ResponsableCreate(ResponsableBase):
    pass

class ResponsableUpdate(ResponsableBase):
    nombre: Optional[str] = Field(None, max_length=100)
    cargo: Optional[str] = Field(None, max_length=100)
    telefono: Optional[str] = Field(None, max_length=20)
    email: Optional[str] = Field(None, max_length=100)

class ResponsableInDBBase(ResponsableBase):
    id_responsable: int

    class Config:
        from_attributes = True

class Responsable(ResponsableInDBBase):
    pass
