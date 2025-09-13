from model.users import MyEnum
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class UserCreateSchema(BaseModel):
    name: str
    email: str
    id_role: int
    password_hash: str
    status: MyEnum = MyEnum.ACTIVO
    url_photo: Optional[str] = None

    model_config = {
        "use_enum_values": True
    }

class UserEditSchema(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    password_hash: Optional[str] = None
    id_role: Optional[int] = None
    status: Optional[MyEnum] = None
    url_photo: Optional[str] = None

    model_config = {
        "use_enum_values": True
    }

class UserSchema(BaseModel):
    id_user: int
    name: str
    email: str
    id_role: int
    status: MyEnum
    url_photo: Optional[str] = None
    create_date: Optional[datetime] = None
    delete_date: Optional[datetime] = None

    model_config = {
        "use_enum_values": True
    }

UserCreateSchema.model_rebuild()
UserSchema.model_rebuild()
UserEditSchema.model_rebuild()


