from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..model import etapa_ejecucion as model_etapa_ejecucion
from ..schema import etapa_ejecucion as schema_etapa_ejecucion
from ..config.db import get_db

router = APIRouter()

@router.post("/", response_model=schema_etapa_ejecucion.EtapaEjecucion)
def create_etapa_ejecucion(etapa_ejecucion: schema_etapa_ejecucion.EtapaEjecucionCreate, db: Session = Depends(get_db)):
    db_etapa_ejecucion = model_etapa_ejecucion.EtapaEjecucion(**etapa_ejecucion.dict())
    db.add(db_etapa_ejecucion)
    db.commit()
    db.refresh(db_etapa_ejecucion)
    return db_etapa_ejecucion

@router.get("/", response_model=List[schema_etapa_ejecucion.EtapaEjecucion])
def read_etapas_ejecucion(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    etapas_ejecucion = db.query(model_etapa_ejecucion.EtapaEjecucion).offset(skip).limit(limit).all()
    return etapas_ejecucion

@router.get("/{etapa_ejecucion_id}", response_model=schema_etapa_ejecucion.EtapaEjecucion)
def read_etapa_ejecucion(etapa_ejecucion_id: int, db: Session = Depends(get_db)):
    db_etapa_ejecucion = db.query(model_etapa_ejecucion.EtapaEjecucion).filter(model_etapa_ejecucion.EtapaEjecucion.id == etapa_ejecucion_id).first()
    if db_etapa_ejecucion is None:
        raise HTTPException(status_code=404, detail="Etapa de ejecución no encontrada")
    return db_etapa_ejecucion

@router.put("/{etapa_ejecucion_id}", response_model=schema_etapa_ejecucion.EtapaEjecucion)
def update_etapa_ejecucion(etapa_ejecucion_id: int, etapa_ejecucion: schema_etapa_ejecucion.EtapaEjecucionUpdate, db: Session = Depends(get_db)):
    db_etapa_ejecucion = db.query(model_etapa_ejecucion.EtapaEjecucion).filter(model_etapa_ejecucion.EtapaEjecucion.id == etapa_ejecucion_id).first()
    if db_etapa_ejecucion is None:
        raise HTTPException(status_code=404, detail="Etapa de ejecución no encontrada")
    
    for key, value in etapa_ejecucion.dict(exclude_unset=True).items():
        setattr(db_etapa_ejecucion, key, value)
    
    db.commit()
    db.refresh(db_etapa_ejecucion)
    return db_etapa_ejecucion

@router.delete("/{etapa_ejecucion_id}", response_model=schema_etapa_ejecucion.EtapaEjecucion)
def delete_etapa_ejecucion(etapa_ejecucion_id: int, db: Session = Depends(get_db)):
    db_etapa_ejecucion = db.query(model_etapa_ejecucion.EtapaEjecucion).filter(model_etapa_ejecucion.EtapaEjecucion.id == etapa_ejecucion_id).first()
    if db_etapa_ejecucion is None:
        raise HTTPException(status_code=404, detail="Etapa de ejecución no encontrada")
    
    db.delete(db_etapa_ejecucion)
    db.commit()
    return db_etapa_ejecucion
