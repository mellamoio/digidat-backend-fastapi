from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.config.db import SessionLocal
from app.model.project import Project as ProjectModel
from app.schema.project_schema import Project as ProjectSchema, ProjectCreate

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Crear proyecto
@router.post("/", response_model=ProjectSchema, status_code=status.HTTP_201_CREATED)
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    db_project = ProjectModel(**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

# Listar proyectos
@router.get("/", response_model=List[ProjectSchema], status_code=status.HTTP_200_OK)
def read_projects(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(ProjectModel).offset(skip).limit(limit).all()

# Consultar por ID
@router.get("/{project_id}", response_model=ProjectSchema, status_code=status.HTTP_200_OK)
def read_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(ProjectModel).filter(ProjectModel.id_project == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    return project

# Actualizar proyecto
@router.put("/{project_id}", response_model=ProjectSchema, status_code=status.HTTP_200_OK)
def update_project(project_id: int, project: ProjectCreate, db: Session = Depends(get_db)):
    db_project = db.query(ProjectModel).filter(ProjectModel.id_project == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    for key, value in project.model_dump().items():
        setattr(db_project, key, value)
    db.commit()
    db.refresh(db_project)
    return db_project

# Eliminar proyecto
@router.delete("/{project_id}", status_code=status.HTTP_200_OK)
def delete_project(project_id: int, db: Session = Depends(get_db)):
    db_project = db.query(ProjectModel).filter(ProjectModel.id_project == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    db.delete(db_project)
    db.commit()
    return Response(content='{"detail": "Proyecto eliminado"}', media_type="application/json")