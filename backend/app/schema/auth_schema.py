from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class LoginRequest(BaseModel):
    correo: EmailStr
    password: str

class LoginUser(BaseModel):
    id_user: int
    name: str
    email: EmailStr
    id_role: int
    status: str
    url_photo: Optional[str] = None
    create_date: Optional[datetime] = None

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: LoginUser
