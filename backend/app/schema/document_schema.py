from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DocumentBase(BaseModel):
    name: str
    path_document: str
    state_document: Optional[str] = "activo"
    id_project: int

class DocumentCreate(DocumentBase):
    pass

class Document(DocumentBase):
    id_document: int
    create_date: Optional[datetime]
    delete_date: Optional[datetime]

    class Config:
        orm_mode = True