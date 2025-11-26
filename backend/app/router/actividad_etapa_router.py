from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..model import actividad_etapa as model_actividad_etapa
from ..schema import actividad_etapa as schema_actividad_etapa
from ..config.db import get_db

router = APIRouter()

@router.post("/", response_model=schema_actividad_etapa.ActividadEtapa)
def create_actividad_etapa(actividad: schema_actividad_etapa.ActividadEtapaCreate, db: Session = Depends(get_db)):
    db_actividad = model_actividad_etapa.ActividadEtapa(**actividad.dict())
    db.add(db_actividad)
    db.commit()
    db.refresh(db_actividad)
    return db_actividad

@router.get("/", response_model=List[schema_actividad_etapa.ActividadEtapa])
def read_actividades_etapa(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    actividades = db.query(model_actividad_etapa.ActividadEtapa).offset(skip).limit(limit).all()
    return actividades

@router.get("/{actividad_id}", response_model=schema_actividad_etapa.ActividadEtapa)
def read_actividad_etapa(actividad_id: int, db: Session = Depends(get_db)):
    actividad = db.query(model_actividad_etapa.ActividadEtapa).filter(model_actividad_etapa.ActividadEtapa.id_actividad == actividad_id).first()
    if actividad is None:
        raise HTTPException(status_code=404, detail="Actividad de etapa no encontrada")
    return actividad

@router.put("/{actividad_id}", response_model=schema_actividad_etapa.ActividadEtapa)
def update_actividad_etapa(actividad_id: int, actividad: schema_actividad_etapa.ActividadEtapaUpdate, db: Session = Depends(get_db)):
    db_actividad = db.query(model_actividad_etapa.ActividadEtapa).filter(model_actividad_etapa.ActividadEtapa.id_actividad == actividad_id).first()
    if db_actividad is None:
        raise HTTPException(status_code=404, detail="Actividad de etapa no encontrada")
    for key, value in actividad.dict(exclude_unset=True).items():
        setattr(db_actividad, key, value)
    db.commit()
    db.refresh(db_actividad)
    return db_actividad

@router.delete("/{actividad_id}", response_model=schema_actividad_etapa.ActividadEtapa)
def delete_actividad_etapa(actividad_id: int, db: Session = Depends(get_db)):
    db_actividad = db.query(model_actividad_etapa.ActividadEtapa).filter(model_actividad_etapa.ActividadEtapa.id_actividad == actividad_id).first()
    if db_actividad is None:
        raise HTTPException(status_code=404, detail="Actividad de etapa no encontrada")
    db.delete(db_actividad)
    db.commit()
    return db_actividad