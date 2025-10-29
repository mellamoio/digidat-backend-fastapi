from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    addres: Optional[str] = None
    state_project: Optional[str] = "pendiente"
    start_date: Optional[date] = None
    end_date: Optional[date] = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id_project: int
    create_date: Optional[datetime]
    delete_date: Optional[datetime]

    class Config:
        from_attributes = True