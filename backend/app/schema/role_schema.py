from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RoleCreateSchema(BaseModel):
    name:str

class RoleSchema(RoleCreateSchema):
    name:str
    create_date: Optional[datetime] = None
    delete_date: Optional[datetime] = None

RoleCreateSchema.model_rebuild()
RoleSchema.model_rebuild()