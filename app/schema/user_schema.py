from pydantic import BaseModel, ConfigDict
from app.model.users import StatusEnum
from typing import Optional

class UserCreateSchema(BaseModel):
    nombre: str
    correo: str
    id_role: int
    password: str
    estado: StatusEnum = StatusEnum.ACTIVO
    cargo: Optional[str] = None

    model_config = ConfigDict(
        use_enum_values=True
    )

class UserEditSchema(BaseModel):
    nombre: Optional[str] = None
    correo: Optional[str] = None
    password: Optional[str] = None
    id_role: Optional[int] = None
    estado: Optional[StatusEnum] = None
    cargo: Optional[str] = None

    model_config = ConfigDict(
        use_enum_values=True
    )

class UserSchema(BaseModel):
    id_responsable: int
    nombre: str
    correo: str
    id_role: int
    estado: StatusEnum
    cargo: Optional[str] = None

    model_config = ConfigDict(
        use_enum_values=True,
        from_attributes=True
    )